import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { 
  FlagIcon,
  UsersIcon,
  LessonIcon,
  StarIcon,
  TrophyIcon,
  ActiveIcon,
  WarningIcon,
} from '../icons';

const STAGES = [
  { id: 'inquiry', label: 'Inquiry', icon: FlagIcon, hole: 1, par: 2 },
  { id: 'booking', label: 'Booking', icon: UsersIcon, hole: 2, par: 3 },
  { id: 'lesson', label: 'Lesson', icon: LessonIcon, hole: 3, par: 5 },
  { id: 'member', label: 'Member', icon: StarIcon, hole: 4, par: 7 },
  { id: 'league', label: 'League', icon: TrophyIcon, hole: 5, par: 14 },
];

export const CustomerJourney = ({
  currentStage = 'lesson',
  stagesCompleted = ['inquiry', 'booking'],
  startDate,
  className = '',
  style = {},
}) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);
  const daysActive = startDate 
    ? Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPar = STAGES.reduce((sum, s) => sum + s.par, 0);
  const currentPace = daysActive;
  const isOnTrack = currentPace <= totalPar;

  return (
    <Card variant="default" padding="lg" className={className} style={style}>
      <CardHeader style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            CUSTOMER LIFECYCLE
          </CardTitle>
          <span style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Hole {currentIndex + 1} of {STAGES.length}
          </span>
        </div>
      </CardHeader>

      {/* Course visualization */}
      <div style={{ marginBottom: '1.5rem' }}>
        {/* Hole markers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}>
          {STAGES.map((stage, index) => {
            const isCompleted = stagesCompleted.includes(stage.id);
            const isCurrent = stage.id === currentStage;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flex: 1,
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? 'var(--color-success)' : 
                                  isCurrent ? 'var(--color-gold)' : 'var(--color-surface-elevated)',
                  color: isCompleted || isCurrent ? (isCompleted ? 'white' : 'var(--color-surface-dark)') : 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(212, 175, 55, 0.2)' : 'none',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${isCompleted ? 'var(--color-success)' : isCurrent ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                  <Icon size={18} />
                </div>

                {/* Hole number */}
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  color: isCurrent ? 'var(--color-gold)' : 'var(--color-text-muted)',
                }}>
                  Hole {stage.hole}
                </span>

                {/* Stage label */}
                <span style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCompleted || isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  textAlign: 'center',
                }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'relative',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '2px',
          margin: '1rem 0',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${((currentIndex) / (STAGES.length - 1)) * 100}%`,
            background: 'var(--gradient-gold)',
            borderRadius: '2px',
            transition: 'width 1s ease-out',
          }} />

          {/* Golf ball position */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#d4af37',
            border: '3px solid #0a0a0a',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: 'var(--color-surface-elevated)',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Par (Target)
            </div>
            <div className="mono" style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}>
              {totalPar} days
            </div>
          </div>

          <div>
            <div style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Current Pace
            </div>
            <div className="mono" style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: '#fff',
            }}>
              {currentPace} days
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: isOnTrack ? 'var(--color-success-light)' : 'var(--color-warning-light)',
          borderRadius: '20px',
        }}>
          {isOnTrack ? (
            <ActiveIcon size={14} color="var(--color-success)" />
          ) : (
            <WarningIcon size={14} color="var(--color-warning)" />
          )}
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: '#fff',
          }}>
            {isOnTrack ? 'On Track' : 'Behind'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default CustomerJourney;
