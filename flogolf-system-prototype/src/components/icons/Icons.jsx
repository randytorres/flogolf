import React from 'react';

// Golf-related icons
export const GolfBallIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="8" cy="9" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="16" cy="9" r="1.5" fill={color} />
    <circle cx="8" cy="15" r="1.5" fill={color} />
    <circle cx="16" cy="15" r="1.5" fill={color} />
  </svg>
);

export const GolfClubIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 21L14 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 10C14 10 16 8 18 8C20 8 20 10 20 12C20 14 18 14 18 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="19" r="2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const FlagIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 21V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M5 3L15 8L5 13V3Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <circle cx="5" cy="21" r="1" fill={color} />
  </svg>
);

export const TargetIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

export const GolfHoleIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="12" cy="16" rx="8" ry="4" fill={color} fillOpacity="0.3" />
    <ellipse cx="12" cy="16" rx="8" ry="4" stroke={color} strokeWidth="2" />
    <path d="M12 4V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 4L15 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 4L9 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TeeIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 22L12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 12C12 9 9 7 6 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 12C12 9 15 7 18 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="5" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
  </svg>
);

// Business icons
export const FlogolfLogo = ({ size = 40, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="120" height="120" rx="20" fill="#0d2f0a" />
    <circle cx="40" cy="45" r="12" stroke="#d4af37" strokeWidth="3" fill="none" />
    <circle cx="36" cy="42" r="2" fill="#d4af37" />
    <circle cx="44" cy="42" r="2" fill="#d4af37" />
    <circle cx="40" cy="48" r="2" fill="#d4af37" />
    <circle cx="36" cy="52" r="2" fill="#d4af37" />
    <circle cx="44" cy="52" r="2" fill="#d4af37" />
    <path d="M55 80L75 35" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
    <path d="M75 35C75 35 85 30 85 40C85 50 75 50 75 50" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
    <text x="20" y="100" fill="#d4af37" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold">FLOGOLF</text>
  </svg>
);

export const FlogolfLogoMark = ({ size = 40, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="40" height="40" rx="8" fill="#0d2f0a" />
    <text x="8" y="28" fill="#d4af37" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold">F</text>
  </svg>
);

// Navigation icons
export const DashboardIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" stroke={color} strokeWidth="2" />
  </svg>
);

export const CustomersIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none" />
    <path d="M4 20C4 16 8 14 12 14C16 14 20 16 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="8" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M20 14C22 15 22 17 22 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const EventsIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M3 9H21" stroke={color} strokeWidth="2" />
    <path d="M8 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 2V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1.5" fill={color} />
    <circle cx="12" cy="14" r="1.5" fill={color} />
    <circle cx="16" cy="14" r="1.5" fill={color} />
  </svg>
);

export const AutomationIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 2V5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 19V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12H5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M19 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 4.93L7.05 7.05" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16.95 16.95L19.07 19.07" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 19.07L7.05 16.95" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16.95 7.05L19.07 4.93" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SimBayIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="4" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <rect x="4" y="6" width="16" height="8" rx="1" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
    <path d="M8 20V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 20V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LeagueIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 4H18V8L15 11L18 14V18H6V14L9 11L6 8V4Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M12 2L14 5H10L12 2Z" fill={color} />
    <path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="22" r="1" fill={color} />
  </svg>
);

export const LessonIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const GiftCardIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M2 10H22" stroke={color} strokeWidth="2" />
    <path d="M12 6V20" stroke={color} strokeWidth="2" />
    <path d="M8 3C8 3 8 6 12 6C16 6 16 3 16 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MenuIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="6" r="1" fill={color} />
    <circle cx="18" cy="12" r="1" fill={color} />
  </svg>
);

// Status icons
export const ActiveIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WarningIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L22 20H2L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 10V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="18" r="1" fill={color} />
  </svg>
);

export const DangerIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill={color} />
  </svg>
);

// Utility icons
export const SearchIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" fill="none" />
    <path d="M16 16L21 21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BellIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 8C18 6.4 17.4 4.8 16.2 3.6C15 2.4 13.4 1.8 11.8 1.8C10.2 1.8 8.6 2.4 7.4 3.6C6.2 4.8 5.6 6.4 5.6 8V13L3.6 15V16H20.4V15L18 13V8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M9.8 20.2C9.9 20.4 10.1 20.5 10.4 20.5H13.6C13.9 20.5 14.1 20.4 14.2 20.2C14.3 20 14.3 19.8 14.2 19.6L13.8 18.5H10.2L9.8 19.6C9.7 19.8 9.7 20 9.8 20.2Z" fill={color} />
  </svg>
);

