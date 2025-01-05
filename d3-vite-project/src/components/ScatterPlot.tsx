import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DataRow } from './Map';

interface ScatterPlotProps {
  data: DataRow[];
  hoveredCountry: string | null;
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  hoveredCountry,
  setHoveredCountry,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Default x and y axes
    const xColumn = 'pca1';
    const yColumn = 'pca2';

    // Fixed domains for axes
    const xDomain: [number, number] = [-5, 5]; // Example fixed range for PCA1
    const yDomain: [number, number] = [-5, 5]; // Example fixed range for PCA2

    // Dimensions
    const width = 600;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Color scale for continents
    const colorScale = d3
      .scaleOrdinal(d3.schemeObservable10)
      .domain(Array.from(new Set(data.map((d) => d.continent))));

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

    svg
      .append('g')
      .attr('transform', `translate(0, ${plotHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', plotWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .text(xColumn);

    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -40)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .text(yColumn);

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
      .style('text-anchor', 'middle')
      .text(xColumn);

    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -40)
      .attr('fill', 'black')
      .style('font-size', '14px')
      .style('text-anchor', 'middle')
      .text(yColumn);

    // Points
    const points = svg
      .selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', (d) => xScale(d[xColumn] as number))
      .attr('cy', (d) => yScale(d[yColumn] as number))
      .attr('r', 5)
      .attr('fill', (d) => colorScale(d.continent));

    // Raise points that match hoveredCountry
    points
      .filter((d) => d.countryName === hoveredCountry)
      .raise()
      .attr('r', 7)
      .attr('fill', 'red');

    points
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('fill', 'red').attr('r', 7).raise();
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
          .text(d.countryName);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill', colorScale(d.continent))
          .attr('r', 5);
        setHoveredCountry(null);
        svg.select('#tooltip').remove();
      });
  }, [data, hoveredCountry, setHoveredCountry]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
