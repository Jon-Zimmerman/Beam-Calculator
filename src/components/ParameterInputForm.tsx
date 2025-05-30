"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";

import {
  BeamParameters as BeamParamsType,
  LoadingParameters,
  LoadingType
} from "./BeamCalculator";

interface ParameterInputFormProps {
  beamType?: string;
  beamParameters?: BeamParamsType;
  loadingParameters?: LoadingParameters;
  onBeamParametersChange?: (parameters: BeamParamsType) => void;
  onLoadingParametersChange?: (parameters: LoadingParameters) => void;
  onCalculate?: () => void;
  resultsRef?: React.RefObject<HTMLDivElement>;
}

// Using BeamParameters from BeamCalculator instead

const ParameterInputForm: React.FC<ParameterInputFormProps> = ({
  beamType = "i-beam",
  beamParameters = {},
  loadingParameters: initialLoadingParams = {
    type: "point",
    magnitude: 1000,
    position: 1,
    length: 2,
  },
  onBeamParametersChange = () => {},
  onLoadingParametersChange = () => {},
  onCalculate = () => {},
  resultsRef,
}) => {
  const [dimensions, setDimensions] = useState<Record<string, number>>({});
  const [loadingType, setLoadingType] = useState<string>("point-load");
  const [loadingParameters, setLoadingParameters] = useState<
    Record<string, number>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useImperial, setUseImperial] = useState<boolean>(false);

  // Define dimension fields based on beam type
  const getDimensionFields = () => {
    switch (beamType) {
      case "i-beam":
        return [
          {
            id: "height",
            label: useImperial ? "Height (in)" : "Height (mm)",
            defaultValue: useImperial ? 7.87 : 200,
          },
          {
            id: "width",
            label: useImperial ? "Flange Width (in)" : "Flange Width (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
          {
            id: "flangeThickness",
            label: useImperial
              ? "Flange Thickness (in)"
              : "Flange Thickness (mm)",
            defaultValue: useImperial ? 0.39 : 10,
          },
          {
            id: "webThickness",
            label: useImperial ? "Web Thickness (in)" : "Web Thickness (mm)",
            defaultValue: useImperial ? 0.24 : 6,
          },
        ];
      case "rectangular":
        return [
          {
            id: "height",
            label: useImperial ? "Height (in)" : "Height (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
          {
            id: "width",
            label: useImperial ? "Width (in)" : "Width (mm)",
            defaultValue: useImperial ? 1.97 : 50,
          },
        ];
      case "circular":
        return [
          {
            id: "diameter",
            label: useImperial ? "Diameter (in)" : "Diameter (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
        ];
      case "hollow-rectangular":
        return [
          {
            id: "outerHeight",
            label: useImperial ? "Outer Height (in)" : "Outer Height (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
          {
            id: "outerWidth",
            label: useImperial ? "Outer Width (in)" : "Outer Width (mm)",
            defaultValue: useImperial ? 1.97 : 50,
          },
          {
            id: "thickness",
            label: useImperial ? "Wall Thickness (in)" : "Wall Thickness (mm)",
            defaultValue: useImperial ? 0.2 : 5,
          },
        ];
      case "hollow-circular":
        return [
          {
            id: "outerDiameter",
            label: useImperial ? "Outer Diameter (in)" : "Outer Diameter (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
          {
            id: "thickness",
            label: useImperial ? "Wall Thickness (in)" : "Wall Thickness (mm)",
            defaultValue: useImperial ? 0.2 : 5,
          },
        ];
      default:
        return [
          {
            id: "height",
            label: useImperial ? "Height (in)" : "Height (mm)",
            defaultValue: useImperial ? 3.94 : 100,
          },
          {
            id: "width",
            label: useImperial ? "Width (in)" : "Width (mm)",
            defaultValue: useImperial ? 1.97 : 50,
          },
        ];
    }
  };

  // Define loading parameter fields based on loading type
  const getLoadingFields = () => {
    switch (loadingType) {
      case "point-load":
        return [
          {
            id: "force",
            label: useImperial ? "Force (lbs)" : "Force (N)",
            defaultValue: useImperial ? 2248 : 10000,
          },
          {
            id: "distance",
            label: useImperial
              ? "Distance from Support (in)"
              : "Distance from Support (m)",
            defaultValue: useImperial ? 39.37 : 1,
          },
        ];
      case "distributed-load":
        return [
          {
            id: "loadIntensity",
            label: useImperial
              ? "Load Intensity (lbs/in)"
              : "Load Intensity (N/m)",
            defaultValue: useImperial ? 57 : 5000,
          },
          {
            id: "length",
            label: useImperial ? "Beam Length (in)" : "Beam Length (m)",
            defaultValue: useImperial ? 118 : 3,
          },
        ];
      case "moment":
        return [
          {
            id: "moment",
            label: useImperial ? "Moment (lbs·in)" : "Moment (N·m)",
            defaultValue: useImperial ? 13300 : 15000,
          },
        ];
      default:
        return [
          {
            id: "force",
            label: useImperial ? "Force (lbs)" : "Force (N)",
            defaultValue: useImperial ? 10 : 10,
          },
        ];
    }
  };

  // Initialize default values
  useEffect(() => {
    const dimensionFields = getDimensionFields();
    const initialDimensions: Record<string, number> = {};

    dimensionFields.forEach((field) => {
      initialDimensions[field.id] = field.defaultValue;
    });

    setDimensions(initialDimensions);
  }, [beamType, useImperial]);

  useEffect(() => {
    const loadingFields = getLoadingFields();
    const initialLoadingParams: Record<string, number> = {};

    loadingFields.forEach((field) => {
      initialLoadingParams[field.id] = field.defaultValue;
    });

    setLoadingParameters(initialLoadingParams);
  }, [loadingType, useImperial]);

  //Update parent component when parameters change
  useEffect(() => {
    if (Object.keys(dimensions).length > 0) {
      // Convert imperial to metric if needed before sending to parent
      if (useImperial) {
        const metricDimensions = { ...dimensions };
        // Convert inches to mm (1 inch = 25.4 mm)
        Object.keys(metricDimensions).forEach((key) => {
          metricDimensions[key] = metricDimensions[key] * 25.4;
        });
        onBeamParametersChange(metricDimensions);
      } else {
        onBeamParametersChange(dimensions);
      }
    }
  }, [dimensions, onBeamParametersChange, useImperial]);

  useEffect(() => {
    if (Object.keys(loadingParameters).length > 0) {
      let magnitude =
        loadingParameters.force ||
        loadingParameters.loadIntensity ||
        loadingParameters.moment ||
        0;

      let position = loadingParameters.distance;
      let length = loadingParameters.length || 2;

      // Convert imperial to metric if needed
      if (useImperial) {
        // Convert lbs to N (1 lb = 4.44822 N)
        if (loadingParameters.force) {
          magnitude = magnitude * 4.44822;
        }
        // Convert lb/in to N/m
        else if (loadingParameters.loadIntensity) {
          magnitude = magnitude * 175.127; // 4.44822 N/lb * 39.37 in/m
        }
        // Convert lb·in to N·m
        else if (loadingParameters.moment) {
          magnitude = magnitude * 0.112985; // 1 lb·in = 0.112985 N·m
        }

        // Convert inches to meters
        if (position) position = position / 39.37;
        if (length) length = length / 39.37;
      }

      const loadingParams = {
        type:
          loadingType === "point-load"
            ? "point"
            : loadingType === "distributed-load"
              ? "distributed"
              : "moment" as LoadingType,
        magnitude,
        position,
        length,
      };

      onLoadingParametersChange(loadingParams);
    }
  }, [loadingType, loadingParameters, onLoadingParametersChange, useImperial]);

  //Handle dimension input changes
  const handleDimensionChange = (id: string, value: string) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      setErrors({ ...errors, [id]: "Please enter a valid positive number" });
    } else {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
      setDimensions({ ...dimensions, [id]: numValue });
    }
  };

  // Handle loading parameter input changes
  const handleLoadingParamChange = (id: string, value: string) => {
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      setErrors({ ...errors, [id]: "Please enter a valid positive number" });
    } else {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
      setLoadingParameters({ ...loadingParameters, [id]: numValue });
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Beam Dimensions Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Beam Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Units Toggle */}
              <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md w-[400px]">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="units-toggle">Units:</Label>
                  <span
                    className={`text-sm ${!useImperial ? "font-bold" : ""}`}
                  >
                    Metric
                  </span>
                  <Switch
                    id="units-toggle"
                    checked={useImperial}
                    onCheckedChange={setUseImperial}
                  />
                  <span className={`text-sm ${useImperial ? "font-bold" : ""}`}>
                    Imperial
                  </span>
                </div>
                <div className="text-muted-foreground px] h-[24 text-base">
                  {useImperial ? "inches, pounds" : "mm, newtons"}
                </div>
              </div>
              {getDimensionFields().map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type="number"
                    value={dimensions[field.id] || field.defaultValue}
                    onChange={(e) =>
                      handleDimensionChange(field.id, e.target.value)
                    }
                    className={`w-1/3 ${errors[field.id] ? "border-red-500" : ""}`}
                  />
                  {errors[field.id] && (
                    <p className="text-red-500 text-xs">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Loading Conditions Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Loading Conditions</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loadingType">Loading Type</Label>
                <Select
                  value={loadingType}
                  onValueChange={(value) => setLoadingType(value)}
                >
                  <SelectTrigger id="loadingType" className="w-full">
                    <SelectValue placeholder="Select loading type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="point-load"
                      className="flex items-center"
                    >
                      <div className="flex items-center">
                        <img
                          src="/images/loads/point-load.svg"
                          alt="Point Load"
                          className="w-6 h-6 mr-2"
                        />
                        <span>Point Load</span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="distributed-load"
                      className="flex items-center"
                    >
                      <div className="flex items-center">
                        <img
                          src="/images/loads/distributed-load.svg"
                          alt="Distributed Load"
                          className="w-6 h-6 mr-2"
                        />
                        <span>Distributed Load</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="moment" className="flex items-center">
                      <div className="flex items-center">
                        <img
                          src="/images/loads/moment.svg"
                          alt="Moment"
                          className="w-6 h-6 mr-2"
                        />
                        <span>Moment</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getLoadingFields().map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type="number"
                      value={loadingParameters[field.id] || field.defaultValue}
                      onChange={(e) =>
                        handleLoadingParamChange(field.id, e.target.value)
                      }
                      className={`w-1/3 ${errors[field.id] ? "border-red-500" : ""}`}
                    />
                    {errors[field.id] && (
                      <p className="text-red-500 text-xs">{errors[field.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Properties (optional extension) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Material Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Select defaultValue="steel">
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">Steel</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                    <SelectItem value="wood">Wood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="elasticModulus">Elastic Modulus (GPa)</Label>
                <Input
                  id="elasticModulus"
                  type="number"
                  defaultValue="200"
                  className="w-1/3"
                />
              </div>
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please correct the errors before proceeding.
              </AlertDescription>
            </Alert>
          )}

          {/* Calculate Button */}
          <Button
            className="w-full"
            disabled={Object.keys(errors).length > 0}
            onClick={() => {
              onCalculate();
              // Scroll to results section
              if (resultsRef && resultsRef.current) {
                setTimeout(() => {
                  resultsRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }}
          >
            Calculate Beam Strength
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParameterInputForm;