export const SettingsIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LocationIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    <circle cx="12" cy="9" r="3" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const PhoneIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.98C20.83 21 20.66 21 20.5 21C11.4 21 4 13.6 4 4.5C4 4.34 4 4.17 4.02 4C4.07 3.44 4.52 3 5.08 3H8.08C8.57 3 8.98 3.36 9.02 3.84C9.06 4.45 9.18 5.04 9.38 5.61C9.48 5.89 9.42 6.2 9.22 6.42L7.97 7.67C9.33 10.4 11.6 12.67 14.33 14.03L15.58 12.78C15.8 12.58 16.11 12.52 16.39 12.62C16.96 12.82 17.55 12.94 18.16 12.98C18.64 13.02 19 13.43 19 13.92V16.92C19 17.47 18.55 17.93 18 17.98" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const MailIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M2 6L12 13L22 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EditIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11 4H4C3.45 4 2.94 4.21 2.54 4.61C2.14 5 1.93 5.51 1.93 6V20C1.93 20.49 2.14 21 2.54 21.39C2.94 21.79 3.45 22 4 22H18C18.55 22 19.06 21.79 19.46 21.39C19.86 21 20.07 20.49 20.07 20V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M18.5 2.49C18.89 2.09 19.4 1.88 19.93 1.88C20.46 1.88 20.97 2.09 21.37 2.49C21.77 2.89 21.98 3.4 21.98 3.93C21.98 4.46 21.77 4.97 21.37 5.37L12 14.75L8 16L9.25 12L18.5 2.49Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const DollarIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M17 5H9.5C8.57 5 7.68 5.37 7.02 6.02C6.37 6.68 6 7.57 6 8.5C6 9.43 6.37 10.32 7.02 10.98C7.68 11.63 8.57 12 9.5 12H14.5C15.43 12 16.32 12.37 16.98 13.02C17.63 13.68 18 14.57 18 15.5C18 16.43 17.63 17.32 16.98 17.98C16.32 18.63 15.43 19 14.5 19H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrendUpIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 6H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrendDownIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 18H23V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CalendarIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ClockIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StarIcon = ({ size = 20, color = 'currentColor', filled = false, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={filled ? color : 'none'} fillOpacity={filled ? 0.3 : 0} />
  </svg>
);

export const UsersIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
    <path d="M3 21V19C3 16.79 4.79 15 7 15H11C13.21 15 15 16.79 15 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="9" r="3" stroke={color} strokeWidth="2" fill="none" />
    <path d="M21 21V19C21 17.34 19.66 16 18 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TrophyIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 4H18V9C18 11.65 15.65 14 13 14H11C8.35 14 6 11.65 6 9V4Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" />
    <path d="M6 4H4V8C4 9.5 4.5 11 6 11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 4H20V8C20 9.5 19.5 11 18 11" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 14V18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M8 22H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 18H14V22H10V18Z" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const ArrowRightIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowLeftIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDownIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronUpIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 15L12 9L6 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlayIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 3L19 12L5 21V3Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color} fillOpacity="0.3" />
  </svg>
);

export const PauseIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="6" y="4" width="4" height="16" rx="1" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3" />
    <rect x="14" y="4" width="4" height="16" rx="1" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3" />
  </svg>
);

export const CopyIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M16 8V6C16 4.9 15.1 4 14 4H6C4.9 4 4 4.9 4 6V14C4 15.1 4.9 16 6 16H8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const MoreIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="6" r="1.5" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} />
    <circle cx="12" cy="18" r="1.5" fill={color} />
  </svg>
);

export const GridIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth="2" fill="none" />
    <rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth="2" fill="none" />
    <rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth="2" fill="none" />
    <rect x="14" y="14" width="7" height="7" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const ReportIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M7 14L10 10L14 13L17 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="17" cy="7" r="1.5" fill={color} />
  </svg>
);

// Food & Drink icon
export const CocktailIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 2H16L12 9L17 18H7L12 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 18H17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 18V22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="3" r="1" fill={color} />
  </svg>
);

export const CheckIcon = ({ size = 20, color = 'currentColor', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Export all icons as a collection for easy access
export const Icons = {
  GolfBall: GolfBallIcon,
  GolfClub: GolfClubIcon,
  Flag: FlagIcon,
  Target: TargetIcon,
  GolfHole: GolfHoleIcon,
  Tee: TeeIcon,
  Logo: FlogolfLogo,
  LogoMark: FlogolfLogoMark,
  Dashboard: DashboardIcon,
  Customers: CustomersIcon,
  Events: EventsIcon,
  Automation: AutomationIcon,
  SimBay: SimBayIcon,
  League: LeagueIcon,
  Lesson: LessonIcon,
  GiftCard: GiftCardIcon,
  Menu: MenuIcon,
  Active: ActiveIcon,
  Warning: WarningIcon,
  Danger: DangerIcon,
  Search: SearchIcon,
  Bell: BellIcon,
  Settings: SettingsIcon,
  Location: LocationIcon,
  Phone: PhoneIcon,
  Mail: MailIcon,
  Edit: EditIcon,
  Dollar: DollarIcon,
  TrendUp: TrendUpIcon,
  TrendDown: TrendDownIcon,
  Calendar: CalendarIcon,
  Clock: ClockIcon,
  Star: StarIcon,
  Users: UsersIcon,
  Trophy: TrophyIcon,
  ArrowRight: ArrowRightIcon,
  ArrowLeft: ArrowLeftIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  Plus: PlusIcon,
  Close: CloseIcon,
  Play: PlayIcon,
  Pause: PauseIcon,
  Copy: CopyIcon,
  Filter: FilterIcon,
  More: MoreIcon,
  Grid: GridIcon,
  Report: ReportIcon,
  Cocktail: CocktailIcon,
  Check: CheckIcon,
};

export default Icons;
