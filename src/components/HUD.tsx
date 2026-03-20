import { useGameStore } from '../store/gameStore';

const STAT_ICONS: Record<string, string> = {
  strength: 'STR',
  endurance: 'END',
  agility: 'AGI',
  power: 'PWR',
};

const STAT_COLORS: Record<string, string> = {
  strength: '#ff4444',
  endurance: '#44cc44',
  agility: '#4488ff',
  power: '#ffaa00',
};

export function HUD() {
  const stats = useGameStore(s => s.stats);
  const isExercising = useGameStore(s => s.isExercising);
  const currentExercise = useGameStore(s => s.currentExercise);
  const exerciseProgress = useGameStore(s => s.exerciseProgress);
  const message = useGameStore(s => s.message);

  const config: Record<string, number> = {
    barbell: 120, dumbbell: 90, kettlebell: 100,
    jumprope: 80, pullup: 100, rings: 150,
  };
  const maxProgress = currentExercise ? config[currentExercise] || 100 : 100;
  const progressPercent = (exerciseProgress / maxProgress) * 100;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', fontFamily: "'Press Start 2P', monospace",
      zIndex: 10,
    }}>
      {/* Level badge */}
      <div style={{
        position: 'absolute', top: 20, left: 20,
        background: 'linear-gradient(135deg, #ff6644, #ff4488)',
        padding: '8px 16px', borderRadius: 8,
        color: 'white', fontSize: 14, fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        LV.{stats.level}
        <span style={{ fontSize: 10, marginLeft: 8, opacity: 0.8 }}>
          XP {stats.totalXP}
        </span>
      </div>

      {/* Stats panel */}
      <div style={{
        position: 'absolute', top: 60, left: 20,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {Object.entries(STAT_ICONS).map(([key, label]) => (
          <div key={key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.6)', padding: '4px 12px',
            borderRadius: 6, borderLeft: `3px solid ${STAT_COLORS[key]}`,
          }}>
            <span style={{ color: STAT_COLORS[key], fontSize: 10, fontWeight: 'bold', width: 30 }}>
              {label}
            </span>
            <div style={{
              width: 60, height: 6, background: 'rgba(255,255,255,0.1)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min((stats[key as keyof typeof stats] as number) * 10, 100)}%`,
                height: '100%', background: STAT_COLORS[key],
                borderRadius: 3, transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{ color: 'white', fontSize: 10 }}>
              {stats[key as keyof typeof stats]}
            </span>
          </div>
        ))}
      </div>

      {/* Exercise progress bar */}
      {isExercising && (
        <div style={{
          position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
        }}>
          <div style={{
            color: '#ffcc00', fontSize: 12, marginBottom: 8,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}>
            {message}
          </div>
          <div style={{
            width: 240, height: 12, background: 'rgba(0,0,0,0.7)',
            borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{
              width: `${progressPercent}%`, height: '100%',
              background: 'linear-gradient(90deg, #ffcc00, #ff6644)',
              borderRadius: 6, transition: 'width 0.05s linear',
            }} />
          </div>
        </div>
      )}

      {/* Floating message */}
      {!isExercising && message && (
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          color: '#ffcc00', fontSize: 16, fontWeight: 'bold',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          animation: 'fadeUp 2s ease forwards',
        }}>
          {message}
        </div>
      )}

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)', fontSize: 10,
        background: 'rgba(0,0,0,0.4)', padding: '6px 16px', borderRadius: 8,
      }}>
        WASD: Move | SPACE: Exercise
      </div>
    </div>
  );
}
