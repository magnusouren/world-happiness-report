export const Descriptions: React.FC = () => {
  return (
    <ul>
      <li>
        <strong>Country</strong>: Name of the country.
      </li>
      <li>
        <strong>Year</strong>: The year the data row represents.
      </li>
      <li>
        <strong>Continent</strong>: Continent the country is located in.
      </li>
      <li>
        <strong>Life Ladder score</strong>: The happiness score for each
        country, based on responses to the Cantril Ladder question that asks
        respondents to think of a ladder, with the best possible life for them
        being a 10, and the worst possible life being a 0.
      </li>
      <li>
        <strong>GDP</strong>: The natural logarithm of the country's GDP per
        capita, adjusted for purchasing power parity (PPP) to account for
        differences in the cost of living between countries.
      </li>
      <li>
        <strong>Social support</strong>: The national average of binary
        responses (either 0 or 1 representing No/Yes) to the question about
        having relatives or friends to count on in times of trouble.
      </li>
      <li>
        <strong>Healthy life expectancy</strong>: The average number of years a
        newborn infant would live in good health, based on mortality rates and
        life expectancy at different ages.
      </li>
      <li>
        <strong>Freedom</strong>: The national average of responses to the
        question about satisfaction with freedom to choose what to do with one's
        life.
      </li>
      <li>
        <strong>Generosity</strong>: The residual of regressing the national
        average of responses to the question about donating money to charity on
        GDP per capita.
      </li>
      <li>
        <strong>Corruption</strong>: The national average of survey responses to
        questions about the perceived extent of corruption in the government and
        businesses.
      </li>
      <li>
        <strong>Positive affect</strong>: The national average of responses to
        questions about positive emotions experienced yesterday. 0 to 1, where 1
        is the highest positive affect.
      </li>
      <li>
        <strong>Negative affect</strong>: The national average of responses to
        questions about negative emotions experienced yesterday. 0 to 1, where 1
        is the highest negative affect.
      </li>
    </ul>
  );
};
