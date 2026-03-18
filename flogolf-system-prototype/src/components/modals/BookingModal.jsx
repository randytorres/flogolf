import React, { useState, useMemo, useEffect } from 'react';
import { Modal, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  SearchIcon, 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DollarIcon,
  SimBayIcon,
  PhoneIcon,
  PlusIcon,
  CloseIcon,
  WarningIcon,
  LocationIcon,
  StarIcon,
  MailIcon,
  FlagIcon,
} from '../icons';

const BOOKING_OPTIONS = [
  { value: 'standard', label: 'Standard', description: 'General booking for all ages' },
  { value: 'adults', label: 'Adults', description: 'Ages 18+' },
  { value: 'children', label: 'Children', description: 'Under 18 with adult supervision' },
];

const GAME_TYPES = [
  { value: 'course_play', label: 'Course Play', description: 'Full 18-hole round on Golfzon courses' },
  { value: 'driving_range', label: 'Driving Range', description: 'Practice swings and distance work' },
  { value: 'arcade', label: 'Arcade Games', description: 'Fun challenges and mini games' },
];

const BOOKING_TYPES = [
  { value: 'standard', label: 'Standard Rate', multiplier: 1.0 },
  { value: 'member_gold', label: 'Gold Member', multiplier: 0.85 },
  { value: 'member_silver', label: 'Silver Member', multiplier: 0.90 },
  { value: 'member_bronze', label: 'Bronze Member', multiplier: 0.95 },
  { value: 'corporate', label: 'Corporate', multiplier: 1.0 },
  { value: 'event', label: 'Private Event', multiplier: 0.95 },
  { value: 'lesson', label: 'Lesson Block', multiplier: 0.0 },
];

const getDurationForPlayers = (playerCount) => {
  // ~45 min per player for 18 holes + 5 min reset
  const baseMinutes = playerCount * 45 + 5;
  // Round up to nearest 30 min slot
  const slots = Math.ceil(baseMinutes / 30);
  return Math.max(1, Math.min(slots, 8)); // cap at 4 hours
};

const getDurationPricing = (durationSlots) => {
  const map = {
    1: { label: '30 min', multiplier: 0.35 },
    2: { label: '1 Hour', multiplier: 0.65 },
    3: { label: '1.5 Hours', multiplier: 0.85 },
    4: { label: '2 Hours', multiplier: 1.0 },
    5: { label: '2.5 Hours', multiplier: 1.2 },
    6: { label: '3 Hours', multiplier: 1.4 },
    7: { label: '3.5 Hours', multiplier: 1.55 },
    8: { label: '4 Hours', multiplier: 1.7 },
  };
  return map[durationSlots] || { label: `${durationSlots * 30} min`, multiplier: durationSlots * 0.35 };
};

const getTierPricing = (hour, isWeekend = false) => {
  if (isWeekend) return { base: 75, label: 'Weekend Peak', color: '#d4af37' };
  if (hour >= 8 && hour < 12) return { base: 45, label: 'Early Bird', color: '#22c55e' };
  if (hour >= 12 && hour < 17) return { base: 55, label: 'Off-Peak', color: '#3b82f6' };
  return { base: 75, label: 'Peak', color: '#d4af37' };
};

const generateTimeSlots = (startHour = 7, endHour = 23) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push({ time: `${h.toString().padStart(2, '0')}:00`, hour: h });
    slots.push({ time: `${h.toString().padStart(2, '0')}:30`, hour: h });
  }
  return slots;
};

