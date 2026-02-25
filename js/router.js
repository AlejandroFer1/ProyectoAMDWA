import { Views } from "./views.js";
import { registerUser, logoutUser } from "./auth.js";
import { supabase } from "./supabase-client.js";
import { RoutineGenerator } from "./generator.js";
import { Rewards } from "./rewards.js";

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
        // Redirigir al pago inmediatamente al registrarse (ya que is_premium es false por defecto)
        window.location.href = "pago.html";
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

      // Verificar estatus premium
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", data.user.id)
        .single();

      if (profile && profile.is_premium) {
        navigateTo("#profile");
      } else {
        // Redirigir al pago si no es premium
        window.location.href = "pago.html";
      }
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

  // Rewards Logic en Router
  const rewardsPanel = document.getElementById("rewards-panel");
  if (rewardsPanel) {
    const benefits = Rewards.getRankBenefits(profile.rank || "E");
    rewardsPanel.style.display = "block";
    const rewardMessage = document.getElementById("reward-message");
    const couponContainer = document.getElementById("reward-coupon-container");
    const couponCode = document.getElementById("reward-coupon-code");

    if (rewardMessage) {
      rewardMessage.innerHTML = `<span style="color: ${benefits.color}; font-weight: bold;">Rango ${profile.rank || "E"}:</span> ${benefits.message}`;
    }
    if (benefits.couponCode && couponContainer && couponCode) {
      couponContainer.style.display = "flex";
      couponCode.textContent = benefits.couponCode;
      couponCode.style.color = benefits.color;
    } else if (couponContainer) {
      couponContainer.style.display = "none";
    }
  }

  // El botón de generación y la lógica de misiones se gestionan nativamente en perfil.html

  initAnimations();
}

window.logout = async () => {
  await logoutUser();
  navigateTo("#home");
};
