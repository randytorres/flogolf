import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '../components/ui';
import { 
  CocktailIcon,
  ClockIcon,
  UsersIcon,
  CheckIcon,
  PlusIcon,
  CloseIcon,
  SearchIcon,
  DollarIcon,
  LocationIcon,
  TrendUpIcon,
  PlayIcon,
  SimBayIcon,
  PhoneIcon,
  EditIcon,
  StarIcon,
  WarningIcon,
  FlagIcon,
} from '../components/icons';
import { FN_B_MENU, FN_B_ACTIVE_ORDERS, FN_B_COMPLETED_ORDERS, MOCK_DATA } from '../data';

const STATUS_CONFIG = {
  preparing: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Preparing', pulse: true },
  ready: { color: '#fff', bg: 'rgba(34,197,94,0.12)', label: 'Ready', pulse: false },
  voided: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Voided', pulse: false },
};

const QUICK_ITEMS = ['fnb9', 'fnb1', 'fnb27', 'fnb7', 'fnb30'];

function getPricingTier() {
  const h = new Date().getHours();
  const d = new Date().getDay();
  const isWeekend = d === 0 || d === 6;
  if (isWeekend) return { label: 'Weekend Peak', color: '#d4af37' };
  if (h >= 8 && h < 12) return { label: 'Early Bird', color: '#fff' };
  if (h >= 12 && h < 17) return { label: 'Off-Peak', color: '#3b82f6' };
  return { label: 'Peak', color: '#d4af37' };
}

