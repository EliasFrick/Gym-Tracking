import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Line as SvgLine,
  Polyline,
  Circle,
  G,
  Path,
} from "react-native-svg";

export interface WeightPoint {
  value: number;
  date: Date;
}

interface WeightLineChartProps {
  data: WeightPoint[];
  height?: number;
  color?: string;
  backgroundColor?: string;
  onPointSelected?: (point: WeightPoint) => void;
  smoothing?: boolean;
  smoothingFactor?: number; // 0..1 typical 0.15 - 0.3
  xScale?: "index" | "time"; // index balances spacing, time uses actual dates
}

/**
 * Lightweight line chart with sharp corners using react-native-svg.
 * - Shows straight segments (no smoothing)
 * - Renders small dots at each data point
 * - Simple horizontal grid rules for readability
 */
export const WeightLineChart: React.FC<WeightLineChartProps> = ({
  data,
  height = 240,
  color = "#F86E51",
  backgroundColor = "#242424",
  onPointSelected,
  smoothing = true,
  smoothingFactor = 0.22,
  xScale = "index",
}) => {
  // Chart padding for axes/labels (labels omitted for now, keep margins for breathing room)
  const paddingLeft = 16;
  const paddingRight = 8;
  const paddingTop = 12;
  const paddingBottom = 16;

  // Early return for no data
  if (!data || data.length === 0) {
    return <View style={[styles.container, { height, backgroundColor }]} />;
  }

  // Derive min/max values
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Add small padding so the line doesn't stick to the border
  const valuePadding =
    maxValue - minValue === 0 ? 1 : (maxValue - minValue) * 0.1;
  const yMin = minValue - valuePadding;
  const yMax = maxValue + valuePadding;

  // For time-based x scaling
  const dates = data.map((d) => d.date.getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const useIndexForX = xScale === "index" || minDate === maxDate;

  const chartWidth = undefined; // width is taken from parent via flex; coordinates computed at render time using viewWidth

  // Build scaled points string for Polyline once we know width
  const renderChart = (viewWidth: number) => {
    const innerWidth = Math.max(0, viewWidth - paddingLeft - paddingRight);
    const innerHeight = Math.max(0, height - paddingTop - paddingBottom);

    const xFor = (d: WeightPoint, idx: number) => {
      if (useIndexForX) {
        if (data.length === 1) return paddingLeft + innerWidth / 2;
        return paddingLeft + (idx / (data.length - 1)) * innerWidth;
      }
      const t = (d.date.getTime() - minDate) / (maxDate - minDate || 1);
      return paddingLeft + t * innerWidth;
    };

    const yFor = (d: WeightPoint) => {
      const t = (d.value - yMin) / (yMax - yMin || 1);
      // Invert y because SVG y=0 is top
      return paddingTop + (1 - t) * innerHeight;
    };

    const rawPoints = data.map((d, idx) => ({ x: xFor(d, idx), y: yFor(d) }));
    const pointsString = rawPoints.map((p) => `${p.x},${p.y}`).join(" ");

    const pathD = buildPath(rawPoints, smoothing, smoothingFactor);

    const horizontalRules = 4;
    const ruleYs: number[] = Array.from(
      { length: horizontalRules + 1 },
      (_, i) => paddingTop + (i / horizontalRules) * innerHeight
    );

    return (
      <Svg width={viewWidth} height={height}>
        {/* Grid rules */}
        <G>
          {ruleYs.map((y) => (
            <SvgLine
              key={`rule-${Math.round(y * 100)}`}
              x1={paddingLeft}
              y1={y}
              x2={paddingLeft + innerWidth}
              y2={y}
              stroke="#333"
              strokeWidth={1}
            />
          ))}
        </G>

        {/* Curve or straight segments depending on smoothing */}
        {smoothing ? (
          <Path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Polyline
            points={pointsString}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dots at each point */}
        <G>
          {data.map((d, idx) => (
            <Circle
              key={`pt-${d.date.getTime()}-${d.value}`}
              cx={xFor(d, idx)}
              cy={yFor(d)}
              r={2.5}
              fill={color}
              onPress={onPointSelected ? () => onPointSelected(d) : undefined}
            />
          ))}
        </G>
      </Svg>
    );
  };

  return (
    <View
      style={[styles.container, { height, backgroundColor }]}
      onLayout={(e) => {
        // Trigger re-render by updating state? Not needed: we use width via function below
      }}
    >
      <View
        style={styles.svgWrapper}
        onLayout={(_) => {
          /* noop */
        }}
      >
        {/* Use a layout callback to get width via onLayout from parent */}
        <View
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          onLayout={(event) => {
            // Store width in state-less closure by forcing a re-render via key; but simpler: use a small component below
          }}
        />
        <ResponsiveSvg height={height} render={renderChart} />
      </View>
    </View>
  );
};

interface ResponsiveSvgProps {
  height: number;
  render: (width: number) => React.ReactNode;
}

const ResponsiveSvg: React.FC<ResponsiveSvgProps> = ({ height, render }) => {
  const [width, setWidth] = React.useState<number>(0);
  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 ? render(width) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
  },
  svgWrapper: {
    flex: 1,
  },
});

export default WeightLineChart;

// --- Helpers to build a smoothed path ---
type XY = { x: number; y: number };

function line(props: { pointA: XY; pointB: XY }) {
  const { pointA, pointB } = props;
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.hypot(lengthX, lengthY),
    angle: Math.atan2(lengthY, lengthX),
  };
}

function controlPoint(
  current: XY,
  previous: XY | null,
  next: XY | null,
  reverse: boolean,
  smoothing: number
): XY {
  const p = previous ?? current;
  const n = next ?? current;
  const l = line({ pointA: p, pointB: n });
  const angle = l.angle + (reverse ? Math.PI : 0);
  const length = l.length * smoothing;
  return {
    x: current.x + Math.cos(angle) * length,
    y: current.y + Math.sin(angle) * length,
  };
}

function bezierCommand(point: XY, i: number, a: XY[], smoothing: number) {
  const cps = controlPoint(a[i - 1], a[i - 2] || null, point, false, smoothing);
  const cpe = controlPoint(
    point,
    a[i - 1] || null,
    a[i + 1] || null,
    true,
    smoothing
  );
  return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
}

function buildPath(
  points: XY[],
  useSmoothing: boolean,
  smoothing: number
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (!useSmoothing) {
    // Straight polyline path
    const [first, ...rest] = points;
    return (
      `M ${first.x},${first.y} ` + rest.map((p) => `L ${p.x},${p.y}`).join(" ")
    );
  }
  const [first, ...rest] = points;
  return (
    `M ${first.x},${first.y} ` +
    rest.map((p, i) => bezierCommand(p, i + 1, points, smoothing)).join(" ")
  );
}
