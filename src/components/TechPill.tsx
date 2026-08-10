import { useTechHighlight } from '../hooks/TechHighlightContext';

interface TechPillProps {
  tech: string;
  className?: string;
}

export const TechPill = ({ tech, className = '' }: TechPillProps) => {
  const { hoveredTech, setHoveredTech } = useTechHighlight();
  const isHighlighted = hoveredTech === tech;

  return (
    <span
      onMouseEnter={() => setHoveredTech(tech)}
      onMouseLeave={() => setHoveredTech(null)}
      className={`chip-outline transition-all duration-300 cursor-pointer select-none ${
        isHighlighted
          ? 'bg-[#C5FF3B] text-[#1A1A18] border-[#C5FF3B] shadow-[0_0_12px_rgba(197,255,59,0.75)] scale-105 font-semibold'
          : 'hover:border-accent/40'
      } ${className}`}
    >
      {tech}
    </span>
  );
};
