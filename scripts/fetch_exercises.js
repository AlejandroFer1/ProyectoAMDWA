import { createClient } from "@supabase/supabase-js";

// Hardcoded for this script usage as seen in client.js
const supabaseUrl = "https://pkatbjxnyucqnetzmcqv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYXRianhueXVjcW5ldHptY3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTg3NDYsImV4cCI6MjA1MzYzNDc0Nn0.2E2Xk-g3tD4Xf0Xlq8vj5t8b3y4z9f0q2d5j0k5l0m5";

const supabase = createClient(supabaseUrl, supabaseKey);

async function listExercises() {
  const { data, error } = await supabase.from("exercises").select("*");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

listExercises();
