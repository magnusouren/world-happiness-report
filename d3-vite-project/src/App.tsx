import { useEffect, useState } from 'react';
import './App.css';
import { DataRow, Map } from './components/Map';
import geoJsonData from './data/custom.geo.json'; // GeoJSON-fil

import data from './data/data.json';
import { Slider } from './components/Slider';
import { CountryTable } from './components/CountryTable';
import { ScatterPlot } from './components/ScatterPlot';
import { ScatterPlotContainer } from './components/ScatterplotContainer';
import { Legends } from './components/Legends';

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
  const [zoom, setZoom] = useState<number>(90);
  const [amountOfScatterplots, setAmountOfScatterplots] = useState(3);

  useEffect(() => {
    // Last GeoJSON-data hvis det ikke allerede er importert som modul
    setGeoJson(geoJsonData);
  }, []);

  const countryData: DataRow[] = data as unknown as DataRow[];

  return (
    <main style={{ zoom: `${zoom}%` }}>
      <header>
        <h1>World Happiness Analysis</h1>
        <div id="zoom-container">
          <button onClick={() => setZoom(zoom + 10)}>Zoom in</button>
          <button onClick={() => setZoom(100)}>Reset zoom</button>
          <button onClick={() => setZoom(zoom - 10)}>Zoom out</button>
        </div>
      </header>
      <div id="description">
        <h2>About</h2>
        <p>
          This is a visualization of the World Happiness Report data updated in
          2024. The data contains information about the happiness of people in
          different countries, and is based on factors such as GDP, social
          support, and healthy life expectancy.
        </p>
        <p>
          The map shows the countries colored by their Happiness score, while
          the scatter plot shows a PCA (Principal Component Analysis) of the
          numerical values in the dataset. Below the map and scatter plot, there
          is a possibility to compare different countries within a year and/or a
          continent with parameters by choice.
        </p>
        <p>
          For deeper analysis of a country, you can click on the country in the
          map or the scatter plots to add them to the table below. Click again
          for removal. The table shows the data for the selected countries for
          the selected year.
        </p>
      </div>
      <section id="slider-container">
        <h2>Year</h2>
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
      <section>
        <Legends />
      </section>
      <section id="scatterplot-buttons">
        <button
          onClick={() => setAmountOfScatterplots(amountOfScatterplots + 1)}
        >
          Add scatterplot
        </button>
        <button
          onClick={() => setAmountOfScatterplots(amountOfScatterplots - 1)}
        >
          Remove scatterplot
        </button>
      </section>
      <section id="scatterplots">
        {Array.from({ length: amountOfScatterplots }).map((_, i) => (
          <ScatterPlotContainer
            key={i}
            data={countryData}
            size="small"
            hoveredCountry={hoveredCountry}
            selectedCountries={selectedCountries}
            setHoveredCountry={setHoveredCountry}
            setSelectedCountries={setSelectedCountries}
          />
        ))}
      </section>

      {amountOfScatterplots > 6 && (
        <section>
          <Legends />
        </section>
      )}
      <section id="table-container">
        <CountryTable countries={selectedCountries} data={countryData} />
      </section>
      <section>
        <ScatterPlotContainer
          data={countryData}
          size="large"
          hoveredCountry={hoveredCountry}
          selectedCountries={selectedCountries}
          setHoveredCountry={setHoveredCountry}
          setSelectedCountries={setSelectedCountries}
        />
      </section>
      <Legends />
      <footer>
        <p>
          Data from{' '}
          <a href="https://www.kaggle.com/datasets/jainaru/world-happiness-report-2024-yearly-updated">
            World Happiness Report- 2024 by Jaina on Kaggle.com
          </a>
        </p>
        <p>Magnus Tomter Ouren - 2025</p>
      </footer>
    </main>
  );
}

export default App;
