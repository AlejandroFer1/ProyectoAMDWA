import { createClient } from "@supabase/supabase-js";

// Configuration from supabase-client.js
const supabaseUrl = "https://jiazhlyumfugomworbxq.supabase.co";
const supabaseKey = "sb_publishable_zVYxWKrvyWlGmcGgaI0gYA_3_7zD7O9";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExercises() {
  console.log("Checking exercises table...");

  // Select all columns to see what exists
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("name");

  if (error) {
    console.error("Error fetching exercises:", error);
    return;
  }

  if (exercises.length === 0) {
    console.log("No exercises found.");
  } else {
    console.log("--- EXERCISE LIST ---");
    exercises.forEach((ex) => console.log(ex.name));
    console.log("--- END LIST ---");
  }
}

checkExercises();
