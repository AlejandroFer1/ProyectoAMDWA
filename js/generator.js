import { supabase } from "./supabase-client.js";

export class RoutineGenerator {
  constructor(userProfile) {
    this.user = userProfile;
  }

  // 1. Calculate Active Rank based on Performance Logs (The "System" Logic)
  async getCalculatedRank() {
    const baseRank = this.user.rank || "E";

    // Fetch recent logs to check strength
    const { data: logs } = await supabase
      .from("performance_logs")
      .select("reps_completed, rpe")
      .order("date_logged", { ascending: false })
      .limit(10);

    if (!logs || logs.length === 0) return baseRank;

    // Calculate Average Performance
    const totalReps = logs.reduce(
      (sum, log) => sum + (log.reps_completed || 0),
      0,
    );
    const avgReps = totalReps / logs.length;

    // "System" Upgrade Logic
    // If user averages > 15 reps, they are too strong for current rank -> Promote internally
    if (avgReps > 15 && baseRank === "E") return "D";
    if (avgReps > 12 && baseRank === "D") return "C";
    if (avgReps > 10 && baseRank === "C") return "B";

    return baseRank;
  }

  // Helper to get a multiplier based on rank (higher rank = higher multiplier)
  getRankMultiplier(rank) {
    const rankOrder = ["E", "D", "C", "B", "A", "S"];
    const idx = rankOrder.indexOf(rank);
    return idx >= 0 ? idx + 1 : 1; // E=1, D=2, etc.
  }

  // Helper to calculate reps based on exercise type and multiplier
  calculateReps(exercise, multiplier) {
    if (exercise.type === "Strength") {
      return `${Math.max(3, 8 - multiplier)}-${Math.max(5, 12 - multiplier)}`;
    } else if (exercise.type === "Cardio" || exercise.type === "Bodyweight") {
      return `${Math.max(10, 15 + multiplier * 2)}+`;
    } else {
      // Default for other types
      return `${Math.max(5, 10 + multiplier)}-${Math.max(8, 15 + multiplier)}`;
    }
  }

  async checkTodayQuest() {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Check if a "Daily Quest" routine exists for today
    const { data: routines, error } = await supabase
      .from("routines")
      .select(
        `
            *,
            routine_exercises (
                sets,
                reps,
                order_index,
                exercises (*)
            )
        `,
      )
      .eq("user_id", this.user.id)
      .eq("date_generated", today) // Robust check using dedicated column
      .limit(1);

    if (error) {
      console.error("Error checking today's quest:", error);
      return null;
    }

    if (routines && routines.length > 0) {
      const routine = routines[0];
      // Format to match the generator output structure
      return {
        routine_id: routine.routine_id, // Return ID for completion updates
        title: routine.title,
        exercises: routine.routine_exercises
          .sort((a, b) => a.order_index - b.order_index)
          .map((re) => ({
            ...re.exercises, // Base exercise data
            sets: re.sets,
            reps: re.reps,
            location: re.exercises.location || "Both",
            // Add any other necessary mapping
          })),
        reward: "Recuperación de Estado (Ya reclamada si completada)", // Logic could be improved here
        penalty: routine.penalty || "Castigo: 4 horas de supervivencia",
        is_completed: routine.is_completed, // Pass completion status
      };
    }

    return null;
  }

  async saveQuestAsRoutine(quest) {
    const today = new Date().toISOString().split("T")[0];
    const fullTitle = `${quest.title} [${today}]`;

    // 1. Insert Routine Header
    const { data: routineData, error: routineError } = await supabase
      .from("routines")
      .insert([
        {
          user_id: this.user.id,
          title: fullTitle,
          penalty: quest.penalty,
          date_generated: today, // Explicitly set the date
          is_completed: false,
        },
      ])
      .select()
      .single();

    if (routineError) {
      console.error("Error saving routine header:", routineError);
      return null;
    }

    const routineId = routineData.routine_id;

    // 2. Insert Exercises
    const exercisesToInsert = quest.exercises.map((ex, index) => ({
      routine_id: routineId,
      exercise_id: ex.exercise_id, // Ensure this exists on the exercise object
      sets: ex.sets,
      reps: ex.reps,
      order_index: index + 1,
    }));

    const { error: exercisesError } = await supabase
      .from("routine_exercises")
      .insert(exercisesToInsert);

    if (exercisesError) {
      console.error("Error saving routine exercises:", exercisesError);
      // Optional: Rollback routine header if exercises fail, but keep it simple for now
    }

    // Return updated title and ID
    quest.title = fullTitle;
    quest.routine_id = routineId;
    return quest;
  }

