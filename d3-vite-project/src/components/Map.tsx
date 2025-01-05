/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { geoPath, geoMercator } from 'd3-geo';

export interface DataRow {
  countryName: string;
  year: number;
  lifeLadder: number;
  gpdPerCapita: number;
  socialSupport: number;
  healthyLifeExpectancyAtBirth: number;
  freedomToMakeLifeChoices: number;
  generosity: number;
  corruption: number;
  positiveAffect: number;
  negativeAffect: number;
  continent: string;
  gpdPerCapita_z: number;
  socialSupport_z: number;
  healthyLifeExpectancyAtBirth_z: number;
  freedomToMakeLifeChoices_z: number;
  generosity_z: number;
  corruption_z: number;
  pca1: number;
  pca2: number;
}

interface MapProps {
  hoveredCountry: string | null;
  countries: DataRow[];
  geoJsonData: any; // GeoJSON data for countries
  selectedCountries: { countryName: string; year: number }[];
  setHoveredCountry: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCountries: React.Dispatch<
    React.SetStateAction<{ countryName: string; year: number }[]>
  >;
}

export const Map: React.FC<MapProps> = ({
  countries,
  hoveredCountry,
  geoJsonData,
  setHoveredCountry,
  setSelectedCountries,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!geoJsonData || !countries) return;

    // Opprett SVG
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;

    // Lag en projeksjon og geopath
    const projection = geoMercator().fitSize([width, height], geoJsonData);
    const pathGenerator = geoPath().projection(projection);

    // Fargefunksjon ved bruk av d3 skala fra rød til blå
    const colorScale = d3.scaleSequential(d3.interpolateRdBu).domain([0, 10]);

    const getColor = (value: number) => {
      return colorScale(value);
    };

    // Tegn kartet
    svg
      .selectAll('path')
      .data(geoJsonData.features)
      .join('path')
      .attr('d', (d: any) => pathGenerator(d) ?? '')
      .attr('fill', (d: any) => {
        if (d.properties.name === hoveredCountry) return 'orange';
        const countryData = countries.find(
          (c) => c.countryName === d.properties.name
        );

        return countryData ? getColor(countryData.lifeLadder) : '#ccc';
      })
      .attr('stroke', '#333')
      .attr('stroke-width', 0.6)
      .attr('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget).attr('fill', 'orange');
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
        const countryData: DataRow | undefined = countries.find(
          (c) => c.countryName === d.properties.name
        );
        return countryData
          ? `${countryData.countryName}: ${countryData.lifeLadder.toString()}`
          : `${d.properties.name}: No data`;
      });

    // Gradient-legende
    const gradientSvg = d3.select(gradientRef.current);
    const gradientWidth = 800;
    const gradientHeight = 20;

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
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', gradientHeight)
      .attr('fill', (d) => colorScale(gradientScale(d)));

    // Legg til tekst for verdier
    gradientSvg
      .selectAll('text')
      .data([0, 5, 10])
      .join('text')
      .attr('x', (d) => (d / 10) * gradientWidth)
      .attr('y', gradientHeight + 15)
      .attr('text-anchor', (d) =>
        d === 0 ? 'start' : d === 10 ? 'end' : 'middle'
      )
      .attr('font-size', 12)
      .attr('fill', 'black')
      .text((d) => d);
  }, [countries, geoJsonData, setSelectedCountries]);

  return (
    <div>
      <svg ref={svgRef} width="800" height="500"></svg>
      <div>
        <p>Life Ladder: Happiness score from 0 to 10</p>
        <svg ref={gradientRef} width="800" height="50"></svg>
      </div>
    </div>
  );
};
