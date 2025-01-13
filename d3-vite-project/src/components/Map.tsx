/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import geoJsonData from '../data/custom.geo.json'; // GeoJSON-fil
import { geoPath, geoMercator } from 'd3-geo';

import { getPlotColor } from '../utils';
import { Country, SelectedCountry } from '../types';

import './Map.css';

interface MapProps {
  hoveredCountry: string;
  countries: Country[];
  selectedCountries: SelectedCountry[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCountries: React.Dispatch<React.SetStateAction<SelectedCountry[]>>;
}

export const Map: React.FC<MapProps> = ({
  countries,
  hoveredCountry,
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const geoJson: any = geoJsonData;
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 630;
  const height = 600;

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const projection = geoMercator().fitSize([width, height], geoJson);
    const pathGenerator = geoPath().projection(projection);

    const powerScale = d3.scalePow().exponent(1).domain([1, 8]).range([0, 1]);
    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([0, 1]);

    // Function to get color, applying the power scale first
    const getColor = (value: number) => colorScale(powerScale(value));

    svg
      .selectAll('path')
      .data(geoJsonData.features)
      .join('path')
      .attr('d', (d: any) => pathGenerator(d) ?? '')
      .attr('fill', (d) => {
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
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('fill', getPlotColor('Hovered'));
        setHoveredCountry(d.properties.name);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('fill', (d: any) => {
          setHoveredCountry('');
          const countryData = countries.find(
            (c) => c.countryName === d.properties.name
          );
          return countryData ? getColor(countryData.lifeLadder) : '#ccc';
        });
      })
      .on('click', (event, d) => {
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
      .text((d) => {
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
      .range([0, 10]);

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

    // Adding "Life Ladder Score" over the scale
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
    geoJson,
    hoveredCountry,
    setHoveredCountry,
    setSelectedCountries,
  ]);

  return (
    <div id="map-container">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};
