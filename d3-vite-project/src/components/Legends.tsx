import { getPlotColor } from '../utils';

const values = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
  'Hovered',
];

const legendsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
  marginBottom: '0.5rem',
  flexWrap: 'wrap',
};

const legendStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.1rem',
};

export const Legends = () => {
  return (
    <div style={legendsStyle}>
      {values.map((value) => (
        <div key={value} style={legendStyle}>
          <svg width="20" height="20">
            <circle
              cx="10"
              cy="10"
              r="5"
              fill={getPlotColor(value)}
              filter={
                value == 'Hovered' ? 'drop-shadow(0px 0px 1px #000000)' : ''
              }
            />
          </svg>
          <span>{value}</span>
        </div>
      ))}
      <div key={'active'} style={legendStyle}>
        <svg width="20" height="20">
          <circle
            cx="10"
            cy="10"
            r="5"
            stroke="yellow"
            filter="drop-shadow(0px 0px 1px #000000)"
            strokeWidth="4"
            fill={'black'}
          />
        </svg>
        <span>Selected</span>
      </div>
    </div>
  );
};
