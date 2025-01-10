import * as d3 from 'd3';

export const prettierColumnName = (key: string) => {
  // Check if the key contains '_z'
  if (key.includes('_z')) {
    // Remove '_z' and add 'Normalized' at the start of the string
    key = `normalized ${key.replace('_z', '')}`;
  }

  // Convert camelCase to space-separated and capitalize the first letter
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

/**
 * Get color for the continent, color-values are based on the d3.schemeCategory10
 *
 * @param continent
 * @returns color for the continent
 */
export const getPlotColor = (continent: string) => {
  const colorScale = d3
    .scaleOrdinal(d3.schemeSet1)
    .domain([
      'Africa',
      'Asia',
      'Europe',
      'North America',
      'Oceania',
      'Hovered',
      'South America',
    ]);

  return colorScale(continent);
};
