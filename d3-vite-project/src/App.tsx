import { useState } from 'react';
import './App.css';
import { Map } from './components/Map';

import data from './data/data.json';
import { Slider } from './components/Slider';
import { CountryTable } from './components/CountryTable';
import { ScatterPlot } from './components/ScatterPlot';
import { ScatterPlotContainer } from './components/ScatterplotContainer';
import { Legends } from './components/Legends';
import { Country, SelectedCountry } from './types';

function App() {
  // Global values
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountry[]>(
    []
  );
  const [hoveredCountry, setHoveredCountry] = useState<
    Country['countryName'] | ''
  >('');
  const [year, setYear] = useState<number>(2023);
  const countryData = data as unknown as Country[];

  // Local values
  const [zoom, setZoom] = useState<number>(90);
  const [amountOfScatterplots, setAmountOfScatterplots] = useState(3);

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
        <p>
          <strong>Normalized values:</strong> The normalized values is a result
          of using z-score normalization (Gaussian scaling).
        </p>
      </div>
      <section id="slider-container">
        <h2>Year</h2>
        <Slider year={year} setYear={setYear} />
      </section>
      <section>
        <Map
          countries={countryData.filter((c) => c.year == year)}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          hoveredCountry={hoveredCountry}
          setHoveredCountry={setHoveredCountry}
        />
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
