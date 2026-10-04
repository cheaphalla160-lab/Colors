import React from 'react';

interface IconProps {
  type: string;
  isPlural?: boolean;
  className?: string;
}

export const ColorObjectIllustration: React.FC<IconProps> = ({
  type,
  isPlural = false,
  className = "w-24 h-24"
}) => {
  // Common drop-shadow and cute highlights
  switch (type) {
    case 'apple':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {isPlural ? (
            <g>
              {/* Apple 1 (left) */}
              <g transform="translate(-10, 10) scale(0.75)">
                <path d="M48 30 C30 18, 15 35, 20 60 C24 78, 38 88, 50 85 C62 88, 76 78, 80 60 C85 35, 70 18, 52 30 Z" fill="#DC2626" />
                <path d="M50 28 Q52 14 62 10" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 18 Q68 12 66 22 Z" fill="#22C55E" />
                <circle cx="34" cy="45" r="4" fill="white" opacity="0.6" />
              </g>
              {/* Apple 2 (right) */}
              <g transform="translate(30, 15) scale(0.7)">
                <path d="M48 30 C30 18, 15 35, 20 60 C24 78, 38 88, 50 85 C62 88, 76 78, 80 60 C85 35, 70 18, 52 30 Z" fill="#EF4444" />
                <path d="M50 28 Q52 14 62 10" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 18 Q68 12 66 22 Z" fill="#22C55E" />
              </g>
              {/* Apple 3 (center front) */}
              <g transform="translate(10, 2) scale(0.85)">
                <path d="M48 30 C30 18, 15 35, 20 60 C24 78, 38 88, 50 85 C62 88, 76 78, 80 60 C85 35, 70 18, 52 30 Z" fill="#EF4444" />
                <path d="M50 28 Q52 14 62 10" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 18 Q68 12 66 22 Z" fill="#16A34A" />
                <ellipse cx="36" cy="46" rx="5" ry="8" fill="white" opacity="0.4" transform="rotate(-15 36 46)" />
              </g>
            </g>
          ) : (
            <g>
              <path d="M48 30 C28 16, 12 36, 18 64 C23 85, 38 94, 50 90 C62 94, 77 85, 82 64 C88 36, 72 16, 52 30 Z" fill="#EF4444" />
              <path d="M50 28 Q53 12 65 8" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
              <path d="M55 18 Q72 10 70 24 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
              <ellipse cx="34" cy="48" rx="6" ry="11" fill="white" opacity="0.4" transform="rotate(-20 34 48)" />
              <circle cx="38" cy="68" r="3" fill="white" opacity="0.3" />
            </g>
          )}
        </svg>
      );

    case 'orange':
    case 'carrot':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Carrots */}
            <g transform="translate(10, 0) rotate(15 50 50)">
              <path d="M45 35 L40 85 Q48 88 56 85 L51 35 Z" fill="#F97316" />
              <path d="M48 35 Q40 15 35 10 M48 35 Q48 10 48 5 M48 35 Q56 15 62 10" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
              <line x1="43" y1="50" x2="49" y2="50" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
              <line x1="47" y1="65" x2="53" y2="65" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(-15, 5) rotate(-20 30 50) scale(0.85)">
              <path d="M45 35 L40 85 Q48 88 56 85 L51 35 Z" fill="#FB923C" />
              <path d="M48 35 Q40 15 35 10 M48 35 Q48 10 48 5 M48 35 Q56 15 62 10" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
            </g>
            <g transform="translate(25, 10) rotate(35 60 50) scale(0.75)">
              <path d="M45 35 L40 85 Q48 88 56 85 L51 35 Z" fill="#F97316" />
              <path d="M48 35 Q40 15 35 10 M48 35 Q48 10 48 5" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Juicy Orange Fruit */}
          <circle cx="50" cy="54" r="36" fill="#F97316" />
          <circle cx="50" cy="54" r="33" fill="#FB923C" opacity="0.6" />
          {/* Stem & Leaf */}
          <path d="M50 20 Q48 10 42 6" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 18 Q68 12 70 26 Q56 26 50 18 Z" fill="#22C55E" stroke="#16A34A" strokeWidth="1.5" />
          <ellipse cx="36" cy="42" rx="5" ry="9" fill="white" opacity="0.45" transform="rotate(-30 36 42)" />
          {/* Little texture dots */}
          <circle cx="58" cy="62" r="1.5" fill="#C2410C" opacity="0.5" />
          <circle cx="64" cy="54" r="1.5" fill="#C2410C" opacity="0.5" />
          <circle cx="42" cy="70" r="1.5" fill="#C2410C" opacity="0.5" />
        </svg>
      );

    case 'banana':
    case 'lemon':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Lemons */}
            <g transform="translate(-10, 15) rotate(-25 35 50) scale(0.75)">
              <ellipse cx="50" cy="50" rx="30" ry="20" fill="#EAB308" />
              <path d="M20 50 Q16 50 17 48" stroke="#CA8A04" strokeWidth="3" />
              <path d="M80 50 Q84 50 83 48" stroke="#CA8A04" strokeWidth="3" />
            </g>
            <g transform="translate(25, 20) rotate(30 65 50) scale(0.75)">
              <ellipse cx="50" cy="50" rx="30" ry="20" fill="#FACC15" />
            </g>
            <g transform="translate(10, -2) scale(0.85)">
              <ellipse cx="50" cy="50" rx="32" ry="22" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
              <ellipse cx="40" cy="42" rx="6" ry="3" fill="white" opacity="0.6" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Banana */}
          <path d="M22 28 C28 55, 55 82, 85 75 C82 78, 62 88, 38 78 C20 70, 14 45, 18 26 Z" fill="#EAB308" />
          <path d="M22 28 C30 52, 54 75, 85 75" stroke="#CA8A04" strokeWidth="3" fill="none" opacity="0.4" />
          {/* Stem tip */}
          <path d="M18 26 L14 18 L19 16 L22 28 Z" fill="#65A30D" />
          <circle cx="85" cy="75" r="2.5" fill="#78350F" />
          <path d="M26 38 C32 55, 48 68, 68 72" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'frog':
    case 'leaf':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Leaves */}
            <g transform="translate(-10, 10) rotate(-35 30 50) scale(0.8)">
              <path d="M30 75 Q15 45 45 25 Q75 45 60 75 Z" fill="#16A34A" />
              <path d="M45 25 L45 85" stroke="#15803D" strokeWidth="2" />
            </g>
            <g transform="translate(25, 15) rotate(35 60 50) scale(0.8)">
              <path d="M30 75 Q15 45 45 25 Q75 45 60 75 Z" fill="#22C55E" />
              <path d="M45 25 L45 85" stroke="#15803D" strokeWidth="2" />
            </g>
            <g transform="translate(5, -5) scale(0.9)">
              <path d="M30 75 Q15 45 45 25 Q75 45 60 75 Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="2" />
              <path d="M45 25 L45 88" stroke="#15803D" strokeWidth="2.5" />
              <path d="M45 40 Q35 45 32 48 M45 52 Q55 57 58 60" stroke="#15803D" strokeWidth="1.5" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cute Frog */}
          <ellipse cx="50" cy="62" rx="34" ry="24" fill="#22C55E" />
          {/* Frog Eyes */}
          <circle cx="32" cy="40" r="14" fill="#22C55E" />
          <circle cx="68" cy="40" r="14" fill="#22C55E" />
          <circle cx="32" cy="40" r="9" fill="white" />
          <circle cx="68" cy="40" r="9" fill="white" />
          <circle cx="34" cy="40" r="4.5" fill="#0F172A" />
          <circle cx="66" cy="40" r="4.5" fill="#0F172A" />
          <circle cx="36" cy="38" r="1.5" fill="white" />
          <circle cx="68" cy="38" r="1.5" fill="white" />
          {/* Cheerful Mouth & Blush */}
          <path d="M40 64 Q50 72 60 64" stroke="#15803D" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="26" cy="62" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
          <ellipse cx="74" cy="62" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
          {/* Belly */}
          <ellipse cx="50" cy="70" rx="20" ry="12" fill="#86EFAC" opacity="0.8" />
        </svg>
      );

    case 'whale':
    case 'blueberry':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Blueberries */}
            <circle cx="35" cy="45" r="20" fill="#2563EB" />
            <circle cx="65" cy="42" r="18" fill="#1D4ED8" />
            <circle cx="50" cy="65" r="22" fill="#3B82F6" />
            {/* Crown star on top */}
            <path d="M50 48 L48 52 L52 52 Z M50 52 L47 50 L53 50 Z" stroke="#1E3A8A" strokeWidth="2" />
            <ellipse cx="43" cy="58" rx="4" ry="6" fill="white" opacity="0.4" transform="rotate(-30 43 58)" />
            {/* Green Leaf */}
            <path d="M50 35 Q65 20 75 30 Q65 40 50 35 Z" fill="#22C55E" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue Whale */}
          <path d="M15 55 C15 32, 45 28, 75 38 C86 42, 92 48, 92 58 C90 70, 75 75, 50 75 C30 75, 15 68, 15 55 Z" fill="#3B82F6" />
          {/* Tail */}
          <path d="M18 55 Q5 45 4 35 Q10 48 18 52 Q10 58 4 68 Q5 58 18 55" fill="#2563EB" />
          {/* Water Spout */}
          <path d="M58 32 Q58 14 50 10 M58 32 Q64 16 72 12" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          {/* Eye & Smile */}
          <circle cx="74" cy="50" r="3" fill="#0F172A" />
          <circle cx="75" cy="49" r="1" fill="white" />
          <path d="M70 60 Q76 64 82 60" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          {/* Belly Lines */}
          <path d="M40 73 Q60 74 72 68" stroke="#93C5FD" strokeWidth="2" />
        </svg>
      );

    case 'eggplant':
    case 'grape':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bunch of Grapes */}
            <path d="M50 20 Q48 10 55 6" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 18 Q35 12 32 24 Z" fill="#22C55E" />
            <circle cx="40" cy="35" r="11" fill="#A855F7" />
            <circle cx="60" cy="35" r="11" fill="#9333EA" />
            <circle cx="50" cy="45" r="12" fill="#7E22CE" />
            <circle cx="35" cy="52" r="11" fill="#9333EA" />
            <circle cx="65" cy="52" r="11" fill="#A855F7" />
            <circle cx="44" cy="66" r="10" fill="#6B21A8" />
            <circle cx="58" cy="66" r="10" fill="#7E22CE" />
            <circle cx="50" cy="78" r="9" fill="#581C87" />
            <circle cx="48" cy="42" r="2.5" fill="white" opacity="0.5" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Eggplant */}
          <path d="M45 32 C38 42, 28 55, 30 72 C32 88, 50 94, 65 88 C78 80, 80 62, 70 48 C62 38, 55 30, 48 28 Z" fill="#A855F7" />
          {/* Green Calyx / Leaves */}
          <path d="M48 26 L45 14 Q52 10 54 8 L50 22" stroke="#15803D" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 28 Q48 36 58 28 Q50 42 38 28" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <ellipse cx="44" cy="62" rx="5" ry="12" fill="white" opacity="0.35" transform="rotate(-25 44 62)" />
        </svg>
      );

    case 'flamingo':
    case 'flower':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Pink Flowers */}
            <g transform="translate(10, -5)">
              <circle cx="40" cy="40" r="10" fill="#F472B6" />
              <circle cx="56" cy="40" r="10" fill="#F472B6" />
              <circle cx="40" cy="56" r="10" fill="#F472B6" />
              <circle cx="56" cy="56" r="10" fill="#F472B6" />
              <circle cx="48" cy="48" r="8" fill="#FDE047" />
            </g>
            <g transform="translate(-15, 25) scale(0.7)">
              <circle cx="40" cy="40" r="10" fill="#EC4899" />
              <circle cx="56" cy="40" r="10" fill="#EC4899" />
              <circle cx="40" cy="56" r="10" fill="#EC4899" />
              <circle cx="56" cy="56" r="10" fill="#EC4899" />
              <circle cx="48" cy="48" r="8" fill="#FDE047" />
            </g>
            <g transform="translate(35, 25) scale(0.65)">
              <circle cx="40" cy="40" r="10" fill="#F472B6" />
              <circle cx="56" cy="40" r="10" fill="#F472B6" />
              <circle cx="40" cy="56" r="10" fill="#F472B6" />
              <circle cx="56" cy="56" r="10" fill="#F472B6" />
              <circle cx="48" cy="48" r="8" fill="#FDE047" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Flamingo */}
          <path d="M48 60 Q30 60 32 45 Q36 32 55 35 Q70 38 72 52 Q72 65 48 60" fill="#EC4899" />
          {/* S-neck */}
          <path d="M60 40 Q75 30 70 18 Q65 10 56 12 Q50 14 55 20 Q62 26 55 38" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Head & Beak */}
          <circle cx="57" cy="14" r="7" fill="#F472B6" />
          <path d="M52 14 L42 16 Q45 22 53 18 Z" fill="#0F172A" />
          <circle cx="58" cy="13" r="1.5" fill="#0F172A" />
          {/* Legs */}
          <line x1="48" y1="60" x2="48" y2="88" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 60 L62 72 L52 75" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Wing highlight */}
          <path d="M42 45 Q55 42 58 54 Q48 58 42 45" fill="#DB2777" />
        </svg>
      );

    case 'teddy':
    case 'mushroom':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Brown Mushrooms */}
            <g transform="translate(10, 10)">
              <path d="M50 45 L50 78" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <path d="M25 46 C25 22, 75 22, 75 46 Z" fill="#92400E" />
              <circle cx="40" cy="35" r="3" fill="#FDE68A" />
              <circle cx="60" cy="38" r="3" fill="#FDE68A" />
            </g>
            <g transform="translate(-15, 25) scale(0.7)">
              <path d="M50 45 L50 78" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <path d="M25 46 C25 22, 75 22, 75 46 Z" fill="#78350F" />
            </g>
            <g transform="translate(35, 20) scale(0.75)">
              <path d="M50 45 L50 78" stroke="#E2E8F0" strokeWidth="12" strokeLinecap="round" />
              <path d="M25 46 C25 22, 75 22, 75 46 Z" fill="#B45309" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cute Brown Teddy Bear */}
          {/* Ears */}
          <circle cx="30" cy="28" r="12" fill="#92400E" />
          <circle cx="30" cy="28" r="6" fill="#D97706" />
          <circle cx="70" cy="28" r="12" fill="#92400E" />
          <circle cx="70" cy="28" r="6" fill="#D97706" />
          {/* Body */}
          <circle cx="50" cy="65" r="26" fill="#92400E" />
          <circle cx="50" cy="67" r="16" fill="#B45309" />
          {/* Head */}
          <circle cx="50" cy="42" r="22" fill="#92400E" />
          {/* Snout */}
          <ellipse cx="50" cy="48" rx="10" ry="7" fill="#FDE68A" />
          <polygon points="47,46 53,46 50,50" fill="#451A03" />
          <path d="M50 50 L50 53 M47 53 Q50 56 53 53" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="42" cy="38" r="3" fill="#1C1917" />
          <circle cx="58" cy="38" r="3" fill="#1C1917" />
          <circle cx="43" cy="37" r="1" fill="white" />
          <circle cx="59" cy="37" r="1" fill="white" />
        </svg>
      );

    case 'cat':
    case 'ant':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Black Ants */}
            <g transform="translate(10, 15)">
              <circle cx="30" cy="50" r="8" fill="#1E293B" />
              <circle cx="46" cy="50" r="7" fill="#0F172A" />
              <circle cx="64" cy="50" r="11" fill="#1E293B" />
              <path d="M42 50 L38 65 M48 50 L52 65 M50 50 L58 65" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              <path d="M28 45 Q20 38 18 32 M32 45 Q36 38 40 32" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
            </g>
            <g transform="translate(25, -15) scale(0.65)">
              <circle cx="30" cy="50" r="8" fill="#1E293B" />
              <circle cx="46" cy="50" r="7" fill="#0F172A" />
              <circle cx="64" cy="50" r="11" fill="#1E293B" />
            </g>
            <g transform="translate(-10, 35) scale(0.65)">
              <circle cx="30" cy="50" r="8" fill="#334155" />
              <circle cx="46" cy="50" r="7" fill="#1E293B" />
              <circle cx="64" cy="50" r="11" fill="#0F172A" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cute Black Cat */}
          {/* Ears */}
          <polygon points="26,45 34,18 48,34" fill="#0F172A" />
          <polygon points="30,42 35,24 45,34" fill="#F472B6" />
          <polygon points="74,45 66,18 52,34" fill="#0F172A" />
          <polygon points="70,42 65,24 55,34" fill="#F472B6" />
          {/* Head */}
          <circle cx="50" cy="50" r="26" fill="#1E293B" />
          {/* Eyes (Glowing Yellow-Green) */}
          <ellipse cx="40" cy="48" rx="6" ry="8" fill="#FDE047" />
          <ellipse cx="60" cy="48" rx="6" ry="8" fill="#FDE047" />
          <ellipse cx="40" cy="48" rx="2" ry="6" fill="#0F172A" />
          <ellipse cx="60" cy="48" rx="2" ry="6" fill="#0F172A" />
          {/* Nose & Whiskers */}
          <polygon points="48,56 52,56 50,59" fill="#F472B6" />
          <line x1="24" y1="54" x2="38" y2="56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="62" x2="38" y2="60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="54" x2="62" y2="56" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="62" x2="62" y2="60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'cloud':
    case 'snowflake':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 White Snowflakes with soft cyan glow */}
            <g transform="translate(10, 5)">
              <line x1="50" y1="20" x2="50" y2="60" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
              <line x1="30" y1="40" x2="70" y2="40" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
              <line x1="36" y1="26" x2="64" y2="54" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              <line x1="36" y1="54" x2="64" y2="26" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="40" r="4" fill="#FFFFFF" />
            </g>
            <g transform="translate(-15, 25) scale(0.65)">
              <line x1="50" y1="20" x2="50" y2="60" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
              <line x1="30" y1="40" x2="70" y2="40" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
            </g>
            <g transform="translate(35, 25) scale(0.7)">
              <line x1="50" y1="20" x2="50" y2="60" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
              <line x1="30" y1="40" x2="70" y2="40" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fluffy White Cloud */}
          <rect width="100" height="100" rx="20" fill="#F1F5F9" />
          <ellipse cx="50" cy="62" rx="35" ry="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="34" cy="50" r="16" fill="#FFFFFF" />
          <circle cx="64" cy="52" r="14" fill="#FFFFFF" />
          <circle cx="48" cy="40" r="20" fill="#FFFFFF" />
          {/* Cute Face */}
          <circle cx="42" cy="56" r="2.5" fill="#475569" />
          <circle cx="58" cy="56" r="2.5" fill="#475569" />
          <path d="M47 62 Q50 65 53 62" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="60" r="3" fill="#F472B6" opacity="0.6" />
          <circle cx="64" cy="60" r="3" fill="#F472B6" opacity="0.6" />
        </svg>
      );

    case 'elephant':
    case 'koala':
      if (isPlural) {
        return (
          <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3 Grey Koalas */}
            <g transform="translate(10, 10)">
              {/* Ears */}
              <circle cx="30" cy="38" r="14" fill="#64748B" />
              <circle cx="30" cy="38" r="8" fill="#CBD5E1" />
              <circle cx="70" cy="38" r="14" fill="#64748B" />
              <circle cx="70" cy="38" r="8" fill="#CBD5E1" />
              {/* Head */}
              <circle cx="50" cy="52" r="22" fill="#94A3B8" />
              {/* Big Black Nose */}
              <ellipse cx="50" cy="54" rx="8" ry="12" fill="#0F172A" />
              {/* Eyes */}
              <circle cx="38" cy="48" r="3" fill="#0F172A" />
              <circle cx="62" cy="48" r="3" fill="#0F172A" />
            </g>
            <g transform="translate(-18, 25) scale(0.65)">
              <circle cx="30" cy="38" r="14" fill="#64748B" />
              <circle cx="70" cy="38" r="14" fill="#64748B" />
              <circle cx="50" cy="52" r="22" fill="#94A3B8" />
              <ellipse cx="50" cy="54" rx="8" ry="12" fill="#0F172A" />
            </g>
            <g transform="translate(36, 25) scale(0.65)">
              <circle cx="30" cy="38" r="14" fill="#64748B" />
              <circle cx="70" cy="38" r="14" fill="#64748B" />
              <circle cx="50" cy="52" r="22" fill="#94A3B8" />
              <ellipse cx="50" cy="54" rx="8" ry="12" fill="#0F172A" />
            </g>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grey Elephant */}
          {/* Big Ear */}
          <circle cx="28" cy="42" r="18" fill="#94A3B8" />
          <circle cx="28" cy="42" r="10" fill="#CBD5E1" />
          {/* Body */}
          <ellipse cx="62" cy="60" rx="24" ry="20" fill="#64748B" />
          {/* Head */}
          <circle cx="45" cy="48" r="20" fill="#64748B" />
          {/* Trunk curved up happily */}
          <path d="M42 55 Q36 68 28 66 Q24 64 26 58 Q32 52 38 48" stroke="#64748B" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Eye */}
          <circle cx="42" cy="42" r="3.5" fill="#0F172A" />
          <circle cx="43" cy="41" r="1" fill="white" />
          {/* Legs */}
          <rect x="52" y="70" width="8" height="15" rx="3" fill="#475569" />
          <rect x="68" y="70" width="8" height="15" rx="3" fill="#475569" />
        </svg>
      );

    default:
      return (
        <div className={`rounded-full bg-slate-300 flex items-center justify-center ${className}`}>
          <span className="text-xl font-bold">?</span>
        </div>
      );
  }
};
