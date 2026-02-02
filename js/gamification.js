export class Gamification {
  static getXPByRank(rank) {
    const xpTable = {
      E: 10,
      D: 20,
      C: 40,
      B: 80,
      A: 150,
      S: 300,
    };
    return xpTable[rank] || 10;
  }

  static calculateLevel(currentXp) {
    // Simple formula: Level = sqrt(XP / 10) or linear thresholds
    // Let's use linear scaling for control: Level * 100 XP required per level
    // Level 1: 0-100
    // Level 2: 101-200
    return Math.floor(currentXp / 100) + 1;
  }

  static calculateRank(level) {
    if (level >= 50) return "S";
    if (level >= 40) return "A";
    if (level >= 30) return "B";
    if (level >= 20) return "C";
    if (level >= 10) return "D";
    return "E";
  }

  static getLevelProgress(currentXp) {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevelXp = currentLevel * 100;
    const prevLevelXp = (currentLevel - 1) * 100;

    const xpInLevel = currentXp - prevLevelXp;
    const xpNeeded = nextLevelXp - prevLevelXp; // Always 100 with this linear model

    return Math.floor((xpInLevel / xpNeeded) * 100);
  }

  static calculateStatsGrowth(completedExercises, missedExercises = []) {
    let change = { strength: 0, agility: 0, vitality: 0, xp: 0 };

    // Gains - Logic: Specific exercises boost specific stats
    completedExercises.forEach((ex) => {
      // 1. Strength Logic
      if (
        ex.type === "Strength" ||
        ["Chest", "Back", "Shoulders", "Arms", "Legs"].includes(ex.muscle_group)
      ) {
        // Compound movements give more strength
        if (ex.muscle_group === "Full Body" || ex.muscle_group === "Legs") {
          change.strength += 1.5;
        } else {
          change.strength += 1;
        }
      }

      // 2. Agility Logic
      if (
        ex.type === "Cardio" ||
        ex.type === "Explosive" ||
        ex.type === "Plyometrics"
      ) {
        change.agility += 1;
      }

      // 3. Vitality Logic
      if (
        ex.type === "Stamina" ||
        ex.type === "Cardio" ||
        ex.muscle_group === "Core"
      ) {
        change.vitality += 1;
      }

      // Base XP per exercise
      change.xp += 15;
    });

    // Penalties for Missed (Optional, kept minimal as requested focus was on gains)
    if (missedExercises.length > 0) {
      change.xp -= missedExercises.length * 5;
    }

    // Rounding
    change.strength = Math.floor(change.strength);
    change.agility = Math.floor(change.agility);
    change.vitality = Math.floor(change.vitality);

    return change;
  }

  static calculateFatigueChange(totalExercises, completedCount) {
    // New Logic: Fatigue INCREASES with exercise.
    // Base fatigue per exercise completed
    const fatiguePerExercise = 5;

    // Penalty for failure? Maybe failure causes stress (fatigue) too?
    // Let's say:
    // - Completed exercise: +5 Fatigue (Physical exertion)
    // - Missed exercise: +2 Fatigue (Stress/Mental load) OR 0.

    // User request: "If you do an exercise, fatigue increases"
    const increase = completedCount * fatiguePerExercise;

    return increase;
  }

  static calculatePassiveRecovery(lastUpdateStr, currentFatigue) {
    if (!lastUpdateStr || currentFatigue <= 0) return 0;

    const lastUpdate = new Date(lastUpdateStr);
    const now = new Date();

    // Difference in hours
    const diffMs = now - lastUpdate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 0;

    // Rate: 5 Fatigue per hour
    const recovery = diffHours * 5;

    // Cannot recover below 0
    const newFatigue = Math.max(0, currentFatigue - recovery);
    return currentFatigue - newFatigue; // Return amount recovered
  }
}
