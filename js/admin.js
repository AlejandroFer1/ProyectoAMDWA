import { supabase } from "./supabase-client.js";
import { logoutUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Guard de Seguridad: Verificar Autenticación
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (!session) {
    alert("Acceso denegado. Debes iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  // 2. Verificar Rol de Administrador
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin, username")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile || !profile.is_admin) {
    alert(
      "ACCESO RESTRINGIDO. No tienes permisos de Arquitecto (Administrador).",
    );
    window.location.href = "perfil.html";
    return;
  }

  // El usuario es admin. Cargar datos.
  console.log("¡Bienvenido al sistema, Arquitecto " + profile.username + "!");
  await fetchAllUsers();

  // Escuchar Cerrar Sesión
  document
    .getElementById("btn-logout-admin")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      await logoutUser();
      window.location.href = "index.html";
    });

  // Escuchar Fomulario de Edición
  document
    .getElementById("edit-user-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await saveUserEdits();
    });

  // LÓGICA DE SINCRONIZACIÓN AUTOMÁTICA EN MODAL
  const inputLvl = document.getElementById("edit-level");
  const inputExp = document.getElementById("edit-exp");
  const inputRank = document.getElementById("edit-rank");
  const inputStr = document.getElementById("edit-str");
  const inputAgi = document.getElementById("edit-agi");
  const inputVit = document.getElementById("edit-vit");

  // Al cambiar Experiencia -> Recalcular Nivel y Rango
  inputExp.addEventListener("input", (e) => {
    const currentExp = parseInt(e.target.value) || 0;
    const calcLvl = Math.floor(currentExp / 100) + 1;
    inputLvl.value = calcLvl;

    // Asignar Rango
    if (calcLvl >= 50) inputRank.value = "S";
    else if (calcLvl >= 40) inputRank.value = "A";
    else if (calcLvl >= 30) inputRank.value = "B";
    else if (calcLvl >= 20) inputRank.value = "C";
    else if (calcLvl >= 10) inputRank.value = "D";
    else inputRank.value = "E";
  });

  // Al cambiar Nivel -> Recalcular Experiencia Base y Rango
  inputLvl.addEventListener("input", (e) => {
    let calcLvl = parseInt(e.target.value) || 1;
    if (calcLvl < 1) {
      calcLvl = 1;
      e.target.value = 1;
    }

    // Exp Base necesaria para entrar a ese nivel
    inputExp.value = (calcLvl - 1) * 100;

    // Asignar Rango
    if (calcLvl >= 50) inputRank.value = "S";
    else if (calcLvl >= 40) inputRank.value = "A";
    else if (calcLvl >= 30) inputRank.value = "B";
    else if (calcLvl >= 20) inputRank.value = "C";
    else if (calcLvl >= 10) inputRank.value = "D";
    else inputRank.value = "E";
  });

  // Buff del Arquitecto: Subir una Stat pura sube +15 EXP
  // Para evitar un bucle infinito sumándole EXP cada vez que borran y escriben, lo haremos con "change"
  const statChangeHandler = (e, originalStatKey) => {
    if (!window.currentUserOriginalStats) return;
    const newVal = parseInt(e.target.value) || 0;
    const oldVal = window.currentUserOriginalStats[originalStatKey];

    if (newVal > oldVal) {
      const diff = newVal - oldVal;
      const currentExp = parseInt(inputExp.value) || 0;
      inputExp.value = currentExp + diff * 15;
      inputExp.dispatchEvent(new Event("input")); // Disparar recalculador de LVL/Rank

      // Update original to prevent double sum if they keep adding
      window.currentUserOriginalStats[originalStatKey] = newVal;
    }
  };

  inputStr.addEventListener("change", (e) => statChangeHandler(e, "strength"));
  inputAgi.addEventListener("change", (e) => statChangeHandler(e, "agility"));
  inputVit.addEventListener("change", (e) => statChangeHandler(e, "vitality"));
});

