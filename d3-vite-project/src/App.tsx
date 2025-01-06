import { useEffect, useState } from 'react';
import './App.css';
import { DataRow, Map } from './components/Map';
import geoJsonData from './data/custom.geo.json'; // GeoJSON-fil

import data from './data/data.json';
import { Slider } from './components/Slider';
import { CountryTable } from './components/CountryTable';
import { ScatterPlot } from './components/ScatterPlot';
import { ScatterPlotContainer } from './components/ScatterplotContainer';

function App() {
  const [geoJson, setGeoJson] = useState<unknown>(null);
  const [selectedCountries, setSelectedCountries] = useState<
    {
      countryName: string;
      year: number;
    }[]
  >([]);
  const [year, setYear] = useState<number>(2023);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    // Last GeoJSON-data hvis det ikke allerede er importert som modul
    setGeoJson(geoJsonData);
  }, []);

  const countryData: DataRow[] = data as unknown as DataRow[];

  return (
    <main>
      <h1>World Happiness Analysis</h1>
      <section>
        <Slider year={year} setYear={setYear} />
      </section>
      <section>
        {geoJson ? (
          <Map
            countries={countryData.filter((c) => c.year == year)}
            geoJsonData={geoJson}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            hoveredCountry={hoveredCountry}
            setHoveredCountry={setHoveredCountry}
          />
        ) : (
          <p>Laster kart...</p>
        )}

        <ScatterPlot
          data={countryData.filter((c) => c.year == year)}
          hoveredCountry={hoveredCountry}
          xColumn={'pca1'}
          yColumn={'pca2'}
          setSelectedCountries={setSelectedCountries}
          setHoveredCountry={setHoveredCountry}
          selectedCountries={selectedCountries}
        />
      </section>
      <section id="scatterplots">
        <ScatterPlotContainer
          data={countryData}
          hoveredCountry={hoveredCountry}
          selectedCountries={selectedCountries}
          setHoveredCountry={setHoveredCountry}
          setSelectedCountries={setSelectedCountries}
        />
        <ScatterPlotContainer
          data={countryData}
          hoveredCountry={hoveredCountry}
          selectedCountries={selectedCountries}
          setHoveredCountry={setHoveredCountry}
          setSelectedCountries={setSelectedCountries}
        />
        <ScatterPlotContainer
          data={countryData}
          hoveredCountry={hoveredCountry}
          selectedCountries={selectedCountries}
          setHoveredCountry={setHoveredCountry}
          setSelectedCountries={setSelectedCountries}
        />
        <ScatterPlotContainer
          data={countryData}
          hoveredCountry={hoveredCountry}
          selectedCountries={selectedCountries}
          setHoveredCountry={setHoveredCountry}
          setSelectedCountries={setSelectedCountries}
        />
      </section>
      <section>
        <CountryTable countries={selectedCountries} data={countryData} />
      </section>
    </main>
  );
}

export default App;
