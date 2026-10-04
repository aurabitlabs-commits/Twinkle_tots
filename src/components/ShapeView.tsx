interface ShapeViewProps {
  shapeId: string;
  color?: string;
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}

export function ShapeView({
  shapeId,
  color = '#FF8C42',
  size = 64,
  stroke = 'transparent',
  strokeWidth = 0,
  className = '',
}: ShapeViewProps) {
  const renderPath = () => {
    switch (shapeId) {
      case 'circle':
        return <circle cx="50" cy="50" r="40" fill={color} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'square':
        return <rect x="15" y="15" width="70" height="70" rx="12" fill={color} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'triangle':
        return (
          <polygon
            points="50,12 88,84 12,84"
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      case 'rectangle':
        return <rect x="10" y="24" width="80" height="52" rx="10" fill={color} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'oval':
        return <ellipse cx="50" cy="50" rx="36" ry="24" fill={color} stroke={stroke} strokeWidth={strokeWidth} />;
      case 'star':
        return (
          <polygon
            points="50,10 61,35 88,38 68,56 73,83 50,69 27,83 32,56 12,38 39,35"
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      case 'heart':
        return (
          <path
            d="M 50 82 C 20 56, 12 40, 18 25 C 26 10, 44 16, 50 28 C 56 16, 74 10, 82 25 C 88 40, 80 56, 50 82 Z"
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      case 'diamond':
        return (
          <polygon
            points="50,10 88,50 50,90 12,50"
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        );
      default:
        return <circle cx="50" cy="50" r="40" fill={color} stroke={stroke} strokeWidth={strokeWidth} />;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`overflow-visible ${className}`}
    >
      {renderPath()}
    </svg>
  );
}