export default function FNBView({ data, preselectedBay = null }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [activeOrders, setActiveOrders] = useState(FN_B_ACTIVE_ORDERS);
  const [completedOrders, setCompletedOrders] = useState(FN_B_COMPLETED_ORDERS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBay, setSelectedBay] = useState(preselectedBay);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [eightySiced, setEightySiced] = useState(new Set());
  const [cartNotes, setCartNotes] = useState({});
  const [editingNote, setEditingNote] = useState(null);
  const [tabTips, setTabTips] = useState({});
  const pricingTier = getPricingTier();

  const bays = data?.baySchedule?.bays || [];

  // Update selected bay when preselectedBay changes
  useEffect(() => {
    if (preselectedBay) setSelectedBay(preselectedBay);
  }, [preselectedBay]);

  // Filter menu items
  const filteredItems = useMemo(() => {
    let items = FN_B_MENU.items;
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }, [selectedCategory, searchQuery]);

  // Stats
  const fNBTodaysRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0) + activeOrders.reduce((sum, o) => sum + o.total, 0);
  const activeOrderCount = activeOrders.length;
  const avgTicket = completedOrders.length > 0 ? Math.round(completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length) : 0;

  // Add item to cart (with note support)
  const addToCart = (item, note = '') => {
    if (eightySiced.has(item.id)) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id && c.note === note);
      if (existing) {
        return prev.map(c => c.id === item.id && c.note === note ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1, note }];
    });
    setShowCart(true);
  };

  // Toggle 86 status
  const toggleEightySix = (itemId) => {
    setEightySiced(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  // Void order
  const voidOrder = (orderId) => {
    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Settle bay tab
  const settleTab = (bayId) => {
    setCompletedOrders(prev => prev.filter(o => o.bayId !== bayId));
    setActiveOrders(prev => prev.filter(o => o.bayId !== bayId));
    setTabTips(prev => { const n = {...prev}; delete n[bayId]; return n; });
  };

  // Get all orders for a bay
  const getOrdersForBay = (bayId) => {
    const active = activeOrders.filter(o => o.bayId === bayId);
    const completed = completedOrders.filter(o => o.bayId === bayId);
    return [...active, ...completed];
  };

  // Get bay tab total
  const getTabTotal = (bayId) => {
    return getOrdersForBay(bayId).reduce((s, o) => s + o.total, 0);
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);
  const quickItems = QUICK_ITEMS.map(id => FN_B_MENU.items.find(i => i.id === id)).filter(Boolean);

  // Remove from cart (with note support)
  const removeFromCart = (itemId, note = '') => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId && c.note === note);
      if (existing && existing.qty > 1) {
        return prev.map(c => c.id === itemId && c.note === note ? { ...c, qty: c.qty - 1 } : c);
      }
      return prev.filter(c => !(c.id === itemId && c.note === note));
    });
  };

  // Submit order
  const submitOrder = () => {
    if (cart.length === 0 || !selectedBay) return;
    const bay = bays.find(b => b.id === selectedBay);
    const newOrder = {
      id: `ord-${Date.now()}`,
      bayId: selectedBay,
      customerName: bay?.customer?.name || `Bay ${selectedBay}`,
      status: 'preparing',
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price, category: c.category, note: c.note })),
      total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
      orderedAt: new Date().toISOString(),
      estimatedReady: Math.max(...cart.map(c => c.prepTime)),
    };
    setActiveOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setCartNotes({});
    setShowCart(false);
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'delivered') {
      const order = activeOrders.find(o => o.id === orderId);
      if (order) {
        setCompletedOrders(prev => [{
          id: order.id,
          bayId: order.bayId,
          customerName: order.customerName,
          total: order.total,
          itemCount: order.items.reduce((s, i) => s + i.qty, 0),
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          items: order.items,
        }, ...prev]);
      }
      setActiveOrders(prev => prev.filter(o => o.id !== orderId));
    } else {
      setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        @media (max-width: 768px) {
          .fnb-header { flex-direction: column !important; gap: 1rem !important; }
          .fnb-header > div:last-child { width: 100% !important; justify-content: flex-start !important; }
          .fnb-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .fnb-orders-grid { grid-template-columns: 1fr !important; }
          .fnb-menu-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .fnb-kitchen-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .fnb-tabs-grid { grid-template-columns: 1fr !important; }
          .fnb-cart-drawer { left: 0 !important; }
        }
        @media (max-width: 480px) {
          .fnb-stats-grid { grid-template-columns: 1fr !important; }
          .fnb-menu-grid { grid-template-columns: 1fr !important; }
          .fnb-kitchen-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div className="fnb-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Food & Drink</h1>
          <p className="section-subtitle">
            POS &middot; Kitchen &middot; Tabs
            <span style={{ marginLeft: '0.75rem', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              Bartender: Mike R.
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Happy hour badge */}
          <div style={{
            padding: '0.25rem 0.625rem',
            backgroundColor: `${pricingTier.color}15`,
            border: `1px solid ${pricingTier.color}30`,
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 700,
            color: pricingTier.color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: pricingTier.color }} />
            {pricingTier.label}
          </div>
          {/* Cart button */}
          {cartCount > 0 && (
            <Button variant="gold" size="sm" icon={CocktailIcon} onClick={() => setShowCart(!showCart)}>
              Order ({cartCount}) — ${cartTotal}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="fnb-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <StatBlock label="Today's F&B Revenue" value={`$${fNBTodaysRevenue.toLocaleString()}`} icon={DollarIcon} color="#d4af37" />
        <StatBlock label="Active Orders" value={activeOrderCount} icon={ClockIcon} color="#f59e0b" />
        <StatBlock label="Completed Today" value={completedOrders.length} icon={CheckIcon} color="#22c55e" />
        <StatBlock label="Avg Ticket" value={`$${avgTicket.toLocaleString()}`} icon={TrendUpIcon} color="#3b82f6" />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0' }}>
        {[
          { id: 'orders', label: 'Orders', icon: CocktailIcon },
          { id: 'kitchen', label: 'Kitchen Tickets', icon: ClockIcon },
          { id: 'tabs', label: 'Bay Tabs', icon: DollarIcon },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.625rem 1rem',
              backgroundColor: activeTab === tab.id ? 'rgba(212,175,55,0.1)' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #d4af37' : '2px solid transparent',
              color: activeTab === tab.id ? '#d4af37' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              fontFamily: 'var(--font-ui)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '-1px',
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="fnb-orders-grid" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem' }}>
          {/* Left: Active Orders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionHeader label="Active Orders" count={activeOrderCount} active={activeOrderCount > 0} />
            {activeOrders.length === 0 && <EmptyState text="No active orders" />}
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} onVoid={voidOrder} />
            ))}
            <SectionHeader label="Completed Today" count={completedOrders.length} active={false} />
            {completedOrders.slice(0, 8).map(order => (
              <CompletedOrderRow key={order.id} order={order} />
            ))}
          </div>

          {/* Right: Menu */}
          <div>
            {/* Bay Selector */}
            <BaySelector bays={bays} selectedBay={selectedBay} onSelect={setSelectedBay} />

            {/* Quick shortcuts */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginRight: '0.25rem' }}>QUICK:</span>
              {quickItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={eightySiced.has(item.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: eightySiced.has(item.id) ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.08)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: '6px',
                    cursor: eightySiced.has(item.id) ? 'not-allowed' : 'pointer',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: eightySiced.has(item.id) ? 'rgba(255,255,255,0.15)' : '#d4af37',
                    opacity: eightySiced.has(item.id) ? 0.5 : 1,
                  }}
                >
                  {item.name} <span style={{ opacity: 0.6 }}>${item.price.toLocaleString()}</span>
                </button>
              ))}
            </div>

            {/* Search + Categories */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryTabs categories={FN_B_MENU.categories} selected={selectedCategory} onSelect={setSelectedCategory} />

            {/* Menu Grid */}
            <div className="fnb-menu-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAdd={() => addToCart(item)}
                  onToggle86={() => toggleEightySix(item.id)}
                  inCart={cart.filter(c => c.id === item.id).reduce((s, c) => s + c.qty, 0)}
                  is86d={eightySiced.has(item.id)}
                />
              ))}
            </div>
            {filteredItems.length === 0 && <EmptyState text="No items found" />}
          </div>
        </div>
      )}

      {/* Kitchen Tickets Tab */}
      {activeTab === 'kitchen' && (
        <div className="fnb-kitchen-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {activeOrders.length === 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState text="No tickets — all caught up" />
            </div>
          )}
          {activeOrders.map(order => (
            <KitchenTicket key={order.id} order={order} onStatusChange={updateOrderStatus} onVoid={voidOrder} />
          ))}
        </div>
      )}

      {/* Bay Tabs Tab */}
      {activeTab === 'tabs' && (
        <div className="fnb-tabs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {bays.filter(b => b.status === 'active').map(bay => {
            const bayOrders = getOrdersForBay(bay.id);
            const tabTotal = getTabTotal(bay.id);
            const tip = tabTips[bay.id] || 0;
            return (
              <div key={bay.id} style={{
                backgroundColor: '#141414',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#d4af37' }}>Bay {bay.id}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginLeft: '0.5rem' }}>{bay.customer?.name}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#d4af37' }}>${tabTotal}</span>
                </div>
                <div style={{ padding: '0.75rem 1rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {bayOrders.length === 0 && <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '1rem' }}>No orders</div>}
                  {bayOrders.map(order => (
                    <div key={order.id} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>
                        {order.time || new Date(order.orderedAt || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      {order.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '0.125rem' }}>
                          <span>{item.qty}x {item.name}</span>
                          <span className="mono">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      )) || (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
                          <span>{order.itemCount} items</span>
                          <span className="mono">${order.total.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>Tip:</span>
                    {[0, 10, 15, 20].map(pct => {
                      const amt = pct === 0 ? 0 : Math.round(tabTotal * pct / 100);
                      const isActive = tip === amt;
                      return (
                        <button
                          key={pct}
                          onClick={() => setTabTips(prev => ({ ...prev, [bay.id]: amt }))}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: isActive ? '#d4af37' : 'rgba(255,255,255,0.04)',
                            color: isActive ? '#0a0a0a' : 'rgba(255,255,255,0.5)',
                            border: `1px solid ${isActive ? '#d4af37' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            fontWeight: 600,
                          }}
                        >
                          {pct === 0 ? 'None' : `${pct}%${amt > 0 ? ` ($${amt})` : ''}`}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                    <span>Subtotal</span><span className="mono">${tabTotal}</span>
                  </div>
                  {tip > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: '#fff', marginBottom: '0.5rem' }}>
                      <span>Tip</span><span className="mono">+${tip}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                    <span>Total</span><span className="mono" style={{ color: '#d4af37' }}>${tabTotal + tip}</span>
                  </div>
                  <Button variant="gold" size="sm" onClick={() => settleTab(bay.id)} style={{ width: '100%' }} icon={CheckIcon}>
                    Settle Tab — ${tabTotal + tip}
                  </Button>
                </div>
              </div>
            );
          })}
          {bays.filter(b => b.status === 'active').length === 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState text="No active bays with tabs" />
            </div>
          )}
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && cart.length > 0 && (
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          selectedBay={selectedBay}
          cartNotes={cartNotes}
          editingNote={editingNote}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onNoteChange={(itemId, note) => setCartNotes(prev => ({ ...prev, [itemId]: note }))}
          onEditNote={setEditingNote}
          onSubmit={submitOrder}
          onClear={() => { setCart([]); setCartNotes({}); setShowCart(false); }}
        />
      )}
    </div>
  );
}

/* Sub-components */

const StatBlock = ({ label, value, icon: Icon, color }) => (
  <div style={{ padding: '1rem', backgroundColor: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <Icon size={14} color={color} />
      <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
    <div className="mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#fff' }}>{value}</div>
  </div>
);

const SectionHeader = ({ label, count, active }) => (
  <div style={{
    fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? '#fff' : 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem',
    marginTop: '0.25rem',
  }}>
    {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 2s ease-in-out infinite' }} />}
    {label} ({count})
  </div>
);

const EmptyState = ({ text }) => (
  <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 'var(--text-sm)', backgroundColor: '#141414', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
    {text}
  </div>
);

const BaySelector = ({ bays, selectedBay, onSelect }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Order for:</span>
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {bays.filter(b => b.status === 'active').map(bay => (
        <button key={bay.id} onClick={() => onSelect(selectedBay === bay.id ? null : bay.id)} style={{
          padding: '0.375rem 0.75rem',
          backgroundColor: selectedBay === bay.id ? '#d4af37' : 'rgba(255,255,255,0.04)',
          color: selectedBay === bay.id ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
          border: `1px solid ${selectedBay === bay.id ? '#d4af37' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: '6px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-ui)',
          display: 'flex', alignItems: 'center', gap: '0.375rem',
        }}>
          <SimBayIcon size={12} /> Bay {bay.id}
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{bay.customer?.name?.split(' ')[0]}</span>
        </button>
      ))}
    </div>
  </div>
);

const SearchBar = ({ value, onChange }) => (
  <div style={{ marginBottom: '0.75rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
      <SearchIcon size={14} color="rgba(255,255,255,0.3)" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search menu..." style={{
        border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: '#fff',
      }} />
    </div>
  </div>
);

const CategoryTabs = ({ categories, selected, onSelect }) => (
  <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
    <CategoryTab label="All" active={selected === 'all'} onClick={() => onSelect('all')} />
    {categories.map(cat => (
      <CategoryTab key={cat.id} label={cat.name} active={selected === cat.id} onClick={() => onSelect(cat.id)} />
    ))}
  </div>
);

const OrderCard = ({ order, onStatusChange, onVoid }) => {
  const [elapsed, setElapsed] = useState(0);
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.preparing;

  useEffect(() => {
    const orderedAt = new Date(order.orderedAt).getTime();
    setElapsed(Math.floor((Date.now() - orderedAt) / 60000));
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - orderedAt) / 60000)), 30000);
    return () => clearInterval(timer);
  }, [order.orderedAt]);

  return (
    <div style={{ backgroundColor: '#141414', borderRadius: '12px', border: `1px solid ${order.status === 'ready' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`, overflow: 'hidden' }}>
      <div style={{ padding: '0.375rem 0.75rem', backgroundColor: config.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: config.color, animation: config.pulse ? 'pulse 2s ease-in-out infinite' : 'none' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{config.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{elapsed}m ago</span>
          <button onClick={() => onVoid(order.id)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', fontSize: '9px', fontWeight: 600, padding: '0 0.25rem' }}>VOID</button>
        </div>
      </div>
      <div style={{ padding: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#d4af37' }}>Bay {order.bayId}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{order.customerName}</span>
          </div>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#d4af37', fontFamily: 'var(--font-mono)' }}>${order.total.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
          {order.items.map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>
                <span>{item.qty}x {item.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${(item.price * item.qty).toLocaleString()}</span>
              </div>
              {item.note && <div style={{ fontSize: '9px', color: '#d4af37', fontStyle: 'italic', marginLeft: '1rem' }}>{item.note}</div>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {order.status === 'preparing' && (
            <Button variant="ghost" size="sm" onClick={() => onStatusChange(order.id, 'ready')} style={{ flex: 1, color: '#fff', border: '1px solid rgba(34,197,94,0.2)', fontSize: '10px' }} icon={CheckIcon}>Mark Ready</Button>
          )}
          {order.status === 'ready' && (
            <Button variant="gold" size="sm" onClick={() => onStatusChange(order.id, 'delivered')} style={{ flex: 1, fontSize: '10px' }} icon={CheckIcon}>Delivered</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const KitchenTicket = ({ order, onStatusChange, onVoid }) => {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.preparing;
  const time = new Date(order.orderedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  return (
    <div style={{
      backgroundColor: '#1a1a1a', borderRadius: '8px', border: '2px dashed rgba(255,255,255,0.1)', padding: '1rem', fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TICKET {order.id.slice(-4).toUpperCase()}</span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{time}</span>
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: '#fff', marginBottom: '0.5rem' }}>BAY {order.bayId}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>{order.customerName}</div>
      <div style={{ marginBottom: '1rem' }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: '0.375rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: 'var(--text-base)', fontWeight: 700, color: '#fff' }}>
              <span>{item.qty}x</span>
              <span>{item.name.toUpperCase()}</span>
            </div>
            {item.note && <div style={{ fontSize: 'var(--text-xs)', color: '#d4af37', fontStyle: 'italic', marginLeft: '1.5rem' }}>"{item.note}"</div>}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {order.status === 'preparing' && (
          <button onClick={() => onStatusChange(order.id, 'ready')} style={{
            flex: 1, padding: '0.625rem', backgroundColor: '#22c55e', color: '#0a0a0a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 900, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>FIRE</button>
        )}
        {order.status === 'ready' && (
          <button onClick={() => onStatusChange(order.id, 'delivered')} style={{
            flex: 1, padding: '0.625rem', backgroundColor: '#d4af37', color: '#0a0a0a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 900, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>DONE</button>
        )}
        <button onClick={() => onVoid(order.id)} style={{
          padding: '0.625rem 0.75rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)',
        }}>VOID</button>
      </div>
      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: config.color, animation: config.pulse ? 'pulse 2s ease-in-out infinite' : 'none' }} />
          <span style={{ fontSize: '9px', fontWeight: 700, color: config.color, textTransform: 'uppercase' }}>{config.label}</span>
        </div>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#d4af37' }}>${order.total.toLocaleString()}</span>
      </div>
    </div>
  );
};

const CompletedOrderRow = ({ order }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', backgroundColor: '#141414', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: '#d4af37', fontWeight: 600 }}>Bay {order.bayId}</span>
      <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.5)' }}>{order.customerName}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{order.time}</span>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>${order.total.toLocaleString()}</span>
    </div>
  </div>
);

const MenuItemCard = ({ item, onAdd, onToggle86, inCart, is86d }) => (
  <div
    onClick={is86d ? undefined : onAdd}
    style={{
      padding: '0.875rem', backgroundColor: is86d ? 'rgba(255,255,255,0.02)' : inCart > 0 ? 'rgba(212,175,55,0.06)' : '#141414',
      borderRadius: '12px',
      border: `1px solid ${is86d ? 'rgba(239,68,68,0.15)' : inCart > 0 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'}`,
      cursor: is86d ? 'not-allowed' : 'pointer', transition: 'all 0.15s ease', position: 'relative', opacity: is86d ? 0.4 : 1,
    }}
    onMouseEnter={(e) => { if (!is86d) { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = is86d ? 'rgba(239,68,68,0.15)' : inCart > 0 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    {/* 86 button */}
    <button
      onClick={(e) => { e.stopPropagation(); onToggle86(); }}
      title={is86d ? 'Un-86 item' : '86 item (mark unavailable)'}
      style={{
        position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '4px',
        backgroundColor: is86d ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 900, color: is86d ? '#ef4444' : 'rgba(255,255,255,0.3)',
      }}
    >
      86
    </button>
    {/* Cart badge */}
    {inCart > 0 && !is86d && (
      <div style={{ position: 'absolute', top: '-6px', left: '-6px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#d4af37', color: '#0a0a0a', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{inCart}</div>
    )}
    {/* 86'd overlay */}
    {is86d && (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)', fontSize: 'var(--text-lg)', fontWeight: 900, color: '#ef4444', border: '3px solid #ef4444', padding: '0.125rem 0.5rem', borderRadius: '4px', letterSpacing: '0.1em' }}>86'D</div>
    )}
    {item.popular && <div style={{ fontSize: '9px', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Popular</div>}
    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', marginBottom: '0.125rem' }}>{item.name}</div>
    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.description}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#d4af37', fontFamily: 'var(--font-mono)' }}>${item.price.toLocaleString()}</span>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ClockIcon size={9} /> {item.prepTime}m</span>
    </div>
  </div>
);

const CategoryTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: '0.375rem 0.75rem', backgroundColor: active ? '#d4af37' : 'rgba(255,255,255,0.04)',
    color: active ? '#0a0a0a' : 'rgba(255,255,255,0.5)', border: `1px solid ${active ? '#d4af37' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '6px', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-ui)', transition: 'all 0.15s ease',
  }}>{label}</button>
);

const CartDrawer = ({ cart, cartTotal, cartCount, selectedBay, cartNotes, editingNote, onAdd, onRemove, onNoteChange, onEditNote, onSubmit, onClear }) => (
  <div className="fnb-cart-drawer" style={{
    position: 'fixed', bottom: 0, left: '280px', right: 0, backgroundColor: '#1a1a1a',
    borderTop: '1px solid rgba(212,175,55,0.2)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
    zIndex: 100, boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
  }}>
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', overflowX: 'auto' }}>
      {cart.map(item => (
        <div key={item.id + (item.note || '')} style={{
          padding: '0.5rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', flexShrink: 0, minWidth: '160px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: item.note ? '0.25rem' : 0 }}>
            <span style={{ fontSize: 'var(--text-xs)', color: '#fff', fontWeight: 500, flex: 1 }}>{item.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button onClick={() => onRemove(item.id, item.note)} style={cartBtnStyle}><CloseIcon size={10} /></button>
              <span style={{ fontSize: 'var(--text-xs)', color: '#d4af37', fontWeight: 600, fontFamily: 'var(--font-mono)', minWidth: '14px', textAlign: 'center' }}>{item.qty}</span>
              <button onClick={() => onAdd(item, item.note)} style={cartBtnStyle}><PlusIcon size={10} /></button>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>${(item.price * item.qty).toLocaleString()}</span>
          </div>
          {item.note && <div style={{ fontSize: '9px', color: '#d4af37', fontStyle: 'italic' }}>"{item.note}"</div>}
          <button onClick={() => onEditNote(editingNote === item.id ? null : item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '9px', padding: 0, marginTop: '0.125rem' }}>
            <EditIcon size={9} /> {item.note ? 'edit note' : 'add note'}
          </button>
          {editingNote === item.id && (
            <input
              type="text"
              value={cartNotes[item.id] || item.note || ''}
              onChange={(e) => onNoteChange(item.id, e.target.value)}
              onBlur={() => {
                const note = cartNotes[item.id] || '';
                if (note !== item.note) {
                  // Update cart item note by removing old and adding new
                  onRemove(item.id, item.note);
                  setTimeout(() => onAdd({...item, note}), 0);
                }
                onEditNote(null);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
              placeholder="no ice, extra lime..."
              autoFocus
              style={{ width: '100%', padding: '0.25rem 0.375rem', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '4px', fontSize: '9px', color: '#fff', fontFamily: 'var(--font-ui)', outline: 'none', marginTop: '0.25rem' }}
            />
          )}
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>{cartCount} items</span>
        <span className="mono" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: '#d4af37' }}>${cartTotal}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onClear} style={{ padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}><CloseIcon size={16} /></button>
        <Button variant="gold" onClick={onSubmit} disabled={!selectedBay} icon={CheckIcon}>Send to Bay {selectedBay || '?'}</Button>
      </div>
    </div>
  </div>
);

const cartBtnStyle = {
  width: '20px', height: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)',
  backgroundColor: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
};
