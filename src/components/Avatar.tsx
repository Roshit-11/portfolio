/**
 * Avatars used across the site.
 * - Avatar: the hero centerpiece — a 3D-glass "cyber" bust with bold motion.
 * - MiniMe: compact "guide" version used beside section headers.
 * - PersonAvatar: a small coloured person used in the floating network.
 */

export const Avatar = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 340 520"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="3D glass avatar representing Roshit"
  >
    <defs>
      <radialGradient id="avHead" cx="40%" cy="30%" r="78%">
        <stop offset="0%" stopColor="#5f5a4e" />
        <stop offset="55%" stopColor="#332f28" />
        <stop offset="100%" stopColor="#16140F" />
      </radialGradient>
      <linearGradient id="avTorso" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6b7d2f" />
        <stop offset="100%" stopColor="#2a3216" />
      </linearGradient>
      <linearGradient id="avVisor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0e1408" />
        <stop offset="100%" stopColor="#28331b" />
      </linearGradient>
      <linearGradient id="avGloss" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="45%" stopColor="#ffffff" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="avBack" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#C6F24E" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#C6F24E" stopOpacity="0" />
      </radialGradient>
      <filter id="avBlur" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <clipPath id="avVisorClip">
        <rect x="102" y="150" width="136" height="62" rx="31" />
      </clipPath>
    </defs>

    <g className="av-float">
      {/* ground shadow */}
      <ellipse cx="170" cy="488" rx="98" ry="16" fill="#14140F" opacity="0.22" filter="url(#avBlur)" />
      {/* back glow */}
      <circle cx="170" cy="178" r="145" fill="url(#avBack)" className="av-glow" />

      {/* neck (behind torso, connects to head) */}
      <rect x="150" y="246" width="40" height="96" rx="16" fill="#2a2721" />

      {/* torso */}
      <path d="M52 500 C 52 372 94 320 170 320 C 246 320 288 372 288 500 Z" fill="url(#avTorso)" />
      <path d="M88 346 C 122 322 218 322 252 346" fill="none" stroke="#C6F24E" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
      {/* chest core */}
      <circle cx="170" cy="430" r="21" fill="#16140F" />
      <circle cx="170" cy="430" r="21" fill="none" stroke="#C6F24E" strokeOpacity="0.5" strokeWidth="2" className="av-core" />
      <circle cx="170" cy="430" r="11" fill="#C6F24E" className="av-core" />

      {/* ear pods */}
      <rect x="84" y="158" width="22" height="52" rx="11" fill="#16140F" />
      <rect x="234" y="158" width="22" height="52" rx="11" fill="#16140F" />
      <circle cx="95" cy="184" r="4.5" fill="#C6F24E" className="av-eye" />
      <circle cx="245" cy="184" r="4.5" fill="#C6F24E" className="av-eye" />

      {/* head glow rim + head */}
      <ellipse cx="170" cy="176" rx="82" ry="92" fill="none" stroke="#C6F24E" strokeOpacity="0.6" strokeWidth="3" filter="url(#avBlur)" />
      <ellipse cx="170" cy="176" rx="80" ry="90" fill="url(#avHead)" />
      <ellipse cx="144" cy="132" rx="30" ry="42" fill="url(#avGloss)" />
      <ellipse cx="170" cy="176" rx="80" ry="90" fill="none" stroke="#C6F24E" strokeOpacity="0.32" strokeWidth="1.5" />

      {/* visor */}
      <rect x="102" y="150" width="136" height="62" rx="31" fill="url(#avVisor)" stroke="#C6F24E" strokeOpacity="0.55" strokeWidth="1.5" />
      <g clipPath="url(#avVisorClip)">
        {/* HUD code */}
        <rect x="116" y="161" width="34" height="4" rx="2" fill="#C6F24E" className="av-blink" />
        <rect x="158" y="161" width="18" height="4" rx="2" fill="#8a9a3b" className="av-blink" style={{ animationDelay: '0.5s' }} />
        <rect x="116" y="189" width="30" height="4" rx="2" fill="#8a9a3b" className="av-blink" style={{ animationDelay: '0.9s' }} />
        <rect x="154" y="189" width="34" height="4" rx="2" fill="#C6F24E" className="av-blink" style={{ animationDelay: '0.3s' }} />
        {/* eyes */}
        <circle cx="150" cy="181" r="7.5" fill="#C6F24E" className="av-eye" />
        <circle cx="196" cy="181" r="7.5" fill="#C6F24E" className="av-eye" />
        {/* scan line */}
        <rect x="102" y="150" width="136" height="3" fill="#C6F24E" opacity="0.85" className="av-scan" />
        {/* visor gloss */}
        <rect x="108" y="150" width="26" height="62" fill="url(#avGloss)" opacity="0.5" />
      </g>

      {/* floating particles */}
      <circle cx="66" cy="118" r="4.5" fill="#C6F24E" className="av-eye" />
      <circle cx="286" cy="248" r="3.5" fill="#8a9a3b" className="av-eye" style={{ animationDelay: '0.7s' }} />
      <circle cx="292" cy="150" r="3" fill="#C6F24E" className="av-blink" />
      <path d="M60 300 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 z" fill="#C6F24E" className="av-blink" style={{ animationDelay: '0.4s' }} />
      <path d="M286 340 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 z" fill="#8a9a3b" className="av-blink" style={{ animationDelay: '1s' }} />
    </g>
  </svg>
);

export const MiniMe = ({ accent = '#4F46E5', className = '' }: { accent?: string; className?: string }) => (
  <svg viewBox="0 0 72 84" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="16" y="44" width="40" height="40" rx="16" fill={accent} />
    <rect x="26" y="30" width="20" height="20" rx="7" fill="#E8B58C" />
    <circle cx="36" cy="28" r="24" fill="#E8B58C" />
    <rect x="10" y="2" width="52" height="22" rx="11" fill="#22222A" />
    <rect x="6" y="20" width="10" height="20" rx="4" fill="#16161A" />
    <rect x="56" y="20" width="10" height="20" rx="4" fill="#16161A" />
    <circle cx="27" cy="29" r="7" fill="#fff" stroke="#22222A" strokeWidth="2" />
    <circle cx="45" cy="29" r="7" fill="#fff" stroke="#22222A" strokeWidth="2" />
    <circle cx="27" cy="29" r="2.5" fill="#22222A" />
    <circle cx="45" cy="29" r="2.5" fill="#22222A" />
    <path d="M31 38 q5 5 10 0" fill="none" stroke="#22222A" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const PersonAvatar = ({ color, className = '' }: { color: string; className?: string }) => (
  <svg viewBox="0 0 72 72" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="36" cy="36" r="36" fill={color} opacity="0.18" />
    <circle cx="36" cy="30" r="13" fill={color} />
    <ellipse cx="36" cy="66" rx="28" ry="22" fill={color} />
  </svg>
);