const formatTime12 = (time24) => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
};

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  availableSlots = [],
  customers = [],
  preselectedSlot = null,
}) => {
  // Step tracking
  const [step, setStep] = useState(1);
  
  // Customer
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  
  // Booking details
  const [bookingOption, setBookingOption] = useState('standard');
  const [gameType, setGameType] = useState('course_play');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBay, setSelectedBay] = useState(preselectedSlot?.bayId || '');
  const [selectedTime, setSelectedTime] = useState(preselectedSlot?.time || '');
  const [playerCount, setPlayerCount] = useState(1);
  const [durationSlots, setDurationSlots] = useState(4);
  const [bookingType, setBookingType] = useState('standard');
  const [notes, setNotes] = useState('');

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  // Auto-set duration based on player count
  useEffect(() => {
    if (gameType === 'course_play') {
      setDurationSlots(getDurationForPlayers(playerCount));
    }
  }, [playerCount, gameType]);

  // Auto-detect member rate when customer selected
  useEffect(() => {
    if (customer) {
      if (customer.memberType === 'Annual' || customer.status?.includes('Gold')) {
        setBookingType('member_gold');
      } else if (customer.memberType === 'Quarterly' || customer.status?.includes('Silver')) {
        setBookingType('member_silver');
      } else if (customer.memberType === 'Monthly' || customer.status?.includes('Bronze')) {
        setBookingType('member_bronze');
      }
    }
  }, [selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const customer = customers.find(c => c.id === selectedCustomer);

  const pricing = useMemo(() => {
    if (!selectedTime) return null;
    const [h] = selectedTime.split(':').map(Number);
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const tier = getTierPricing(h, isWeekend);
    const duration = getDurationPricing(durationSlots);
    const type = BOOKING_TYPES.find(t => t.value === bookingType) || BOOKING_TYPES[0];
    
    const basePrice = tier.base * duration.multiplier;
    const memberPrice = basePrice * type.multiplier;
    const total = Math.round(memberPrice);
    
    return { tier, duration, type, basePrice: Math.round(basePrice), total };
  }, [selectedTime, selectedDate, durationSlots, bookingType]);

  const displayName = isNewCustomer ? newCustomerName : (customer?.name || '');
  const displayPhone = isNewCustomer ? newCustomerPhone : (customer?.phone || '');
  const isValid = displayName && displayPhone && selectedBay && selectedTime && selectedDate && playerCount > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    
    const endTime = (() => {
      const [h, m] = selectedTime.split(':').map(Number);
      const endMinutes = h * 60 + m + durationSlots * 30;
      return `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    })();

    onSave?.({
      customerId: selectedCustomer || `walkin-${Date.now()}`,
      customerName: displayName,
      customerPhone: displayPhone,
      customerEmail: customer?.email || '',
      isNewCustomer,
      bayId: selectedBay,
      date: selectedDate,
      time: selectedTime,
      endTime,
      playerCount,
      durationSlots,
      bookingOption,
      gameType,
      bookingType,
      bookingTypeLabel: BOOKING_TYPES.find(t => t.value === bookingType)?.label,
      notes,
      price: pricing?.total,
      pricingTier: pricing?.tier.label,
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setSearchQuery('');
    setSelectedCustomer('');
    setIsNewCustomer(false);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setBookingOption('standard');
    setGameType('course_play');
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedBay('');
    setSelectedTime('');
    setPlayerCount(1);
    setDurationSlots(4);
    setBookingType('standard');
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { resetForm(); onClose(); }} title="Book a Bay" size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Step 1: Customer */}
        {step >= 1 && (
          <Section title="Customer" step="1" active={step === 1} onClick={() => setStep(1)}>
            {!isNewCustomer ? (
              <>
                <SearchInput
                  value={searchQuery}
                  onChange={(v) => { setSearchQuery(v); setShowCustomerDropdown(true); }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  placeholder="Search by name, phone, or email..."
                />
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <Dropdown items={filteredCustomers} selected={selectedCustomer} onSelect={(id, name) => {
                    setSelectedCustomer(id);
                    setSearchQuery(name);
                    setShowCustomerDropdown(false);
                    setStep(2);
                  }} />
                )}
                {customer && <CustomerCard customer={customer} />}
                <button
                  onClick={() => { setIsNewCustomer(true); setSelectedCustomer(''); setSearchQuery(''); }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'transparent',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    width: '100%',
                    justifyContent: 'center',
                  }}
                >
                  <PlusIcon size={14} /> New Customer / Walk-in
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="John Smith"
                      style={inputStyle}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input
                      type="tel"
                      value={newCustomerPhone}
                      onChange={(e) => setNewCustomerPhone(e.target.value)}
                      placeholder="(617) 555-0123"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button
                  onClick={() => { setIsNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone(''); }}
                  style={{
                    padding: '0.375rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-text-muted)',
                    textAlign: 'left',
                  }}
                >
                  ← Back to search
                </button>
              </div>
            )}
          </Section>
        )}

        {/* Step 2: Booking Details */}
        {step >= 2 && (
          <Section title="Booking Details" step="2" active={step === 2} onClick={() => setStep(2)}>
            {/* Booking Option + Game Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Booking Option</label>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {BOOKING_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setBookingOption(opt.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.375rem',
                        backgroundColor: bookingOption === opt.value ? 'var(--color-flomarine)' : '#141414',
                        color: bookingOption === opt.value ? 'white' : '#fff',
                        border: `1.5px solid ${bookingOption === opt.value ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-ui)',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Game Type</label>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {GAME_TYPES.map(gt => (
                    <button
                      key={gt.value}
                      onClick={() => setGameType(gt.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.375rem',
                        backgroundColor: gameType === gt.value ? 'var(--color-flomarine)' : '#141414',
                        color: gameType === gt.value ? 'white' : '#fff',
                        border: `1.5px solid ${gameType === gt.value ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-ui)',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {gt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date, Bay, Player Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}><CalendarIcon size={12} /> Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><LocationIcon size={12} /> Bay</label>
                <select value={selectedBay} onChange={(e) => setSelectedBay(e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {[1,2,3,4,5,6].map(b => <option key={b} value={b}>Bay {b} — Golfzon</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}><UsersIcon size={12} /> Players</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3,4,5,6].map(n => (
                    <button
                      key={n}
                      onClick={() => setPlayerCount(n)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.25rem',
                        backgroundColor: playerCount === n ? 'var(--color-flomarine)' : '#141414',
                        color: playerCount === n ? 'white' : '#fff',
                        border: `1px solid ${playerCount === n ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        fontFamily: 'var(--font-ui)',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration auto-suggestion */}
            {gameType === 'course_play' && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                backgroundColor: 'rgba(59,130,246,0.08)',
                borderRadius: '6px',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-info)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <ClockIcon size={12} />
                {playerCount} player{playerCount > 1 ? 's' : ''} × 45 min + 5 min reset = ~{getDurationPricing(getDurationForPlayers(playerCount)).label} recommended
              </div>
            )}
          </Section>
        )}

        {/* Step 3: Time & Duration */}
        {step >= 2 && (
          <Section title="Time & Duration" step="3" active={step === 3} onClick={() => setStep(3)}>
            {/* Time Slot Grid */}
            <label style={labelStyle}><ClockIcon size={12} /> Tee Time</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.375rem',
              maxHeight: '160px',
              overflowY: 'auto',
              padding: '0.25rem',
              marginBottom: '1rem',
            }}>
              {timeSlots.map(slot => {
                const date = new Date(selectedDate);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const tier = getTierPricing(slot.hour, isWeekend);
                const isActive = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => { setSelectedTime(slot.time); setStep(4); }}
                    style={{
                      padding: '0.5rem 0.25rem',
                      backgroundColor: isActive ? 'var(--color-flomarine)' : '#141414',
                      color: isActive ? 'white' : '#fff',
                      border: `1.5px solid ${isActive ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{formatTime12(slot.time)}</div>
                    <div style={{ fontSize: '9px', color: isActive ? 'rgba(255,255,255,0.7)' : tier.color, fontWeight: 500, marginTop: '0.125rem' }}>
                      ${tier.base}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Duration Selector */}
            <label style={labelStyle}><ClockIcon size={12} /> Duration</label>
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
              <button onClick={() => setDurationSlots(Math.max(1, durationSlots - 1))} style={stepperBtnStyle}>
                <CloseIcon size={14} />
              </button>
              {[1,2,3,4,5,6].map(d => {
                const isActive = durationSlots === d;
                const dp = getDurationPricing(d);
                return (
                  <button
                    key={d}
                    onClick={() => setDurationSlots(d)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.25rem',
                      backgroundColor: isActive ? 'var(--color-flomarine)' : '#141414',
                      color: isActive ? 'white' : '#fff',
                      border: `1px solid ${isActive ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>{dp.label}</div>
                  </button>
                );
              })}
              <button onClick={() => setDurationSlots(Math.min(8, durationSlots + 1))} style={stepperBtnStyle}>
                <PlusIcon size={14} />
              </button>
            </div>
          </Section>
        )}

        {/* Step 4: Rate & Summary */}
        {step >= 2 && (
          <Section title="Rate & Summary" step="4" active={step === 4} onClick={() => setStep(4)}>
            {/* Booking Type */}
            <label style={labelStyle}><StarIcon size={12} /> Rate</label>
            <select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              style={{ ...inputStyle, marginBottom: '1rem' }}
            >
              {BOOKING_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}{t.multiplier < 1 ? ` (${Math.round((1 - t.multiplier) * 100)}% off)` : ''}
                </option>
              ))}
            </select>

            {/* Notes */}
            <label style={labelStyle}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Course preference, special requests, celebration..."
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            {/* Golfzon App Reminder */}
            {customer && !customer.golfzonApp && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginTop: '0.75rem',
              }}>
                <SimBayIcon size={18} color="#3b82f6" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#3b82f6' }}>
                    Golfzon App Not Downloaded
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Recommend Golfzon Global app before session.
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary */}
            {isValid && pricing && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--color-brass-muted)',
                borderRadius: '8px',
                border: '1px solid rgba(212,175,55,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff' }}>
                      Booking Summary
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      {displayName} • Bay {selectedBay} • {formatTime12(selectedTime)}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                      {pricing.duration.label} • {playerCount} player{playerCount > 1 ? 's' : ''} • {pricing.tier.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.125rem' }}>
                      {BOOKING_OPTIONS.find(o => o.value === bookingOption)?.label} • {GAME_TYPES.find(g => g.value === gameType)?.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-brass)', fontFamily: 'var(--font-mono)' }}>
                      ${pricing.total}
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  borderRadius: '6px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  gap: '1rem',
                }}>
                  <FlagIcon size={10} /> Arrive 15 min early
                  <SimBayIcon size={10} /> Bring Golfzon app
                  <ClockIcon size={10} /> 5 min bay reset after
                </div>
              </div>
            )}
          </Section>
        )}
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
        <Button 
          variant="gold" 
          onClick={handleSubmit}
          disabled={!isValid}
          icon={CheckIcon}
        >
          Create Booking{pricing ? ` — $${pricing.total}` : ''}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

