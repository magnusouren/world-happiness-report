import { DataRow } from './Map';
import './CountryTable.css';

interface CountryTableProps {
  countries: { countryName: string; year: number }[];
  data: DataRow[];
}

export const CountryTable: React.FC<CountryTableProps> = ({
  data,
  countries,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Continent</th>
          <th>Year</th>
          <th>
            Happiness<br></br>(0-10)
          </th>
          <th>GDP</th>
          <th>Social support</th>
          <th>Expectancy of years with healthy life</th>
          <th>Freedom of choices</th>
          <th>Generosity</th>
          <th>Corruption</th>
          <th>Positive affect</th>
          <th>Negative affect</th>
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
              <td>{d.continent}</td>
              <td>{d.year}</td>
              <td>{d.lifeLadder.toFixed(2)}</td>
              <td>{d.gpdPerCapita.toFixed(2)}</td>
              <td>{d.socialSupport.toFixed(2)}</td>
              <td>{d.healthyLifeExpectancyAtBirth.toFixed(0)}</td>
              <td>{d.freedomToMakeLifeChoices.toFixed(2)}</td>
              <td>{d.generosity.toFixed(2)}</td>
              <td>{d.corruption.toFixed(2)}</td>
              <td>{d.positiveAffect.toFixed(2)}</td>
              <td>{d.negativeAffect.toFixed(2)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
