import { create } from 'zustand';

export interface PlayerStats {
  strength: number;
  endurance: number;
  agility: number;
  power: number;
  level: number;
  totalXP: number;
}

interface ExerciseRecord {
  name: string;
  reps: number;
}

interface GameState {
  stats: PlayerStats;
  isExercising: boolean;
  currentExercise: string | null;
  exerciseProgress: number;
  message: string | null;
  history: ExerciseRecord[];
  characterScale: number;

  startExercise: (name: string) => void;
  completeExercise: () => void;
  tick: () => void;
  clearMessage: () => void;
}

const EXERCISE_CONFIG: Record<string, { stat: keyof PlayerStats; xp: number; duration: number }> = {
  barbell: { stat: 'strength', xp: 15, duration: 120 },
  dumbbell: { stat: 'strength', xp: 10, duration: 90 },
  kettlebell: { stat: 'power', xp: 12, duration: 100 },
  jumprope: { stat: 'agility', xp: 10, duration: 80 },
  pullup: { stat: 'endurance', xp: 12, duration: 100 },
  rings: { stat: 'power', xp: 20, duration: 150 },
};

const EXERCISE_NAMES: Record<string, string> = {
  barbell: 'Deadlift',
  dumbbell: 'Dumbbell Snatch',
  kettlebell: 'Kettlebell Swing',
  jumprope: 'Double Under',
  pullup: 'Pull-Up',
  rings: 'Ring Muscle-Up',
};

export const useGameStore = create<GameState>((set, get) => ({
  stats: { strength: 1, endurance: 1, agility: 1, power: 1, level: 1, totalXP: 0 },
  isExercising: false,
  currentExercise: null,
  exerciseProgress: 0,
  message: null,
  history: [],
  characterScale: 1,

  startExercise: (name: string) => {
    if (get().isExercising) return;
    set({
      isExercising: true,
      currentExercise: name,
      exerciseProgress: 0,
      message: EXERCISE_NAMES[name] || name,
    });
  },

  tick: () => {
    const { isExercising, currentExercise, exerciseProgress } = get();
    if (!isExercising || !currentExercise) return;

    const config = EXERCISE_CONFIG[currentExercise];
    if (!config) return;

    const newProgress = exerciseProgress + 1;
    if (newProgress >= config.duration) {
      get().completeExercise();
    } else {
      set({ exerciseProgress: newProgress });
    }
  },

  completeExercise: () => {
    const { currentExercise, stats, history } = get();
    if (!currentExercise) return;

    const config = EXERCISE_CONFIG[currentExercise];
    if (!config) return;

    const newStats = { ...stats };
    newStats[config.stat] += 1;
    newStats.totalXP += config.xp;

    const newLevel = Math.floor(newStats.totalXP / 50) + 1;
    newStats.level = newLevel;

    const newScale = 1 + (newLevel - 1) * 0.08;

    set({
      stats: newStats,
      isExercising: false,
      currentExercise: null,
      exerciseProgress: 0,
      characterScale: Math.min(newScale, 2.0),
      message: `+${config.xp} XP! ${EXERCISE_NAMES[currentExercise]} Complete!`,
      history: [...history, { name: currentExercise, reps: (history.filter(h => h.name === currentExercise).length) + 1 }],
    });

    setTimeout(() => get().clearMessage(), 2000);
  },

  clearMessage: () => set({ message: null }),
}));
