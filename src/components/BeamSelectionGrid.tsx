"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BeamType {
  type: string;
  name: string;
  image: string;
  description: string;
}

interface BeamSelectionGridProps {
  beamTypes?: BeamType[];
  selectedBeamType?: string;
  onSelectBeam?: (beamId: string) => void;
}

const defaultBeamTypes: BeamType[] = [
  {
    type: "i-beam",
    name: "I-Beam",
    image: "/images/beams/i-beam.svg",
    description: "Standards structural beam with I-shaped cross-section",
  },
  {
    type: "rectangular",
    name: "Rectangular",
    image: "/images/beams/rectangular.svg",
    description: "Simple rectangular cross-section beam",
  },
  {
    type: "circular",
    name: "Circular",
    image: "/images/beams/circular.svg",
    description: "Circular cross-section beam or rod",
  },
  {
    type: "hollow-rectangular",
    name: "Hollow Rectangular",
    image: "/images/beams/hollow-rectangular.svg",
    description: "Rectangular tube with hollow cross-section",
  },
  {
    type: "hollow-circular",
    name: "Hollow Circular",
    image: "/images/beams/hollow-circular.svg",
    description: "Circular tube with hollow cross-section",
  },
  {
    type: "t-beam",
    name: "T-Beam",
    image: "/images/beams/t-beam.svg",
    description: "T-shaped cross-section beam",
  },
];

const BeamSelectionGrid: React.FC<BeamSelectionGridProps> = ({
  beamTypes = defaultBeamTypes,
  selectedBeamType = "",
  onSelectBeam = () => {},
}) => {
  const handleBeamSelect = (beamId: string) => {
    onSelectBeam(beamId);
  };

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Select Beam Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {beamTypes.map((beam) => (
          <Card
            key={beam.type}
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              selectedBeamType === beam.type
                ? "border-primary border-2"
                : "border",
            )}
            onClick={() => handleBeamSelect(beam.type)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center p-2">
                  <img
                    src={beam.image}
                    alt={beam.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h3 className="font-medium text-sm">{beam.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {beam.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeamSelectionGrid;
