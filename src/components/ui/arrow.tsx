import React from "react";

interface ArrowProps {
  length?: number; // length of the entire arrow (stem + head)
  thickness?: number; // stroke width of the stem
  headWidth?: number; // width of the arrowhead base
  headLength?: number; // length of the arrowhead
  color?: string;
  direction?: "right" | "left" | "up" | "down";
  className?: string; // additional class for layout control
}

const Arrow: React.FC<ArrowProps> = ({
  length = 100,
  thickness = 6,
  headWidth = 12,
  headLength = 20,
  color = "black",
  direction = "right",
  className = "",
}) => {
  const shaftLength = length - headLength;

  const isVertical = direction === "up" || direction === "down";
  const svgWidth = isVertical ? Math.max(headWidth, thickness) : length;
  const svgHeight = isVertical ? length : Math.max(headWidth, thickness);

  const rotationMap: Record<NonNullable<ArrowProps["direction"]>, string> = {
    right: "rotate(0deg)",
    left: "rotate(180deg)",
    up: "rotate(-90deg)",
    down: "rotate(90deg)",
  };

  return (
    <svg
      className={className}
      //width={svgWidth}
      //height={svgHeight}
      viewBox={`0 0 ${length} ${Math.max(headWidth, thickness)}`}
      style={{ transform: rotationMap[direction], display: "inline-block", transformOrigin: "center" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <line
        x1="0"
        y1={Math.max(headWidth, thickness) / 2}
        x2={shaftLength}
        y2={Math.max(headWidth, thickness) / 2}
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      />

      {/* Arrowhead */}
      <polygon
        points={`
          ${shaftLength},${(Math.max(headWidth, thickness) - headWidth) / 2}
          ${length},${Math.max(headWidth, thickness) / 2}
          ${shaftLength},${(Math.max(headWidth, thickness) + headWidth) / 2}
        `}
        fill={color}
      />
    </svg>
  );
};

export default Arrow;
