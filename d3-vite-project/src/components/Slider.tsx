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
        width: '100%',
        marginBottom: '20px',
      }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <div
          style={{
            position: 'absolute',
            left: `${((year - 2005) / (2023 - 2005)) * 100}%`,
            transform: 'translateX(-50%)',
            bottom: '25px',
            background: '#2f4f8a',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          {year}
        </div>
        <input
          type="range"
          min="2005"
          max="2023"
          step={1}
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          style={{
            width: '100%',
            appearance: 'none',
            height: '8px',
            background: '#E9ECEF',
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
