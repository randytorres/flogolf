import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui';
import { CustomerJourney } from '../components/customer';
import { 
  User, 
  Calendar, 
  Clock, 
  DollarSign, 
  Star,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Target,
  Trophy,
  BookOpen,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  History,
} from 'lucide-react';

const ACTIVITY_ICONS = {
  booking: Clock,
  lesson: Target,
  league: Trophy,
  event: Calendar,
  membership: Star,
  payment: DollarSign,
};

const ACTIVITY_COLORS = {
  booking: '#1a4725',
  lesson: '#22c55e',
  league: '#d4af37',
  event: '#3b82f6',
  membership: '#d4af37',
  payment: '#22c55e',
};

export default function Customer360({ data, selectedCustomerId }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const customers = data.customers || [];
  
  const customer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId) || customers[0]
    : customers[0];

  if (!customer) return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      color: 'var(--color-text-muted)',
    }}>
      No customer data available.
    </div>
  );

  const daysSinceLastVisit = customer.lastVisit 
    ? Math.floor((Date.now() - new Date(customer.lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @media (max-width: 768px) {
          .c360-header { flex-direction: column !important; gap: 1rem !important; }
          .c360-header > div:last-child { width: 100% !important; }
          .c360-header > div:last-child button { flex: 1 !important; }
          .c360-main-grid { grid-template-columns: 1fr !important; }
          .c360-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .c360-value-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .c360-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Page Header */}
      <div className="c360-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Customer 360</h1>
          <p className="section-subtitle">
            Complete view of customer activity across all systems
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" size="sm" icon={Mail}>
            Email
          </Button>
          <Button variant="ghost" size="sm" icon={Phone}>
            Call
          </Button>
          <Button variant="primary" size="sm" icon={Edit3}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Customer Selector (if multiple customers) */}
      {customers.length > 1 && (
        <CustomerSelector 
          customers={customers}
          selectedId={customer.id}
          onSelect={(c) => {/* Would navigate to that customer */}}
        />
      )}

      {/* Main Content Grid */}
      <div className="c360-main-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>
        {/* Left Column - Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Profile Card */}
          <Card variant="elevated" padding="xl" style={{ textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'var(--gradient-marine)',
              color: 'var(--color-brass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '2.25rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              boxShadow: '0 8px 24px rgba(19, 59, 14, 0.2)',
              position: 'relative',
            }}>
              {customer.name.charAt(0)}
              {daysSinceLastVisit === 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  border: '3px solid white',
                }} />
              )}
            </div>

            {/* Name */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-2xl)',
              color: '#fff',
              margin: '0 0 0.5rem 0',
            }}>
              {customer.name}
            </h2>

            {/* Status Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <Badge variant="gold">
                <Star size={12} />
                {customer.status}
              </Badge>
              {customer.tags?.slice(0, 2).map(tag => (
                <Badge key={tag} variant="default" size="sm">{tag}</Badge>
              ))}
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.25rem',
            }}>
              <StatRow 
                label="Lifetime Spend" 
                value={`$${customer.lifetimeSpend.toLocaleString()}`} 
                icon={DollarSign} 
                highlight
              />
              <StatRow 
                label="Member Since" 
                value={customer.memberSince ? new Date(customer.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'} 
                icon={Calendar} 
              />
              <StatRow 
                label="Handicap" 
                value={customer.handicap || 'N/A'} 
                icon={Award} 
              />
              <StatRow 
                label="Last Visit" 
                value={daysSinceLastVisit === 0 ? 'Today' : `${daysSinceLastVisit} days ago`} 
                icon={Clock}
                highlight={daysSinceLastVisit > 14}
              />
              <StatRow 
                label="Visits This Month" 
                value={customer.visitsThisMonth} 
                icon={TrendingUp} 
              />
            </div>
          </Card>

          {/* Contact Card */}
          <Card variant="default" padding="lg">
            <CardHeader style={{ marginBottom: '1rem' }}>
              <CardTitle style={{ fontSize: 'var(--text-sm)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} />
                CONTACT
              </CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#141414',
                borderRadius: '8px',
              }}>
                <Mail size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  {customer.email}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#141414',
                borderRadius: '8px',
              }}>
                <Phone size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  {customer.phone}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#141414',
                borderRadius: '8px',
              }}>
                <MapPin size={16} color="var(--color-text-muted)" />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  Saugus
                </span>
              </div>
            </div>
          </Card>

          {/* Automation State */}
          <Card variant="default" padding="lg" style={{ 
            borderLeft: '4px solid var(--color-brass)',
          }}>
            <CardHeader style={{ marginBottom: '0.75rem' }}>
              <CardTitle style={{ 
                fontSize: 'var(--text-sm)', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <Target size={14} color="var(--color-brass)" />
                AUTOMATION STATE
              </CardTitle>
            </CardHeader>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: customer.automationStatus?.includes('Active') ? '#fff' : 
                     customer.automationStatus?.includes('Win-back') ? '#fff' : '#fff',
              lineHeight: 1.5,
              padding: '0.75rem',
              backgroundColor: customer.automationStatus?.includes('Active') ? 'var(--color-success-light)' : 
                               customer.automationStatus?.includes('Win-back') ? 'var(--color-danger-light)' : 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
            }}>
              {customer.automationStatus}
            </div>
          </Card>
        </div>

        {/* Right Column - Tabs and Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
                backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: '10px',
            padding: '0.25rem',
          }}>
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'activity', label: 'Activity', icon: History },
              { id: 'journey', label: 'Journey', icon: Target },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <OverviewTab customer={customer} />
          )}
          {selectedTab === 'activity' && (
            <ActivityTab customer={customer} />
          )}
          {selectedTab === 'journey' && (
            <JourneyTab customer={customer} />
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerSelector({ customers, selectedId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = customers.find(c => c.id === selectedId);

  return (
    <div style={{ position: 'relative', maxWidth: '300px' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#141414',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: 'var(--text-sm)',
        }}
      >
        <span style={{ fontWeight: 600, color: '#fff' }}>
          {selected?.name || 'Select customer'}
        </span>
        <ChevronDown size={16} color="var(--color-text-muted)" style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }} />
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '300px',
          overflow: 'auto',
          zIndex: 10,
          marginTop: '4px',
        }}>
          {customers.map(c => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: c.id === selectedId ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 'var(--text-sm)',
              }}
            >
              <span style={{ fontWeight: c.id === selectedId ? 600 : 400 }}>
                {c.name}
              </span>
              <Badge variant="default" size="sm">{c.status}</Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OverviewTab({ customer }) {
  return (
    <>
      {/* Stats Grid */}
      <div className="c360-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <MiniStat icon={Calendar} value={customer.visitsThisMonth} label="Visits this month" />
        <MiniStat icon={DollarSign} value={`${(customer.avgSpendPerVisit || 0).toLocaleString()}`} label="Avg spend/visit" />
        <MiniStat icon={Award} value={customer.handicap || 'N/A'} label="Handicap" />
      </div>

      {/* Upcoming */}
      <Card variant="default" padding="lg">
        <CardHeader style={{ marginBottom: '1rem' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            UPCOMING
          </CardTitle>
        </CardHeader>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: '#141414',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-flomarine)',
            color: 'var(--color-brass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Calendar size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 600,
              fontSize: 'var(--text-base)',
              color: '#fff',
              marginBottom: '0.25rem',
            }}>
              {customer.nextBooking}
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              {customer.preferredBay ? `Preferred Bay ${customer.preferredBay}` : 'No bay preference'}
            </div>
          </div>
          <Badge variant="success">Confirmed</Badge>
        </div>
      </Card>

      {/* Recent Activity Summary */}
      <Card variant="default" padding="lg">
        <CardHeader style={{ marginBottom: '1rem' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            RECENT ACTIVITY
          </CardTitle>
        </CardHeader>

        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '10px',
            bottom: '10px',
            width: '2px',
                backgroundColor: 'rgba(255,255,255,0.06)',
          }} />

          {/* Activity items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {customer.recentActivity?.slice(0, 5).map((activity, idx) => {
              const Icon = ACTIVITY_ICONS[activity.type] || Clock;
              const color = ACTIVITY_COLORS[activity.type] || 'var(--color-text-muted)';
              const isLast = idx === Math.min(4, customer.recentActivity.length - 1);
              
              return (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0,
                    animation: `fadeInLeft 0.4s ease-out ${idx * 80}ms forwards`,
                  }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: `${color}15`,
                    border: `2px solid ${color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    flexShrink: 0,
                  }}>
                    <Icon size={16} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: isLast ? 0 : '0.5rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.25rem',
                    }}>
                      <span style={{
                        fontWeight: 500,
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-primary)',
                      }}>
                        {activity.desc}
                      </span>
                      {activity.amount > 0 && (
                        <span className="mono" style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 600,
                          color: '#fff',
                        }}>
                          ${activity.amount}
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <Badge variant="default" size="sm" style={{ textTransform: 'capitalize' }}>
                        {activity.type}
                      </Badge>
                      <span style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                      }}>
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </>
  );
}

function ActivityTab({ customer }) {
  const [showAll, setShowAll] = useState(false);
  const activities = showAll ? customer.recentActivity : customer.recentActivity?.slice(0, 8);

  return (
    <Card variant="default" padding="lg">
      <CardHeader style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            FULL ACTIVITY HISTORY
          </CardTitle>
          {customer.recentActivity?.length > 8 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show All'}
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          )}
        </div>
      </CardHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities?.map((activity, idx) => {
          const Icon = ACTIVITY_ICONS[activity.type] || Clock;
          const color = ACTIVITY_COLORS[activity.type] || 'var(--color-text-muted)';
          
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                backgroundColor: idx === 0 ? 'rgba(212, 175, 55, 0.06)' : 'transparent',
                borderRadius: '8px',
                border: idx === 0 ? '1px solid rgba(212, 175, 55, 0.15)' : '1px solid transparent',
                opacity: 0,
                animation: `fadeInLeft 0.4s ease-out ${idx * 60}ms forwards`,
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: `${color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color,
              }}>
                <Icon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                }}>
                  {activity.desc}
                </div>
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.125rem',
                }}>
                  {activity.date}
                </div>
              </div>
              {activity.amount > 0 && (
                <div className="mono" style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  +${activity.amount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function JourneyTab({ customer }) {
  const currentStage = customer.status.includes('Gold') ? 'member' : 
                       customer.status.includes('Silver') ? 'member' :
                       customer.status.includes('Bronze') ? 'member' : 'booking';
  
  const stagesCompleted = ['inquiry', 'booking'];
  if (customer.memberSince) stagesCompleted.push('lesson', 'member');

  return (
    <>
      <CustomerJourney
        currentStage={currentStage}
        stagesCompleted={stagesCompleted}
        startDate={customer.memberSince || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()}
      />

      {/* Customer Value Summary */}
      <Card variant="default" padding="lg">
        <CardHeader style={{ marginBottom: '1rem' }}>
          <CardTitle style={{ fontSize: 'var(--text-base)', margin: 0 }}>
            CUSTOMER VALUE
          </CardTitle>
        </CardHeader>
        
        <div className="c360-value-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <ValueBox
            label="Lifetime Value"
            value={`$${customer.lifetimeSpend.toLocaleString()}`}
            trend="+12% YoY"
          />
          <ValueBox
            label="Avg Order Value"
            value={`${(customer.avgSpendPerVisit || 0).toLocaleString()}`}
            trend="+5%"
          />
          <ValueBox
            label="Visit Frequency"
            value={`${customer.visitsThisMonth}/mo`}
            trend="Active"
            isPositive
          />
        </div>
      </Card>

      {/* Notes */}
      {customer.notes && (
        <Card variant="default" padding="lg" style={{ borderLeft: '3px solid var(--color-brass)' }}>
          <CardHeader style={{ marginBottom: '0.5rem' }}>
            <CardTitle style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
              NOTES
            </CardTitle>
          </CardHeader>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            margin: 0,
            lineHeight: 1.6,
          }}>
            "{customer.notes}"
          </p>
        </Card>
      )}
    </>
  );
}

function StatRow({ label, value, icon: Icon, highlight = false }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        <Icon size={14} />
        {label}
      </div>
      <div style={{
        fontWeight: 600,
        fontSize: 'var(--text-sm)',
        color: highlight ? 'var(--color-warning)' : '#fff',
      }}>
        {value}
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <Card variant="default" padding="md" style={{ textAlign: 'center' }}>
      <Icon size={20} color="#d4af37" style={{ marginBottom: '0.5rem' }} />
      <div className="mono" style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 600,
        color: '#fff',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        marginTop: '0.25rem',
      }}>
        {label}
      </div>
    </Card>
  );
}

function ValueBox({ label, value, trend, isPositive = false }) {
  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#141414',
      borderRadius: '10px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        marginBottom: '0.25rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </div>
      <div className="mono" style={{
        fontSize: 'var(--text-2xl)',
        fontWeight: 600,
        color: '#fff',
      }}>
        {value}
      </div>
      {trend && (
        <div style={{
          fontSize: 'var(--text-xs)',
          color: isPositive ? '#fff' : 'var(--color-text-muted)',
          fontWeight: 500,
          marginTop: '0.25rem',
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}