async function fetchAllUsers() {
  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Descargando datos del Sistema...</td></tr>`;

  // Traer todos los perfiles de la base de datos
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("rank", { ascending: false });

  if (error) {
    console.error("Error al cargar usuarios:", error);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error al conectar con la base de datos.</td></tr>`;
    return;
  }

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay cazadores registrados.</td></tr>`;
    return;
  }

  // Renderizar la tabla
  tbody.innerHTML = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");

    // Prevenir que el admin se borre a sí mismo tan fácilmente en UI
    const deleteBtnHTML = u.is_admin
      ? `<button class="btn btn-small" disabled style="background:#555; cursor:not-allowed;">Admin</button>`
      : `<button class="btn btn-small btn-danger" onclick="deleteUser('${u.id}', '${u.username}')">Expulsar</button>`;

    tr.innerHTML = `
      <td style="font-size: 0.8rem; color:#888;">${u.id.substring(0, 8)}...</td>
      <td style="font-weight:bold; color:var(--color-primary);">${u.username || "Desconocido"}</td>
      <td>${u.hunter_class || "Civil"}</td>
      <td style="font-weight:bold;">${u.rank || "E"}</td>
      <td>${u.level || 1}</td>
      <td>${u.experience_points || 0}</td>
      <td>
        <button class="btn btn-small btn-edit" onclick="openEditModal('${u.id}')">Editar</button>
        ${deleteBtnHTML}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Variables Globales para la edición
let currentEditingUserId = null;

window.openEditModal = async (userId) => {
  currentEditingUserId = userId;

  // Buscar datos actuales del usuario seleccionado
  const { data: user, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    alert("Error al obtener los datos del jugador.");
    return;
  }

  // Rellenar Modal
  document.getElementById("edit-id").value = user.id;
  document.getElementById("edit-username").value = user.username;
  document.getElementById("edit-level").value = user.level || 1;
  document.getElementById("edit-exp").value = user.experience_points || 0;
  document.getElementById("edit-rank").value = user.rank || "E";

  // Guardamos stats originales para calcular las diferencias
  window.currentUserOriginalStats = {
    strength: user.strength || 10,
    agility: user.agility || 10,
    vitality: user.vitality || 10,
  };

  document.getElementById("edit-str").value =
    window.currentUserOriginalStats.strength;
  document.getElementById("edit-agi").value =
    window.currentUserOriginalStats.agility;
  document.getElementById("edit-vit").value =
    window.currentUserOriginalStats.vitality;
  document.getElementById("edit-premium").value = user.is_premium
    ? "true"
    : "false";

  // Mostrar Modal
  document.getElementById("edit-modal").classList.add("active");
};

window.closeEditModal = () => {
  document.getElementById("edit-modal").classList.remove("active");
  currentEditingUserId = null;
};

async function saveUserEdits() {
  const level = parseInt(document.getElementById("edit-level").value);
  const exp = parseInt(document.getElementById("edit-exp").value);
  const rank = document.getElementById("edit-rank").value;
  const str = parseInt(document.getElementById("edit-str").value);
  const agi = parseInt(document.getElementById("edit-agi").value);
  const vit = parseInt(document.getElementById("edit-vit").value);
  const isPremium = document.getElementById("edit-premium").value === "true";

  if (!currentEditingUserId) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      level: level,
      experience_points: exp,
      rank: rank,
      strength: str,
      agility: agi,
      vitality: vit,
      is_premium: isPremium,
    })
    .eq("id", currentEditingUserId);

  if (error) {
    console.error("Error actualizando stats:", error);
    alert("Error al guardar cambios: " + error.message);
  } else {
    alert("Estadísticas del cazador actualizadas con éxito.");
    closeEditModal();
    fetchAllUsers(); // Recargar tabla
  }
}

window.deleteUser = async (userId, username) => {
  const confirmDelete = confirm(
    `⚠️ CUIDADO: ¿Estás seguro de que quieres EXPULSAR DEL SISTEMA al Cazador [${username}]? \n\nEsta acción borrará su perfil y progreso (soft ban).`,
  );

  if (!confirmDelete) return;

  // Realiza el borrado en la base de datos (Requiere políticas RLS habilitadas para DELETE)
  const { error } = await supabase.from("profiles").delete().eq("id", userId);

  if (error) {
    console.error("Error al expulsar al cazador:", error);
    alert("Error del Sistema: " + error.message);
  } else {
    alert(
      `El Cazador [${username}] ha sido eliminado del sistema satisfactoriamente.`,
    );
    fetchAllUsers(); // Recargar la tabla
  }
};
