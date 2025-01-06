interface SliderProps {
  year: number;
  setYear: (year: number) => void;
}

export const Slider: React.FC<SliderProps> = ({ year, setYear }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        position: 'relative',
        width: '90%',
      }}
    >
      {/* Slider Container */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Value Bubble */}
        <div
          style={{
            position: 'absolute',
            left: `${((year - 2008) / (2023 - 2008)) * 100}%`,
            transform: 'translateX(-50%)',
            bottom: '25px', // Adjust for bubble position
            background: '#007BFF',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {year}
        </div>
        {/* Slider */}
        <input
          type="range"
          min="2008"
          max="2023"
          step={1}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{
            width: '100%',
            appearance: 'none',
            height: '8px',
            background: '#ddd',
            borderRadius: '4px',
            outline: 'none',
            cursor: 'pointer',
            position: 'relative',
          }}
        />
      </div>
    </div>
  );
};
