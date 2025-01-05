import { useEffect, useState } from 'react';
import './App.css';
import { DataRow, Map } from './components/Map';
import geoJsonData from './data/custom.geo.json'; // GeoJSON-fil

import data from './data/data.json';
import { Slider } from './components/Slider';
import { CountryTable } from './components/CountryTable';
import { ScatterPlot } from './components/ScatterPlot';

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
              hoveredCountry={hoveredCountry}
              setHoveredCountry={setHoveredCountry}
            />
          ) : (
            <p>Laster kart...</p>
          )}
        </div>
        <div>
          <ScatterPlot
            data={countryData.filter((c) => c.year == year)}
            hoveredCountry={hoveredCountry}
            setHoveredCountry={setHoveredCountry}
          />
        </div>
      </section>
      <section>
        <div>
          <h2>Selected countries</h2>
          <CountryTable countries={selectedCountries} data={countryData} />
          <ul>
            <li>
              <strong>Country name</strong>: Name of the country.
            </li>
            <li>
              <strong>Regional indicator</strong>: Region to which the country
              belongs.
            </li>
            <li>
              <strong>Ladder score</strong>: The happiness score for each
              country, based on responses to the Cantril Ladder question that
              asks respondents to think of a ladder, with the best possible life
              for them being a 10, and the worst possible life being a 0.
            </li>
            <li>
              <strong>Log GDP per capita</strong>: The natural logarithm of the
              country's GDP per capita, adjusted for purchasing power parity
              (PPP) to account for differences in the cost of living between
              countries.
            </li>
            <li>
              <strong>Social support</strong>: The national average of binary
              responses (either 0 or 1 representing No/Yes) to the question
              about having relatives or friends to count on in times of trouble.
            </li>
            <li>
              <strong>Healthy life expectancy</strong>: The average number of
              years a newborn infant would live in good health, based on
              mortality rates and life expectancy at different ages.
            </li>
            <li>
              <strong>Freedom to make life choices</strong>: The national
              average of responses to the question about satisfaction with
              freedom to choose what to do with one's life.
            </li>
            <li>
              <strong>Generosity</strong>: The residual of regressing the
              national average of responses to the question about donating money
              to charity on GDP per capita.
            </li>
            <li>
              <strong>Perceptions of corruption</strong>: The national average
              of survey responses to questions about the perceived extent of
              corruption in the government and businesses.
            </li>
            <li>
              <strong>Dystopia + residual</strong>: Dystopia is an imaginary
              country with the world’s least-happy people, used as a benchmark
              for comparison. The dystopia + residual score is a combination of
              the Dystopia score and the unexplained residual for each country,
              ensuring that the combined score is always positive. Each of these
              factors contributes to the overall happiness score, but the
              Dystopia + residual value is a benchmark that ensures no country
              has a lower score than the hypothetical Dystopia.
            </li>
            <li>
              <strong>Positive affect</strong>: The national average of
              responses to questions about positive emotions experienced
              yesterday.
            </li>
            <li>
              <strong>Negative affect</strong>: The national average of
              responses to questions about negative emotions experienced
              yesterday.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;
