import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from "../components/ui";
import {
  SimBayIcon, ClockIcon, UsersIcon, PhoneIcon, DollarIcon,
  PlusIcon, CloseIcon, CheckIcon, EditIcon, SearchIcon,
  CalendarIcon, TrendUpIcon, WarningIcon, CocktailIcon,
} from "../components/icons";

export default function BayView({ data }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedBay, setExpandedBay] = useState(null);
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const bays = data?.baySchedule?.bays || [];
  const occupied = bays.filter(b => b.status === "active").length;
  const available = bays.filter(b => b.status === "available").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 700, color: "#fff", margin: 0 }}>Bay Management</h1>
          <p style={{ fontSize: "var(--text-sm)", color: "rgba(255,255,255,0.5)", margin: "0.25rem 0 0 0" }}>{bays.length} Golfzon TWO simulators</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button variant="secondary" size="sm" icon={CalendarIcon}>Schedule</Button>
          <Button variant="primary" size="sm" icon={PlusIcon}>Walk-in Booking</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ backgroundColor: "#141414", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>TOTAL BAYS</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "#fff" }}>{bays.length}</div>
        </div>
        <div style={{ backgroundColor: "#141414", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>ACTIVE NOW</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "#fff" }}>{occupied}</div>
        </div>
        <div style={{ backgroundColor: "#141414", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>AVAILABLE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "#fff" }}>{available}</div>
        </div>
        <div style={{ backgroundColor: "#141414", borderRadius: "12px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginBottom: "0.25rem" }}>TODAY'S REVENUE</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "#fff" }}>,845</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {bays.map(bay => (
          <div key={bay.id} style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.015)", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 700, color: "#fff" }}>{bay.name}</span>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: bay.status === "active" ? "#22c55e" : bay.status === "upcoming" ? "#f59e0b" : "#d4af37" }} />
              </div>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "#d4af37", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{bay.status}</span>
            </div>
            {bay.customer && (
              <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.6)", marginBottom: "0.5rem" }}>
                {bay.customer.name} &middot; {bay.customer.players}p &middot; {bay.golf?.course || "Practice"}
              </div>
            )}
            {bay.session && (
              <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
                {bay.session.startTime} - {bay.session.endTime} &middot; ${bay.session.paidAmount}
              </div>
            )}
            {!bay.customer && bay.nextReservation?.customerName && (
              <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.4)" }}>
                Next: {bay.nextReservation.customerName} at {bay.nextReservation.time}
              </div>
            )}
            {!bay.customer && !bay.nextReservation?.customerName && (
              <div style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.3)" }}>Open - no reservations</div>
            )}
            <div style={{ display: "flex", gap: "0.375rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
              {bay.status === "active" && <><button style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", cursor: "pointer", fontSize: "10px", color: "#d4af37", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Extend</button><button style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", cursor: "pointer", fontSize: "10px", color: "#fff", fontWeight: 600, fontFamily: "var(--font-ui)" }}>End</button></>}
              {bay.status === "available" && <button style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "6px", cursor: "pointer", fontSize: "10px", color: "#d4af37", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Walk-in</button>}
              {bay.status === "upcoming" && <button style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", cursor: "pointer", fontSize: "10px", color: "#fff", fontWeight: 600, fontFamily: "var(--font-ui)" }}>Check In</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
