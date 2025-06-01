"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BeamSelectionGrid from "./BeamSelectionGrid";
import ParameterInputForm from "./ParameterInputForm";
import ResultsDisplay from "./ResultsDisplay";

export const beamList = [
  "i-beam",
  "rectangular",
  "circular",
  "hollow-rectangular",
  "hollow-circular",
  "t-beam",
] as const;

export type BeamList = (typeof beamList)[number];

export type LoadingType = "point" | "distributed" | "moment";
export type MaterialType = "steel" | "aluminum" | "wood" | "custom";
export interface BeamParameters {
  height?: number;
  width?: number;
  length?: number;
  flangeThickness?: number;
  webThickness?: number;
  diameter?: number;
  innerDiameter?: number;
  thickness?: number;
}

export interface LoadingParameters {
  type: LoadingType;
  magnitude: number;
  position?: number;
  startPosition?: number;
  endPosition?: number;
  //length: number;
}

export interface MaterialParameters {
  type: MaterialType;
  elasticModulus: number; // Young's modulus in GPa
  yieldStrength: number; // Yield strength in MPa
  density?: number; //TODO
}

export interface CalculationResult {
  maxStress: number;
  momentOfInertia: number;
  sectionModulus: number;
  maxDeflection?: number;
}

const BeamCalculator = () => {
  const [selectedBeamType, setSelectedBeamType] = useState<BeamList | "i-beam">(
    "i-beam",
  );
  const [beamParameters, setBeamParameters] = useState<BeamParameters>({});
  const [loadingParameters, setLoadingParameters] = useState<LoadingParameters>(
    {
      type: "point",
      magnitude: 10,
      position: 1
    },
  );
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>("aluminum");
  const [materialParameters, setMaterialParameters] = useState<MaterialParameters>(
    {
      type: "steel",
      elasticModulus: 200, // GPa
      yieldStrength: 250, // MPa
    },
  );
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult>({
      maxStress:0,
      momentOfInertia:0,
      sectionModulus:0,
      maxDeflection:0
    });
  const [activeTab, setActiveTab] = useState("beam-selection");
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleBeamSelection = (beamTypeSelect: string) => {
    if (isBeamType(beamTypeSelect)) {
      setSelectedBeamType(beamTypeSelect as BeamList);
      // Automatically switch to parameters tab when beam is selected
      setTimeout(() => {
        setActiveTab("parameters");
      }, 0);
    } else {
      console.error("Invalid beam type:", beamTypeSelect);
    }
  };

  const handleParameterChange = (params: BeamParameters) => {
    console.log("Beam parameters changed:", params);
    setBeamParameters(params);
    //console.log(beamParameters)
  };

  const handleLoadingChange = (params: LoadingParameters) => {
    console.log("Load parameters changed:", params);
    setLoadingParameters(params);
  };
  const handleMaterialChange = (params: MaterialParameters) => {
    console.log("Material parameters changed:", params);  
    setMaterialParameters(params);
  };
  function isBeamType(value: string): value is BeamList {
    return beamList.includes(value as BeamList);
  }

  useEffect(() => {
  // Calculation logic here
  let momentOfInertia = 0;
  let sectionModulus = 0;

  if (
    selectedBeamType === "rectangular" &&
    beamParameters.width &&
    beamParameters.height &&
    beamParameters.length
  ) {
    momentOfInertia =
      (beamParameters.width * Math.pow(beamParameters.height, 3)) / 12;
    sectionModulus = momentOfInertia / (beamParameters.height / 2);
  } else if (selectedBeamType === "circular" && beamParameters.diameter) {
    const radius = beamParameters.diameter / 2;
    momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
    sectionModulus = momentOfInertia / radius;
  } else if (
    selectedBeamType === "i-beam" &&
    beamParameters.height &&
    beamParameters.width &&
    beamParameters.webThickness &&
    beamParameters.flangeThickness
  ) {
    const h = beamParameters.height;
    const b = beamParameters.width;
    const tw = beamParameters.webThickness;
    const tf = beamParameters.flangeThickness;
    momentOfInertia =
      (b * Math.pow(h, 3)) / 12 - ((b - tw) * Math.pow(h - 2 * tf, 3)) / 12;
    sectionModulus = momentOfInertia / (h / 2);
  }

  let maxMoment = 0;
  if (
    loadingParameters.type === "point" &&
    loadingParameters.position
  ) {
    maxMoment = loadingParameters.magnitude * loadingParameters.position;
  } else if (loadingParameters.type === "distributed") {
    maxMoment =
      (loadingParameters.magnitude * Math.pow(beamParameters.length as number, 2)) /
      8;
  } else if (loadingParameters.type === "moment") {
    maxMoment = loadingParameters.magnitude;
  }

  const maxStress = sectionModulus > 0 ? (maxMoment / sectionModulus) * 1000000 : 0;
  //maxmoment is in Nm, momemnt of interia is in mm^4. put everything in mm or MPa
  setCalculationResult({
    maxStress,
    momentOfInertia,
    sectionModulus,
    maxDeflection: // d = PL^3/3EI for fixed end point load at end
      (maxMoment *1000 * Math.pow(beamParameters.length as number *1000 as number, 2)) /
      (3 * momentOfInertia  * materialParameters.elasticModulus*1000), // E is in GPa
  });
}, [
  selectedBeamType,
  beamParameters,
  loadingParameters,
  materialParameters,
]);
  return (
    <Card className="w-full max-w-6xl mx-auto bg-background border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Beam Strength Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="beam-selection">Beam Selection</TabsTrigger>
            <TabsTrigger value="parameters" disabled={!selectedBeamType}>
              Parameters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beam-selection" className="space-y-4">
            <Card className="w-full bg-white shadow-md">
              <CardContent>
<BeamSelectionGrid
              selectedBeamType={selectedBeamType as BeamList}
              onSelectBeam={handleBeamSelection}
            />
              </CardContent>

            </Card>
            
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            {selectedBeamType && (
              <ParameterInputForm
                beamType={selectedBeamType}
                beamParameters={beamParameters}
                loadingParameters={loadingParameters}
                materialType={selectedMaterial}
                materialParameters={materialParameters}
                onBeamParametersChange={handleParameterChange}
                onLoadingParametersChange={handleLoadingChange}
                onMaterialParametersChange={handleMaterialChange}
                onCalculate={() => {}}
                resultsRef={resultsRef}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

<div ref={resultsRef}>
<ResultsDisplay
            beamType={selectedBeamType}
            beamParameters={beamParameters}
            loadingParameters={loadingParameters}
            result={calculationResult}
          />
</div>
          
    </Card>
  );
};

export default BeamCalculator;
