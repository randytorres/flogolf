import { useState } from 'react';
import { 
  DashboardIcon,
  CustomersIcon,
  EventsIcon,
  AutomationIcon,
  CocktailIcon,
  TrophyIcon,
  SimBayIcon,
  SearchIcon,
  BellIcon,
  SettingsIcon,
  LocationIcon,
  MenuIcon,
  CloseIcon,
} from './components/icons';
import { MOCK_DATA, BUSINESS_INFO } from './data';
import Dashboard from './views/Dashboard';
import Customer360 from './views/Customer360';
import EventPipeline from './views/EventPipeline';
import AutomationCenter from './views/AutomationCenter';
import FNBView from './views/FNBView';
import LeagueView from './views/LeagueView';
import BayView from './views/BayView';

const VIEWS = {
  DASHBOARD: 'dashboard',
  CUSTOMER_360: 'customer_360',
  EVENT_PIPELINE: 'event_pipeline',
  AUTOMATION: 'automation',
  FN_B: 'fnb',
  LEAGUES: 'leagues',
  BAYS: 'bays',
};

function App() {
  const [activeView, setActiveView] = useState(VIEWS.DASHBOARD);
  const [activeLocation, setActiveLocation] = useState('Saugus');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [preselectedBay, setPreselectedBay] = useState(null);

  const navItems = [
    { id: VIEWS.DASHBOARD, label: 'Dashboard', icon: DashboardIcon },
    { id: VIEWS.BAYS, label: 'Bays', icon: SimBayIcon },
    { id: VIEWS.CUSTOMER_360, label: 'Customers', icon: CustomersIcon },
    { id: VIEWS.EVENT_PIPELINE, label: 'Events', icon: EventsIcon },
    { id: VIEWS.LEAGUES, label: 'Leagues', icon: TrophyIcon },
    { id: VIEWS.FN_B, label: 'Food & Drink', icon: CocktailIcon },
    { id: VIEWS.AUTOMATION, label: 'Automations', icon: AutomationIcon },
  ];

  const handleNavigate = (view, payloadId = null, extra = null) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (view === VIEWS.FN_B && extra?.bayId) {
        setPreselectedBay(extra.bayId);
      } else if (view !== VIEWS.FN_B) {
        setPreselectedBay(null);
      }
      setSelectedCustomerId(payloadId);
      setActiveView(view);
      setIsTransitioning(false);
      setIsMobileMenuOpen(false);
    }, 200);
  };

  const currentData = MOCK_DATA[activeLocation] || MOCK_DATA['Saugus'];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Logo Area */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src="/flogolf-logo.png" 
                alt="Flogolf Lounge" 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  objectFit: 'contain',
                  borderRadius: '8px',
                }} 
              />
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}>
                  FLOGOLF
                </div>
                <div style={{
                  fontSize: '0.625rem',
                  color: 'var(--color-gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 500,
                  marginTop: '2px',
                }}>
                  Operations Console
                </div>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={closeMobileMenu}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
              className="mobile-close-btn"
            >
              <CloseIcon size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '1rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.25rem' 
        }}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { handleNavigate(item.id); closeMobileMenu(); }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{
                  animation: `fadeInLeft 0.4s ease-out ${index * 50}ms forwards`,
                  opacity: 0,
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Location Selector */}
        <div style={{ padding: '0 1rem 1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <LocationIcon size={16} color="var(--color-gold)" />
            <span style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}>
              {activeLocation}
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-surface-dark)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
            }}>
              FL
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}>
                Admin
              </div>
              <div style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-muted)',
              }}>
                Manager
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </button>

            {/* Global Search */}
            <div 
              className="top-header-search"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                backgroundColor: 'var(--color-surface-elevated)', 
                padding: '0.5rem 1rem', 
                borderRadius: '8px',
                width: '320px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <SearchIcon size={16} color="var(--color-text-muted)" />
              <input 
                type="text" 
                placeholder="Search customers, bookings, events..." 
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  outline: 'none', 
                  width: '100%',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-primary)',
                }} 
              />
            </div>
          </div>

          <div className="header-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Location Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '6px',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-gold)',
            }}>
              <LocationIcon size={14} />
              {activeLocation}
            </div>

            {/* Notifications */}
            <button style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}>
              <BellIcon size={18} />
              {notifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {notifications}
                </span>
              )}
            </button>

            {/* Settings */}
            <button style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}>
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        {/* View Area - With Fade Transition */}
        <section 
          className="view-area" 
          style={{ 
            opacity: isTransitioning ? 0 : 1, 
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {activeView === VIEWS.DASHBOARD && <Dashboard data={currentData} onNavigate={handleNavigate} />}
          {activeView === VIEWS.BAYS && <BayView data={currentData} />}
          {activeView === VIEWS.CUSTOMER_360 && <Customer360 data={currentData} selectedCustomerId={selectedCustomerId} />}
          {activeView === VIEWS.EVENT_PIPELINE && <EventPipeline data={currentData} />}
          {activeView === VIEWS.LEAGUES && <LeagueView data={currentData} />}
          {activeView === VIEWS.FN_B && <FNBView data={currentData} preselectedBay={preselectedBay} />}
          {activeView === VIEWS.AUTOMATION && <AutomationCenter data={currentData} />}
        </section>
      </main>
    </div>
  );
}

export default App;
