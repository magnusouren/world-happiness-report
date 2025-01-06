import { useEffect, useState } from 'react';
import { DataRow } from './Map';
import { ScatterPlot } from './ScatterPlot';
import './ScatterPlotContainer.css';

interface ScatterPlotContainerProps {
  data: DataRow[];
  hoveredCountry: string | null;
  selectedCountries: { countryName: string; year: number }[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCountries: React.Dispatch<
    React.SetStateAction<{ countryName: string; year: number }[]>
  >;
}

export const ScatterPlotContainer: React.FC<ScatterPlotContainerProps> = ({
  data,
  hoveredCountry,
  selectedCountries,
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const [xColumn, setXColumn] = useState<keyof DataRow>('pca1');
  const [yColumn, setYColumn] = useState<keyof DataRow>('pca2');
  const [year, setYear] = useState<number>(2023);
  const [continent, setContinent] = useState<string>('All');

  useEffect(() => {
    setHoveredCountry(null);
  }, [xColumn, yColumn, year, continent, setHoveredCountry]);

  const convertKeyToLabel = (key: string) => {
    // Check if the key contains '_z'
    if (key.includes('_z')) {
      // Remove '_z' and add 'Normalized' at the start of the string
      key = `normalized ${key.replace('_z', '')}`;
    }

    // Convert camelCase to space-separated and capitalize the first letter
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div id="scatterplot-container">
      <div id="scatterplot-controls">
        <div>
          <label>X-axis:</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value as keyof DataRow)}
          >
            {Object.keys(data[0] || {})
              .filter(
                (k) => k !== 'countryName' && k !== 'year' && k !== 'continent'
              )
              .map((key) => (
                <option key={key} value={key}>
                  {convertKeyToLabel(key)}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Y-axis:</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value as keyof DataRow)}
          >
            {Object.keys(data[0] || {})
              .filter(
                (k) => k !== 'countryName' && k !== 'year' && k !== 'continent'
              )
              .map((key) => (
                <option key={key} value={key}>
                  {convertKeyToLabel(key)}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {Array.from(new Set(data.map((d) => d.year))).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Continent:</label>
          <select
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
          >
            {Array.from(new Set(data.map((d) => d.continent))).map(
              (continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              )
            )}
            <option key="All" value="All">
              All
            </option>
          </select>
        </div>
      </div>
      <ScatterPlot
        data={data.filter(
          (d) =>
            d.year === year &&
            (continent === 'All' || d.continent === continent)
        )}
        hoveredCountry={hoveredCountry}
        dynamicAxis={xColumn === 'pca1' && yColumn === 'pca2' ? false : true}
        xColumn={xColumn}
        yColumn={yColumn}
        size="small"
        setSelectedCountries={setSelectedCountries}
        setHoveredCountry={setHoveredCountry}
        selectedCountries={selectedCountries}
      />
    </div>
  );
};
