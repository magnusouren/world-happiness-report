import './CountryTable.css';
import { useState } from 'react';
import { Descriptions } from './Descriptions';
import { Country, SelectedCountry } from '../types';

interface CountryTableProps {
  countries: SelectedCountry[];
  data: Country[];
}

export const CountryTable: React.FC<CountryTableProps> = ({
  data,
  countries,
}) => {
  const [showDetails, setShowDetails] = useState(true);

  // Coloumn values and amount of decimals
  const numericalColumns: [keyof Country, number][] = [
    ['lifeLadder', 2],
    ['gpdPerCapita', 2],
    ['socialSupport', 2],
    ['healthyLifeExpectancyAtBirth', 0],
    ['freedomToMakeLifeChoices', 2],
    ['generosity', 2],
    ['corruption', 2],
    ['positiveAffect', 2],
    ['negativeAffect', 2],
  ];

  if (countries.length === 0) {
    return (
      <div className="country-container">
        <h2>Selected Countries</h2>
        <p>
          No country selected, click on a country from a scatterplot or the map
          above.
        </p>
      </div>
    );
  }

  return (
    <div className="country-container">
      <h2>Selected Countries</h2>
      <p>
        Table showing the data for the selected countries for the selected year.
      </p>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Year</th>
            <th>Continent</th>
            <th>Life Ladder Score</th>
            <th>GDP</th>
            <th>Social Support</th>
            <th>Healthy Life Expectancy</th>
            <th>Freedom</th>
            <th>Generosity</th>
            <th>Corruption</th>
            <th>Positive Affect</th>
            <th>Negative Affect</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((d) =>
              countries.some(
                (c) => c.countryName === d.countryName && c.year === d.year
              )
            )
            .map((d) => (
              <tr key={d.countryName}>
                <td>{d.countryName}</td>
                <td>{d.year}</td>
                <td>{d.continent}</td>

                {numericalColumns.map(([key, decimals]) => (
                  <td key={key}>{(d[key] as number).toFixed(decimals)}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="details-button"
      >
        {showDetails ? 'Hide Descriptions' : 'Show Descriptions'}
      </button>
      {showDetails && <Descriptions />}
    </div>
  );
};
