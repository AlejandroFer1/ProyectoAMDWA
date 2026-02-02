import { supabase } from "./supabase-client.js";

export async function registerUser(email, password, userData) {
  // 1. Sign Up with Metadata (Trigger will create profile)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: userData.username,
        age: userData.age,
        weight_kg: userData.weight,
        activity_level: userData.activity,
        goal: userData.goal,
        hunter_class: "Civilian",
        rank: "E",
        level: 1,
        experience_points: 0,
      },
    },
  });

  if (authError) {
    console.error("Error signing up:", authError);
    alert("Error en el registro: " + authError.message);
    return false;
  }

  if (authData.user) {
    alert("Registro Exitoso! Bienvenido, Cazador.");
    // If email confirmation is enabled, we might not have a session yet.
    // But the profile should be created by the trigger.
    // We can redirect to login or profile.
    window.location.href = "perfil.html";
    return true;
  }
}

export async function loginWithUsernameOrEmail(identifier, password) {
  let email = identifier;

  // Check if input is NOT an email (simple check: no @ symbol)
  if (!identifier.includes("@")) {
    // Assume it's a username, try to find the email
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .maybeSingle();

    if (error || !data) {
      alert("Usuario no encontrado.");
      return false;
    }
    email = data.email;
  }

  return await loginUser(email, password);
}

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    alert("Error al iniciar sesión: " + error.message);
    return false;
  }

  window.location.href = "perfil.html";
  return true;
}

export async function logoutUser() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
