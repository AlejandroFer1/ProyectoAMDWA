import { Views } from "./views.js";
import { registerUser, logoutUser } from "./auth.js";
import { supabase } from "./supabase-client.js";
import { RoutineGenerator } from "./generator.js";

// Setup Router
export function initRouter() {
  // Handle Navigation Links
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.getAttribute("href"));
    }
  });

  // Handle Back/Forward Button
  window.addEventListener("popstate", router);

  // Initial Load
  router();
}

function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

async function router() {
  const path = window.location.hash.slice(1) || "home";
  const app = document.getElementById("app");

  // Simple Route Matching
  let view = Views[path];

  // Default to home if not found
  if (!view) {
    view = Views.home;
  }

  // Auth Guard for Profile
  if (path === "profile") {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("Debes iniciar sesión para ver tu licencia de cazador.");
      navigateTo("#register");
      return;
    }
  }

  // Render View
  app.innerHTML = view;

  // Post-Render Logic (Event Listeners, Data Fetching)
  if (path === "home") {
    initAnimations();
  } else if (path === "register") {
    setupRegisterLogic();
  } else if (path === "login") {
    setupLoginLogic();
  } else if (path === "profile") {
    setupProfileLogic();
  } else if (path === "philosophy") {
    initAnimations();
  }

  // Update Navbar Active State (Optional)
  window.scrollTo(0, 0);
}

function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".fade-in-up")
    .forEach((el) => observer.observe(el));
}

function setupRegisterLogic() {
  const form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");
      const userData = {
        username: formData.get("username"),
        age: parseInt(formData.get("age")),
        height: parseInt(formData.get("height")),
        weight: parseFloat(formData.get("weight")),
        activity: formData.get("activity"),
        goal: formData.get("goal"),
      };

      const success = await registerUser(email, password, userData);
      if (success) {
        navigateTo("#profile");
      }
    });
  }

  initAnimations();
}

function setupLoginLogic() {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert("Error al iniciar sesión: " + error.message);
        return;
      }

      navigateTo("#profile");
    });
  }
  initAnimations();
}

async function setupProfileLogic() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  // Fetch Profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading profile:", error);
    alert("Error cargando perfil: " + error.message);
    return;
  }

  if (!profile) {
    console.warn("Profile not found for user:", session.user.id);
    alert(
      "Perfil no encontrado. Tu usuario de Auth existe pero no tiene perfil. Por favor, contacta al soporte o intenta registrarte con otro email.",
    );
    return;
  }

  // Populate Data
  document.getElementById("player-name").textContent =
    profile.username || "Desconocido";
  document.getElementById("player-rank").textContent = profile.rank || "E";
  document.getElementById("player-level").textContent = profile.level || 1;
  document.getElementById("stat-str").textContent = profile.strength || 10;
  document.getElementById("stat-agi").textContent = profile.agility || 10;
  document.getElementById("stat-vit").textContent = profile.vitality || 10;

  let jobTitle = "Civil";
  if (profile.goal === "strength") jobTitle = "Guerrero (Fuerza)";
  if (profile.goal === "hypertrophy") jobTitle = "Tanque (Musculación)";
  if (profile.goal === "endurance") jobTitle = "Viajero (Cardio)";

  document.getElementById("player-job").textContent =
    profile.hunter_class !== "Civilian" ? profile.hunter_class : jobTitle;

  // Generator Button
  const btn = document.getElementById("generate-quest-btn");
  if (btn) {
    btn.addEventListener("click", async () => {
      const questBox = document.getElementById("daily-quest");
      const questContent = document.getElementById("quest-content");
      questContent.innerHTML = "<p>Invocando el sistema...</p>";
      questBox.style.display = "block";

      const generator = new RoutineGenerator(profile);
      const quest = await generator.generateDailyQuest();

      let html = `<h4 style="color:white; margin-bottom:10px;">${quest.title}</h4>`;
      html += `<ul style="text-align:left; margin-bottom:15px;">`;

      if (quest.exercises.length === 0) {
        html += `<li>No se encontraron ejercicios adecuados para tu rango.</li>`;
      } else {
        quest.exercises.forEach((ex) => {
          const loc =
            ex.location === "Home" ? "🏠" : ex.location === "Gym" ? "🏋️" : "🔄";
          html += `<li style="margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:5px;">
                        <div>
                            <span style="margin-right:8px;">${loc}</span>
                            <strong>${ex.name}</strong>
                        </div>
                        <span style="color:var(--color-primary)">${ex.sets} x ${ex.reps}</span>
                    </li>`;
        });
      }
      html += `</ul>`;
      html += `<p style="font-size:0.9rem; color:#aaa;">⚠️ <strong>Penalización:</strong> ${quest.penalty}</p>`;

      questContent.innerHTML = html;
      questBox.classList.remove("visible");
      setTimeout(() => questBox.classList.add("visible"), 50);
    });
  }

  initAnimations();
}

window.logout = async () => {
  await logoutUser();
  navigateTo("#home");
};
