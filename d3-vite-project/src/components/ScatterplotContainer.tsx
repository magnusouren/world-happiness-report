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
  const [continent, setContinent] = useState<string>('Europe');

  useEffect(() => {
    setHoveredCountry(null);
  }, [xColumn, yColumn, year, continent, setHoveredCountry]);

  return (
    <div id="scatterplot-container">
      <div id="scatterplot-controls">
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
                {key}
              </option>
            ))}
        </select>
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
                {key}
              </option>
            ))}
        </select>
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
