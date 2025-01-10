import { useEffect, useState } from 'react';
import { DataRow } from './Map';
import { ScatterPlot } from './ScatterPlot';
import './ScatterPlotContainer.css';
import { prettierColumnName } from '../utils';

interface ScatterPlotContainerProps {
  data: DataRow[];
  size?: 'small' | 'medium' | 'large';
  hoveredCountry: string | null;
  selectedCountries: { countryName: string; year: number }[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCountries: React.Dispatch<
    React.SetStateAction<{ countryName: string; year: number }[]>
  >;
}

export const ScatterPlotContainer: React.FC<ScatterPlotContainerProps> = ({
  data,
  size = 'medium',
  hoveredCountry,
  selectedCountries,
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const [xColumn, setXColumn] = useState<keyof DataRow>('pca1');
  const [yColumn, setYColumn] = useState<keyof DataRow>('pca2');
  const [year, setYear] = useState<number>(2023);
  const [continent, setContinent] = useState<string>('All');
  const [linearRegression, setLinearRegression] = useState<boolean>(false);

  useEffect(() => {
    setHoveredCountry(null);
  }, [xColumn, yColumn, year, continent, setHoveredCountry]);

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
                  {prettierColumnName(key)}
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
                  {prettierColumnName(key)}
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
            {Array.from(new Set(data.map((d) => d.year)))
              .sort((a, b) => a - b)
              .map((year) => (
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
            <option key="All" value="All">
              All
            </option>
            {Array.from(new Set(data.map((d) => d.continent)))
              .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
              .map((continent) => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'start', width: '50px' }}>
          <label>Lin. Reg.</label>
          <input
            type="checkbox"
            checked={linearRegression}
            onChange={(e) => setLinearRegression(e.target.checked)}
            style={{ height: '14px', width: '14px' }}
          />
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
        showRegressionLine={linearRegression}
        size={size}
        setSelectedCountries={setSelectedCountries}
        setHoveredCountry={setHoveredCountry}
        selectedCountries={selectedCountries}
      />
    </div>
  );
};