  async generateDailyQuest(focus = "Balanced") {
    // 1. Check if one exists first
    const existingQuest = await this.checkTodayQuest();
    if (existingQuest) {
      console.log("Found existing daily quest for today.");
      return existingQuest;
    }

    // 2. Logic to Generate New Quest
    const activeRank = await this.getCalculatedRank();

    // Use the passed focus or fallback to user goal, or default to Balanced
    const questFocus = focus || this.user.goal || "Balanced";

    // Fetch eligible exercises
    const { data: exercises, error } = await supabase
      .from("exercises")
      .select("*");

    if (error) {
      console.error("Error fetching exercises:", error);
      return null;
    }

    let title = "";
    let routine = [];
    let sets = 3;
    let reps = "10";

    // Filter Logic based on Focus
    if (questFocus === "Strength" || questFocus === "strength") {
      title = `Entrenamiento de Poder [Rango ${activeRank}]`;
      routine = exercises
        .filter((ex) => ex.type === "Strength")
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      sets = 5;
      reps = "3-5";
    } else if (questFocus === "Hypertrophy" || questFocus === "hypertrophy") {
      title = `Desarrollo Físico [Rango ${activeRank}]`;
      routine = exercises
        .filter(
          (ex) => ex.type === "Strength" || ex.muscle_group === "Full Body",
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      sets = 4;
      reps = "8-12";
    } else if (
      questFocus === "Agility" ||
      questFocus === "agility" ||
      questFocus === "Cardio"
    ) {
      title = `Velocidad del Rayo [Rango ${activeRank}]`;
      routine = exercises
        .filter((ex) => ex.type === "Cardio" || ex.type === "Explosive")
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      sets = 3;
      reps = "15+";
    } else if (questFocus === "Vitality" || questFocus === "vitality") {
      title = `Resistencia de Hierro [Rango ${activeRank}]`;
      routine = exercises
        .filter(
          (ex) =>
            ex.type === "Stamina" ||
            ex.type === "Cardio" ||
            ex.muscle_group === "Core",
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      sets = 3;
      reps = "12-15";
    } else {
      // Balanced / Mixed
      title = `Supervivencia Diaria [Rango ${activeRank}]`;

      // Mix: 2 Strength, 2 Cardio/Agility, 1 Core/Vitality
      const strengthEx = exercises
        .filter((ex) => ex.type === "Strength")
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const cardioEx = exercises
        .filter((ex) => ex.type === "Cardio" || ex.type === "Explosive")
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const otherEx = exercises
        .filter((ex) => !strengthEx.includes(ex) && !cardioEx.includes(ex))
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);

      routine = [...strengthEx, ...cardioEx, ...otherEx];
      // Shuffle the results
      routine.sort(() => 0.5 - Math.random());

      sets = 3;
      reps = "10-12";
    }

    // If 'Active Rank' > 'Base Rank', increase intensity
    if (activeRank !== (this.user.rank || "E")) {
      title += " (🔥 SOBRECARGA)";
      reps += " + 2";
    }

    const generatedQuest = {
      title: title,
      exercises: routine.map((ex) => ({
        ...ex,
        sets: sets,
        reps: reps,
        location: ex.location || "Both",
      })),
      reward: "Recuperación de Estado",
      penalty: "Castigo: 4 horas de supervivencia",
    };

    // 3. Save the new quest
    await this.saveQuestAsRoutine(generatedQuest);

    return generatedQuest;
  }
}
