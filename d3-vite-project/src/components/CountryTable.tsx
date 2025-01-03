import { DataRow } from './Map';

interface CountryTableProps {
  countries: string[];
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
          <th>Life ladder</th>
          <th>GDP</th>
          <th>Social support</th>
          <th>Healthy life expectancy at birth</th>
          <th>Freedom to make life choices</th>
          <th>Generosity</th>
          <th>Perceptions of corruption</th>
          <th>Positive affect</th>
          <th>Negative affect</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((country) => (
          <tr key={country}>
            <td>{country}</td>
            <td>{data.find((d) => d.countryName === country)?.lifeLadder}</td>
            <td>
              {data.find((d) => d.countryName === country)?.logGdpPerCapita}
            </td>
            <td>
              {data.find((d) => d.countryName === country)?.socialSupport}
            </td>
            <td>
              {
                data.find((d) => d.countryName === country)
                  ?.healthyLifeExpectancyAtBirth
              }
            </td>
            <td>
              {
                data.find((d) => d.countryName === country)
                  ?.freedomToMakeLifeChoices
              }
            </td>
            <td>{data.find((d) => d.countryName === country)?.generosity}</td>
            <td>
              {
                data.find((d) => d.countryName === country)
                  ?.perceptionsOfCorruption
              }
            </td>
            <td>
              {data.find((d) => d.countryName === country)?.positiveAffect}
            </td>
            <td>
              {data.find((d) => d.countryName === country)?.negativeAffect}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
