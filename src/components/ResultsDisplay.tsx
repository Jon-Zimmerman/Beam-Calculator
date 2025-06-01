"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BeamParameters,
  LoadingParameters,
  CalculationResult,
} from "./BeamCalculator";
import Arrow from "./ui/arrow";

interface ResultsDisplayProps {
  result?: CalculationResult;
  beamType?: string;
  loadType?: string;
  beamParameters?: BeamParameters;
  loadingParameters?: LoadingParameters;
}

const ResultsDisplay = ({
  result = {
    maxStress: 150.5,
    maxDeflection: 2.75,
    momentOfInertia: 1250000,
    sectionModulus: 125000,
  },
  beamType = "I-beam",
  loadType = "Point Load",
  beamParameters,
  loadingParameters,
}: ResultsDisplayProps) => {
  // Helper to format large numbers in scientific notation
  const formatLargeNumber = (val: number | undefined, digits = 3) => {
    if (typeof val === "number" && Math.abs(val) >= 1000) {
      return val.toExponential(digits);
    }
    if (typeof val === "number") {
      return val.toFixed(digits);
    }
    return val;
  };

  return (
    <div>

      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Calculation Results: {beamType} under {loadType}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="numerical" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="numerical">Numerical Results</TabsTrigger>
            <TabsTrigger value="visual">Stress Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="numerical" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Maximum Stress
                </h3>
                <p className="text-2xl font-bold">
                  {formatLargeNumber(result.maxStress, 1)}{" "}
                  <span className="text-sm font-normal">MPa</span>
                </p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Maximum Deflection
                </h3>
                <p className="text-2xl font-bold">
                  {formatLargeNumber(result.maxDeflection, 2)}{" "}
                  <span className="text-sm font-normal">mm</span>
                </p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Moment of Inertia
                </h3>
                <p className="text-2xl font-bold">
                  {formatLargeNumber(result.momentOfInertia, 2)}{" "}
                  <span className="text-sm font-normal">mm⁴</span>
                </p>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Section Modulus
                </h3>
                <p className="text-2xl font-bold">
                  {formatLargeNumber(result.sectionModulus, 2)}{" "}
                  <span className="text-sm font-normal">mm³</span>
                </p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="visual" className="mt-4">

            <div className="flex flex-col items-center align-middle">
              <div className="w-full h-64 bg-muted rounded-md flex flex-col items-center justify-center relative overflow-hidden align-middle">
                {/* <div className="w-3/4 flex flex-row items-start relative mt-2"></div> */}
                <div className="w-3/4 flex right-3/4 flex-row mt-2">
<div className="flex-1"></div>


                  {/* Arrows indicating load - moved to right side */}
                  {loadType === "Point Load" && (

                    <div className="right-3/4">

                      <div className="text-xs mb-3">Load</div>
                      <Arrow length={50} headWidth={20} color="black" direction="down" className="mb-2" />
                    </div>

                  )}

                  {loadType === "Distributed Load" && (
                    <div
                      className="absolute right-[12.5%] top-1/2  items-center"
                      style={{ transform: "translate(50%, -116%)" }}
                    >
                      <div className="text-xs mb-1">Load</div>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="h-8 w-2 bg-black"></div>
                          <div className="h-2 w-2 bg-black rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Stress distribution: horizontal rectangle with red-yellow-green gradient */}
                <div className="w-3/4 h-16 rounded-md border border-gray-600 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 relative flex items-center" id="stress-bar">
                  {/* Fixed wall support SVG (cross-hatching) */}
                  <div style={{ width: 20, height: "100%", position: "absolute", left: "-20px", top: -20 }}>
                    <svg width={20} height="100%" viewBox="0 0 20 64" style={{ display: "block", height: "90px" }}>
                      {/* Wall (thick vertical line) */}
                      <rect x="12" y="0" width="20" height="90" fill="#222" />
                      {/* Cross-hatching lines (flipped to face left) */}
                      <line x1="12" y1="8" x2="0" y2="0" stroke="#222" strokeWidth="2"/>
                      <line x1="12" y1="20" x2="0" y2="12" stroke="#222" strokeWidth="2"/>
                      <line x1="12" y1="32" x2="0" y2="24" stroke="#222" strokeWidth="2"/>
                      <line x1="12" y1="44" x2="0" y2="36" stroke="#222" strokeWidth="2"/>
                      <line x1="12" y1="56" x2="0" y2="48" stroke="#222" strokeWidth="2"/>
                      <line x1="12" y1="68" x2="0" y2="60" stroke="#222" strokeWidth="2"/>
                    </svg>
                  </div>
                  {/* The actual stress bar fills the rest */}
                  <div className="flex-1 h-full"></div>
                </div>
                {/* Line and label below the rectangle, aligned to left edge */}
                <div className="w-3/4 flex flex-row items-start relative mt-2">
                  <div className="flex flex-col items-center" style={{ width: 0 }}>
                    {/* Vertical line */}
                    <div className="w-0 h-8 border-l-2 border-black"></div>
                    {/* Label box */}
                    <div className="mt-1 px-2 py-1 bg-white border border-gray-400 rounded shadow text-xs font-semibold text-gray-800 whitespace-nowrap">
                      {formatLargeNumber(result.maxStress, 1)} MPa
                    </div>
                  </div>
                  {/* The rest of the bar is empty to fill space */}
                  <div className="flex-1"></div>


                </div>

              </div>

              <div className="mt-4 text-sm text-center">
                <p className="font-medium">Stress Distribution Legend</p>
                <div className="flex justify-center items-center mt-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span className="ml-2 mr-4">High Stress (Left)</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                  <span className="ml-2 mr-4">Medium Stress (Center)</span>
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="ml-2">Low Stress (Right)</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Note:</strong> These calculations are based on standard
            beam theory and assume:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Linear elastic material behavior</li>
            <li>Small deflections relative to beam dimensions</li>
            <li>No stress concentrations at supports or load points</li>
          </ul>
        </div>
      </CardContent>

      {/* <style jsx>{`
        .clip-arrow {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
      `}</style> */}
    </div>
  );
};

export default ResultsDisplay;
