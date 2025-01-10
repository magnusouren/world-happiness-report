import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DataRow } from './Map';
import { getPlotColor, prettierColumnName } from '../utils';

interface ScatterPlotProps {
  data: DataRow[];
  hoveredCountry: string | null;
  xColumn: keyof DataRow;
  yColumn: keyof DataRow;
  dynamicAxis?: boolean;
  showRegressionLine?: boolean;
  size?: 'small' | 'medium' | 'large';
  selectedCountries: { countryName: string; year: number }[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCountries: React.Dispatch<
    React.SetStateAction<{ countryName: string; year: number }[]>
  >;
}

const sizeMap = {
  small: { width: 300, height: 300 },
  medium: { width: 500, height: 500 },
  large: { width: 700, height: 700 },
};

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  hoveredCountry,
  dynamicAxis = false,
  selectedCountries,
  xColumn,
  yColumn,
  showRegressionLine = false,
  size = 'medium',
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    let xDomain: [number, number];
    let yDomain: [number, number];

    if (dynamicAxis) {
      // Dynamic domains for axes
      xDomain = d3.extent(data, (d) => d[xColumn] as number) as [
        number,
        number
      ];
      yDomain = d3.extent(data, (d) => d[yColumn] as number) as [
        number,
        number
      ];
      xDomain = [
        Math.min(0, xDomain[0] - 0.1 * (xDomain[1] - xDomain[0])),
        xDomain[1] + 0.1 * (xDomain[1] - xDomain[0]),
      ];
      yDomain = [
        Math.min(0, yDomain[0] - 0.1 * (yDomain[1] - yDomain[0])),
        yDomain[1] + 0.1 * (yDomain[1] - yDomain[0]),
      ];
    } else {
      // Fixed domains for axes
      xDomain = [-6, 5]; // Example fixed range for PCA1
      yDomain = [-6, 5]; // Example fixed range for PCA2
    }

    // Dimensions
    const width = sizeMap[size].width;
    const height = sizeMap[size].height;
    const margin = { top: 10, right: 10, bottom: 50, left: 50 };

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    const getPointSize = () => {
      if (size === 'small') return 3;
      if (size === 'medium') return 4;
      return 5;
    };

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleLinear().domain(xDomain).range([0, plotWidth]);

    const yScale = d3.scaleLinear().domain(yDomain).range([plotHeight, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Points
    svg
      .append('g')
      .attr('transform', `translate(0, ${plotHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', plotWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style(
        'font-family',
        'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
      )
      .style('text-anchor', 'middle')
      .text(prettierColumnName(xColumn));

    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -40)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style(
        'font-family',
        'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
      )
      .style('text-anchor', 'middle')
      .text(prettierColumnName(yColumn));

    // Points
    const points = svg
      .selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d[xColumn] as number))
      .attr('cy', (d) => yScale(d[yColumn] as number))
      .attr('r', getPointSize())
      .attr('fill', (d) => getPlotColor(d.continent));

    // Raise points that match hoveredCountry
    points
      .filter((d) => d.countryName === hoveredCountry)
      .raise()
      .attr('r', getPointSize() + 2)
      .attr('fill', getPlotColor('Hovered'))
      .style('filter', 'drop-shadow(0px 0px 2px #000000)');

    points
      .filter((d) =>
        selectedCountries.some(
          (c) => c.countryName === d.countryName && c.year === d.year
        )
      )
      .attr('stroke', 'yellow')
      .attr('stroke-width', getPointSize() - 1)
      .style('filter', 'drop-shadow(0px 0px 1px #000000)')
      .raise();

    points
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill', getPlotColor('Hovered'))
          .attr('r', getPointSize() + 1)
          .attr('cursor', 'pointer')
          .raise();
        setHoveredCountry(d.countryName);

        // Add text element next to the pointer
        svg
          .append('text')
          .attr('id', 'tooltip')
          .attr('x', xScale(d[xColumn] as number) + 10)
          .attr('y', yScale(d[yColumn] as number) - 10)
          .attr('fill', 'black')
          .style('font-size', '14px')
          .style('text-anchor', 'middle')
          .style('font-weight', '500')
          .style(
            'font-family',
            'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
          )
          .text(d.countryName);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill', getPlotColor(d.continent))
          .attr('r', getPointSize());
        setHoveredCountry(null);
        svg.select('#tooltip').remove();
      });

    points.on('click', (event, d) => {
      const countryData = data.find((c) => c.countryName === d.countryName);
      if (countryData?.countryName) {
        d3.select(event.currentTarget).attr('stroke-width', 2);
        setSelectedCountries(
          (prev: { countryName: string; year: number }[]) => {
            if (
              prev.some(
                (c) =>
                  c.countryName === countryData?.countryName &&
                  c.year === countryData?.year
              )
            ) {
              return prev.filter(
                (c) =>
                  c.countryName !== countryData?.countryName ||
                  c.year !== countryData?.year
              );
            }
            return [
              ...prev,
              {
                countryName: countryData?.countryName,
                year: countryData?.year,
              },
            ];
          }
        );
      }
    });

    // Calculate linear regression line
    const regression = (
      data: DataRow[],
      xColumn: keyof DataRow,
      yColumn: keyof DataRow
    ) => {
      const xMean = d3.mean(data, (d) => d[xColumn] as number) ?? 0;
      const yMean = d3.mean(data, (d) => d[yColumn] as number) ?? 0;

      let numerator = 0;
      let denominator = 0;

      data.forEach((d) => {
        const x = d[xColumn] as number;
        const y = d[yColumn] as number;
        numerator += (x - xMean) * (y - yMean);
        denominator += (x - xMean) ** 2;
      });

      const slope = numerator / denominator;
      const intercept = yMean - slope * xMean;

      return { slope, intercept };
    };

    const { slope, intercept } = regression(data, xColumn, yColumn);

    // Add regression line
    svg
      .append('line')
      .attr('x1', xScale(xDomain[0]))
      .attr('y1', yScale(intercept + slope * xDomain[0]))
      .attr('x2', xScale(xDomain[1]))
      .attr('y2', yScale(intercept + slope * xDomain[1]))
      .attr('stroke', 'black')
      .attr('stroke-width', showRegressionLine ? 1 : 0)
      .attr('stroke-dasharray', '4,4');

    svg.on('mouseout', () => {
      setHoveredCountry(null);
      svg.select('#tooltip').remove();
    });
  }, [
    data,
    showRegressionLine,
    dynamicAxis,
    hoveredCountry,
    selectedCountries,
    setHoveredCountry,
    setSelectedCountries,
    size,
    xColumn,
    yColumn,
  ]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
