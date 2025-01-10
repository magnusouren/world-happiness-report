import { useRef } from 'react';
import { DataRow } from './Map';

interface LineChartProps {
  data: DataRow[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  console.log(data);

  return (
    <div id="line-chart">
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <g className="lines" />
        <g className="dots" />
      </svg>
    </div>
  );
};
