import { DataRow } from './Map';
import './CountryTable.css';
import { useState } from 'react';
import { Descriptions } from './Descriptions';
// import * as d3 from 'd3';

interface CountryTableProps {
  countries: { countryName: string; year: number }[];
  data: DataRow[];
}

export const CountryTable: React.FC<CountryTableProps> = ({
  data,
  countries,
}) => {
  const [showDetails, setShowDetails] = useState(true);

  // const colorValue = (key: keyof DataRow, value: number) => {
  //   const maxValue = Math.max(...data.map((d) => d[key] as number));
  //   const minValue = Math.min(...data.map((d) => d[key] as number));

  //   console.log(key, value, minValue, maxValue);

  //   const scale = d3.scaleLinear().domain([minValue, maxValue]);

  //   // Generate the base color using d3.interpolateRdYlGn
  //   const baseColor = d3.interpolateRdYlGn(scale(value));

  //   // Blend with white to create a brighter version
  //   const brighterColor = d3.interpolateRgb(baseColor, '#ffffff')(0.5); // Adjust the factor (0-1) for brightness
  //   return brighterColor;
  // };

  const numericalColumns: [keyof DataRow, number][] = [
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
      <div>
        <h2>Selected Countries</h2>
        <p>
          No country selected, click on a country from a scatterplot or the map
          above.
        </p>
      </div>
    );
  }

  return (
    <div>
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
                  <td
                    key={key}
                    // style={{
                    //   backgroundColor: colorValue(key, d[key] as number),
                    // }}
                  >
                    {(d[key] as number).toFixed(decimals)}
                  </td>
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
