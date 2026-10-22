import React from 'react';

interface KairouanLogoProps {
  size?: number;
  variant?: 'gold' | 'dark' | 'white';
  showText?: boolean;
  className?: string;
}

let _maskCounter = 0;

export const MosqueSVG: React.FC<{ size?: number; color?: string }> = ({
  size = 48,
  color = '#C9A84C',
}) => {
  const maskId = React.useRef(`mosque-mask-${++_maskCounter}`).current;
  return (
    <svg
      width={size}
      height={size * 0.88}
      viewBox="0 0 200 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id={maskId}>
          <rect width="200" height="176" fill="white" />
          <path d="M76 124 L76 100 Q100 80 124 100 L124 124 Z" fill="black" />
          <path d="M20 124 L20 107 Q36 94 52 107 L52 124 Z" fill="black" />
          <path d="M148 124 L148 107 Q164 94 180 107 L180 124 Z" fill="black" />
          <path d="M14 144 L14 135 Q22 129 30 135 L30 144 Z" fill="black" />
          <path d="M36 144 L36 135 Q44 129 52 135 L52 144 Z" fill="black" />
          <path d="M76 144 L76 135 Q84 129 92 135 L92 144 Z" fill="black" />
          <path d="M108 144 L108 135 Q116 129 124 135 L124 144 Z" fill="black" />
          <path d="M148 144 L148 135 Q156 129 164 135 L164 144 Z" fill="black" />
          <path d="M170 144 L170 135 Q178 129 186 135 L186 144 Z" fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`} fill={color}>
        <circle cx="100" cy="6" r="3.5" />
        <rect x="98.5" y="9" width="3" height="10" />
        <path d="M60 52 Q60 19 100 19 Q140 19 140 52 Z" />
        <rect x="60" y="48" width="80" height="14" />
        <path d="M14 74 Q14 56 34 56 Q54 56 54 74 Z" />
        <rect x="14" y="70" width="40" height="12" />
        <path d="M146 74 Q146 56 166 56 Q186 56 186 74 Z" />
        <rect x="146" y="70" width="40" height="12" />
        <rect x="52" y="62" width="96" height="62" />
        <rect x="12" y="82" width="44" height="42" />
        <rect x="144" y="82" width="44" height="42" />
        <rect x="6" y="124" width="188" height="22" />
        <rect x="0" y="146" width="200" height="10" />
      </g>
    </svg>
  );
};

const KairouanLogo: React.FC<KairouanLogoProps> = ({
  size = 44,
  variant = 'gold',
  showText = true,
  className = '',
}) => {
  const color =
    variant === 'gold' ? '#C9A84C' : variant === 'white' ? '#ffffff' : '#0d2b12';

  const titleClass =
    variant === 'dark'
      ? 'text-forest-950 font-display font-bold leading-none'
      : 'text-gold-300 font-display font-bold leading-none';

  const arabicClass =
    variant === 'dark'
      ? 'text-forest-800 text-xs leading-none'
      : 'text-gold-400/70 text-xs leading-none';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <MosqueSVG size={size} color={color} />
      {showText && (
        <div className="flex flex-col gap-0.5">
          <span className={`${titleClass} text-base`}>Kairouan Academy</span>
          <span className={arabicClass} dir="rtl">
            أكاديمية القيروان
          </span>
        </div>
      )}
    </div>
  );
};

export default KairouanLogo;