/* Sub-components */

const Section = ({ title, step, active, onClick, children }) => (
  <div style={{
    border: `1px solid ${active ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: '12px',
  }}>
    <div
      onClick={onClick}
      style={{
        padding: '0.75rem 1rem',
        backgroundColor: active ? 'var(--color-brass-muted)' : 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: active ? 'var(--color-flomarine)' : 'rgba(255,255,255,0.06)',
        color: active ? 'white' : 'var(--color-text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 700,
      }}>
        {step}
      </div>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? '#fff' : 'var(--color-text-muted)' }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '1rem' }}>
      {children}
    </div>
  </div>
);

const SearchInput = ({ value, onChange, onFocus, onBlur, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onFocus={onFocus}
    onBlur={onBlur}
    placeholder={placeholder}
    style={{
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#141414',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-ui)',
      color: 'var(--color-text-primary)',
      outline: 'none',
    }}
  />
);

const Dropdown = ({ items, selected, onSelect }) => (
  <div style={{
    position: 'relative',
    marginTop: '0.25rem',
  }}>
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      boxShadow: 'var(--shadow-lg)',
      maxHeight: '180px',
      overflow: 'auto',
    }}>
      {items.map(c => (
        <button
          key={c.id}
          onMouseDown={() => onSelect(c.id, c.name)}
          style={{
            width: '100%',
            padding: '0.625rem 1rem',
            backgroundColor: selected === c.id ? 'rgba(255,255,255,0.06)' : 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-sm)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selected === c.id ? 'rgba(255,255,255,0.06)' : 'transparent'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{c.name}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{c.phone}</span>
          </div>
          {c.status && (
            <Badge variant={c.status.includes('Gold') ? 'warning' : c.status.includes('Silver') ? 'default' : 'info'} size="sm">
              {c.status}
            </Badge>
          )}
        </button>
      ))}
    </div>
  </div>
);

const CustomerCard = ({ customer }) => (
  <div style={{
    marginTop: '0.5rem',
    padding: '0.625rem 0.75rem',
    backgroundColor: 'var(--color-brass-muted)',
    borderRadius: '8px',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-secondary)',
  }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><PhoneIcon size={11} /> {customer.phone}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MailIcon size={11} /> {customer.email}</span>
    {customer.handicap && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><StarIcon size={11} /> HCP {customer.handicap}</span>}
    {customer.preferredBay && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><LocationIcon size={11} /> Bay {customer.preferredBay}</span>}
    {customer.golfzonApp && <Badge variant="success" size="sm">Golfzon App</Badge>}
  </div>
);

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: '#fff',
  marginBottom: '0.375rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  backgroundColor: '#141414',
  border: '1.5px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-ui)',
  color: '#fff',
  outline: 'none',
};

const stepperBtnStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: '1.5px solid rgba(255,255,255,0.1)',
  backgroundColor: '#141414',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: '#fff',
};

export default BookingModal;
