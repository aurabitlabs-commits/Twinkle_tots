interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center max-w-[280px]">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-200"
          style={{
            width: i === current ? '24px' : '10px',
            height: '10px',
            backgroundColor: i === current ? '#FF8C42' : i < current ? '#FFCC80' : '#E0E0E0',
          }}
        />
      ))}
    </div>
  );
}
