"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  BeamParameters,
  LoadingParameters,
  CalculationResult,
} from "./BeamCalculator";

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
  return (
    <div className="w-full bg-background rounded-lg border border-border p-4">
      <Card>
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
                    {result.maxStress.toFixed(3)}{" "}
                    <span className="text-sm font-normal">MPa</span>
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Maximum Deflection
                  </h3>
                  <p className="text-2xl font-bold">
                    {result.maxDeflection?.toFixed(2)}{" "}
                    <span className="text-sm font-normal">mm</span>
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Moment of Inertia
                  </h3>
                  <p className="text-2xl font-bold">
                    {result.momentOfInertia.toFixed(2)}{" "}
                    <span className="text-sm font-normal">mm⁴</span>
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Section Modulus
                  </h3>
                  <p className="text-2xl font-bold">
                    {result.sectionModulus.toFixed(2)}{" "}
                    <span className="text-sm font-normal">mm³</span>
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="visual" className="mt-4">
              <div className="flex flex-col items-center">
                <div className="w-full h-64 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                  {/* Visual representation of stress distribution */}
                  <div className="w-3/4 h-32 relative">
                    {beamType === "I-beam" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 h-6 bg-primary/80"></div>
                        <div className="absolute top-6 left-1/3 right-1/3 h-20 bg-primary/60"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-primary/80"></div>

                        {/* Stress gradient overlay */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-red-500/70 via-yellow-500/70 to-red-500/70"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-r from-red-500/70 via-yellow-500/70 to-red-500/70"></div>
                      </>
                    )}

                    {beamType === "Rectangular" && (
                      <>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/70"></div>
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-red-500/70 via-transparent to-red-500/70"></div>
                      </>
                    )}

                    {beamType === "Circular" && (
                      <div className="absolute top-0 left-1/4 right-1/4 bottom-0 rounded-full bg-primary/70 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-red-500/70 via-transparent to-red-500/70"></div>
                      </div>
                    )}
                  </div>

                  {/* Arrows indicating load */}
                  {loadType === "Point Load" && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="h-8 w-4 bg-destructive clip-arrow"></div>
                      <div className="text-xs mt-1">Load</div>
                    </div>
                  )}

                  {loadType === "Distributed Load" && (
                    <div className="absolute top-0 left-0 right-0 flex justify-around">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="h-6 w-2 bg-destructive"></div>
                          <div className="h-2 w-2 bg-destructive rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 text-sm text-center">
                  <p className="font-medium">Stress Distribution Legend</p>
                  <div className="flex justify-center items-center mt-2">
                    <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                    <span className="ml-2 mr-4">High Stress</span>
                    <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                    <span className="ml-2 mr-4">Medium Stress</span>
                    <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                    <span className="ml-2">Low Stress</span>
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
      </Card>

      <style jsx>{`
        .clip-arrow {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
      `}</style>
    </div>
  );
};

export default ResultsDisplay;
