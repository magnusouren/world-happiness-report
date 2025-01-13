/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { geoPath, geoMercator } from 'd3-geo';

import './Map.css';
import { getPlotColor } from '../utils';
import { Country, SelectedCountry } from '../types';

interface MapProps {
  hoveredCountry: string | null;
  countries: Country[];
  geoJsonData: any; // GeoJSON data for countries
  selectedCountries: SelectedCountry[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountry[]>>;
}

export const Map: React.FC<MapProps> = ({
  countries,
  hoveredCountry,
  geoJsonData,
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 630;
  const height = 600;

  useEffect(() => {
    if (!geoJsonData || !countries) return;

    const svg = d3.select(svgRef.current);

    const projection = geoMercator().fitSize([width, height], geoJsonData);
    const pathGenerator = geoPath().projection(projection);

    // Define a power scale to preprocess the lifeLadder values
    // You can adjust the exponent to control the non-linearity
    const powerScale = d3
      .scalePow()
      .exponent(1) // Change this value to tweak the non-linear transformation
      .domain([1, 8]) // Input range
      .range([0, 1]); // Output range for colorScale

    // Create the color scale (still linear in this step)
    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([0, 1]);

    // Function to get color, applying the power scale first
    const getColor = (value: number) => {
      const transformedValue = powerScale(value); // Apply the non-linear transformation
      return colorScale(transformedValue); // Map the transformed value to a color
    };

    svg
      .selectAll('path')
      .data(geoJsonData.features)
      .join('path')
      .attr('d', (d: any) => pathGenerator(d) ?? '')
      .attr('fill', (d: any) => {
        if (d.properties.name === hoveredCountry)
          return getPlotColor('Hovered');
        const countryData = countries.find(
          (c) => c.countryName === d.properties.name
        );

        return countryData ? getColor(countryData.lifeLadder) : '#ccc';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.6)
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget).attr('fill', getPlotColor('Hovered'));
        setHoveredCountry(d.properties.name);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('fill', (d: any) => {
          setHoveredCountry(null);
          const countryData = countries.find(
            (c) => c.countryName === d.properties.name
          );
          return countryData ? getColor(countryData.lifeLadder) : '#ccc';
        });
      })
      .on('click', (event, d: any) => {
        const countryData = countries.find(
          (c) => c.countryName === d.properties.name
        );
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
      })
      .append('title')
      .text((d: any) => {
        const countryData: Country | undefined = countries.find(
          (c) => c.countryName === d.properties.name
        );
        return countryData
          ? `${countryData.countryName}: ${countryData.lifeLadder.toString()}`
          : `${d.properties.name}: No data`;
      });

    // Gradient-bar for lifeLadder
    const gradientSvg = d3.select(svgRef.current);
    const gradientWidth = width;
    const gradientHeight = 15;

    const gradientScale = d3
      .scaleLinear()
      .domain([0, gradientWidth])
      .range([0, 10]); // Matcher verdiene til lifeLadder

    const gradientData = d3.range(gradientWidth);

    gradientSvg
      .selectAll('rect')
      .data(gradientData)
      .join('rect')
      .attr('x', (d) => d)
      .attr('y', height - 50)
      .attr('width', 1)
      .attr('height', gradientHeight)
      .attr('fill', (d) => getColor(gradientScale(d)));

    // Legg til tekst for verdier
    gradientSvg
      .selectAll('text')
      .data([0, 5, 10])
      .join('text')
      .attr('x', (d) => (typeof d === 'number' ? (d / 10) * gradientWidth : 0))
      .attr('y', height - 55)
      .attr('text-anchor', (d) =>
        typeof d === 'number'
          ? d === 0
            ? 'start'
            : d === 10
            ? 'end'
            : 'middle'
          : 'start'
      )
      .attr('font-size', 12)
      .attr('fill', 'black')
      .text((d) => (typeof d === 'number' ? d : d));

    // Legg til tekst for "Life Ladder Score"
    gradientSvg
      .append('text')
      .attr('x', 0)
      .attr('y', height - 70)
      .attr('text-anchor', 'start')
      .attr('font-size', 12)
      .attr('fill', 'black')
      .text('Life Ladder Score');
  }, [
    countries,
    geoJsonData,
    hoveredCountry,
    setHoveredCountry,
    setSelectedCountries,
  ]);

  return (
    <div id="map-container">
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};
