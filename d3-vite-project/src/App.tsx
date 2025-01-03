import { useEffect, useState } from 'react';
import './App.css';
import { DataRow, Map } from './components/Map';
import geoJsonData from './data/custom.geo.json'; // GeoJSON-fil

import data from './data.json';
import { Slider } from './components/Slider';
import { CountryTable } from './components/CountryTable';

function App() {
  const [geoJson, setGeoJson] = useState<unknown>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [year, setYear] = useState<number>(2023);

  useEffect(() => {
    // Last GeoJSON-data hvis det ikke allerede er importert som modul
    setGeoJson(geoJsonData);
  }, []);

  const countryData: DataRow[] = data as unknown as DataRow[];

  return (
    <div>
      <h1>World Happiness Analysis</h1>
      <section>
        <div>
          <Slider year={year} setYear={setYear} />
          {geoJson ? (
            <Map
              countries={countryData.filter((c) => c.year == year)}
              geoJsonData={geoJson}
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          ) : (
            <p>Laster kart...</p>
          )}
        </div>
        <div>
          <h2>Selected countries</h2>
          <CountryTable countries={selectedCountries} data={countryData} />
        </div>
      </section>
    </div>
  );
}

export default App;
