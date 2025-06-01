"use client";

import React, { useState, useRef, use, useEffect } from "react";
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
  LoadingParameters as LoadingParamsType,
  LoadingType,
  MaterialParameters as MaterialParamsType,
  MaterialType,
} from "./BeamCalculator";

interface ParameterInputFormProps {
  beamType?: string;
  beamParameters?: BeamParamsType;
  materialType?: string;
  loadingParameters?: LoadingParamsType;
  materialParameters?: MaterialParamsType;
  onBeamParametersChange?: (parameters: BeamParamsType) => void;
  onLoadingParametersChange?: (parameters: LoadingParamsType) => void;
  onMaterialParametersChange?: (parameters: MaterialParamsType) => void;
  onCalculate?: () => void;
  resultsRef?: React.RefObject<HTMLDivElement>;
}

// Using BeamParameters from BeamCalculator instead

const ParameterInputForm: React.FC<ParameterInputFormProps> = ({
  beamType = "i-beam",
  beamParameters = {},
  loadingParameters: initialLoadingParams = {
    type: "point",
    magnitude: 100,
    position: 1,
  },
  materialParameters: MaterialParamsType = {
    type: "aluminum",
    elasticModulus: 200, // TODO Young's modulus in GPa
    yieldStrength: 1, // TODO Yield strength in MPa
    density: 1
  },
  onBeamParametersChange = () => { },
  onLoadingParametersChange = () => { },
  onMaterialParametersChange = () => { },
  onCalculate = () => { },
  resultsRef,
}) => {
  // --- Initialization ---
  const [useImperial, setUseImperial] = useState<boolean>(false);
  const [loadingType, setLoadingType] = useState<string>("point");
  const [materialType, setMaterialType] = useState<string>("steel");
  // Get initial dimension fields and loading fields
  const getDimensionFields = React.useCallback(() => {
    switch (beamType) {
      case "i-beam":
        return [
          {
            id: "height",
            label: useImperial ? "Height (in)" : "Height (mm)",
            defaultValue: useImperial ? 7.87 : 200, //TODO
          },
          {
            id: "width",
            label: useImperial ? "Flange Width (in)" : "Flange Width (mm)",
            defaultValue: useImperial ? 3.94 : 100, //TODO
          },
          {
            id: "flangeThickness",
            label: useImperial
              ? "Flange Thickness (in)"
              : "Flange Thickness (mm)",
            defaultValue: useImperial ? 0.39 : 10, //TODO
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
            defaultValue: useImperial ? 3.94 : 25, //TODO
          },
          {
            id: "width",
            label: useImperial ? "Width (in)" : "Width (mm)",
            defaultValue: useImperial ? 1.97 : 25, //TODO
          },
          {
            id: "length",
            label: useImperial ? "Length (in)" : "Length (m)",
            defaultValue: useImperial ? 36 : 1,//TODO
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
  }, [beamType, useImperial]);

  // Define loading parameter fields based on loading type
  const getLoadingFields = React.useCallback(() => {
    switch (loadingType) {
      case "point":
        return [
          {
            id: "force",
            label: useImperial ? "Force (lbs)" : "Force (N)",
            defaultValue: useImperial ? 100 : 100,
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
  }, [loadingType, useImperial]);

  // Add after getDimensionFields and getLoadingFields
  const getMaterialFields = React.useCallback((materialType: MaterialType) => {
    switch (materialType) {
      case "steel":
        return [
          {
            id: "elasticModulus",
            label: "Elastic Modulus (GPa)",
            type: "number",
            defaultValue: 210, // Steel //TODO
          },
          {
            id: "yieldStrength",
            label: "Yield Strength (MPa)",
            type: "number",
            defaultValue: 250, // Steel
          },
          {
            id: "density",
            label: "Density (kg/m³)",
            type: "number",
            defaultValue: 7850, // Steel
          },
        ];
      case "aluminum":
        return [
          {
            id: "elasticModulus",
            label: "Elastic Modulus (GPa)",
            type: "number",
            defaultValue: 12, // Aluminum //TODO
          },
          {
            id: "yieldStrength",
            label: "Yield Strength (MPa)",
            type: "number",
            defaultValue: 40, // Aluminum  
          },
          {
            id: "density",
            label: "Density (kg/m³)",
            type: "number",
            defaultValue: 600, // Aluminum
          },
        ];
      default:
      case "custom":
        return [
          {
            id: "elasticModulus",
            label: "Elastic Modulus (GPa)",
            type: "number",
            defaultValue: 70, // Aluminum //TODO
          },
          {
            id: "yieldStrength",
            label: "Yield Strength (MPa)",
            type: "number",
            defaultValue: 300, // Aluminum
          },
          {
            id: "density",
            label: "Density (kg/m³)",
            type: "number",
            defaultValue: 2700, // Aluminum
          },
        ];
    }
  }, [materialType, useImperial]);

  const getInitialDimensions = React.useCallback(() => {
    const fields = getDimensionFields();
    const obj: Record<string, string> = {};
    fields.forEach((f) => (obj[f.id] = f.defaultValue as unknown as string));
    return obj;
  }, [getDimensionFields]);

  const getInitialLoading = React.useCallback(() => {
    const fields = getLoadingFields();
    const obj: Record<string, string> = {};
    fields.forEach((f) => (obj[f.id] = f.defaultValue as unknown as string));
    return obj;
  }, [getLoadingFields]);

  const getInitialMaterial = React.useCallback(() => {
    const fields = getMaterialFields("steel");
    const obj: Record<string, string> = {};
    fields.forEach((f) => (obj[f.id] = f.defaultValue as unknown as string));
    return obj;
  }, [getMaterialFields]);

  // --- State ---
  const [dimensions, setDimensions] = useState<Record<string, string>>(getInitialDimensions);
  const [loadingParameters, setLoadingParameters] = useState<Record<string, string>>(getInitialLoading);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [materialParameters, setMaterialParameters] = useState<Record<string, string>>(getInitialMaterial);

  // // --- Avoid loop on first render ---
  const didInitDimensions = useRef(false);
  // const didInitLoading = useRef(false);

  // --- Effects for dimension fields ---
  useEffect(() => {
    const initial = getInitialDimensions();
    // Only update if changed
    if (
      !didInitDimensions.current ||
      Object.keys(initial).some((k) => dimensions[k] !== initial[k])

    ) {
      onBeamParametersChange(initial);
      setDimensions(initial);
      didInitDimensions.current = true;
    }

  }, [beamType]);

  //Handle dimension input changes
  const handleDimensionChange = (id: string, value: string) => {
    const numValue = parseFloat(value as string);

    // Allow empty input for user editing
    console.log("handleDimensionChange", value);
    const newDimensions = { ...dimensions, [id]: value };
    setDimensions(newDimensions);

    if (isNaN(numValue) || numValue < 0) {
      setErrors({ ...errors, [id]: "Please enter a valid positive number" });
    }
    else {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
      //const newDimensions = { ...dimensions, [id]: value };
      //setDimensions(newDimensions);
      // Convert imperial to metric if needed before sending to parent
      var dimensionsMillimeter = { ...dimensions, [id]: numValue };
      if (useImperial) {
        // Return a new object with all values converted from mm to inch
        dimensionsMillimeter = Object.fromEntries(
          Object.entries(newDimensions).map(([key, val]) => [key, parseFloat(val as string) * 25.4])
        );
      }
      onBeamParametersChange(dimensionsMillimeter);
    }
  };

  // Handle loading parameter input changes
  const handleLoadingParamChange = (id: string, value: string) => {
    // Allow empty input for user editing
    const numValue = parseFloat(value);

    const newLoadingParams = { ...loadingParameters, [id]: value === "" ? "" : value };
    setLoadingParameters(newLoadingParams);

    if (value === "") {
      // Allow empty input, clear error
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
      return;
    }

    if (isNaN(numValue) || numValue <= 0) {
      setErrors({ ...errors, [id]: "Please enter a valid positive number" });
    } else {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);

      // Prepare values for parent callback
      let newMagnitude =
        numValue && (id === "force" || id === "loadIntensity" || id === "moment")
          ? numValue
          : (
            newLoadingParams.force ||
            newLoadingParams.loadIntensity ||
            newLoadingParams.moment ||
            0
          );
      newMagnitude = parseFloat(newMagnitude as string);
      let position = id === "distance" ? numValue : newLoadingParams.distance;
      let length = id === "length" ? numValue : newLoadingParams.length || 200;

      // Convert imperial to metric if needed
      if (useImperial) {
        // Convert lbs to N (1 lb = 4.44822 N)
        if (id === "force" || newLoadingParams.force) {
          newMagnitude = newMagnitude * 4.44822;
        }
        // Convert lb/in to N/m
        else if (id === "loadIntensity" || newLoadingParams.loadIntensity) {
          newMagnitude = newMagnitude * 175.127; // 4.44822 N/lb * 39.37 in/m
        }
        // Convert lb·in to N·m
        else if (id === "moment" || newLoadingParams.moment) {
          newMagnitude = newMagnitude * 0.112985; // 1 lb·in = 0.112985 N·m
        }

        // Convert inches to meters
        if (position) position = position as number / 39.37;
        if (length) length = length as number / 39.37;
      }

      const loadingParamsParent = {
        type:
          loadingType === "point"
            ? "point"
            : loadingType === "distributed-load"
              ? "distributed"
              : "moment" as LoadingType,
        magnitude: newMagnitude as number,
        position: position as number,
        length: length as number,
      };

      onLoadingParametersChange(loadingParamsParent);
    }
  };
  const handleUseImperial = (checked: boolean) => {
    setUseImperial(checked);
  };

  // --- Material Property Handler ---
  const handleMaterialPropertyChange = (id: string, value: string | number) => {
    // Allow empty input for user editing
    let parsedValue: string | number = value;
    var newMaterialParams = { ...materialParameters };
    var newMaterialType = materialType;

    if (id === "elasticModulus" || id === "yieldStrength" || id === "density") {
      if (value === "") {
        // Allow empty input, clear error
        newMaterialParams = { ...materialParameters, [id]: value as string };
        setMaterialParameters(newMaterialParams);
        const newErrors = { ...errors };
        delete newErrors[id];
        setErrors(newErrors);
        return;
      }
      parsedValue = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(parsedValue as number) || (parsedValue as number) <= 0) {
        setErrors({ ...errors, [id]: "Please enter a valid positive number" });
        newMaterialParams = { ...materialParameters, [id]: value as string };
        setMaterialParameters(newMaterialParams);
        return;
      } else {
        const newErrors = { ...errors };
        delete newErrors[id];
        setErrors(newErrors);
      }
      newMaterialParams = { ...materialParameters, [id]: parsedValue as unknown as string };
    }
    else {
      const fields = getMaterialFields(parsedValue as MaterialType);
      const obj: Record<string, string> = {};
      fields.forEach((f) => (obj[f.id] = f.defaultValue as unknown as string));
      newMaterialParams = obj;
      newMaterialType = parsedValue as string;
    }

    setMaterialParameters(newMaterialParams);
    const materialParamsParent = {
      type: newMaterialType as MaterialType,
      elasticModulus: newMaterialParams.elasticModulus as unknown as number,
      yieldStrength: newMaterialParams.yieldStrength as unknown as number,
      density: newMaterialParams.density as unknown as number,
    };
    onMaterialParametersChange(materialParamsParent);
  };

  const handleCalculate = () => {

    //console.log(dimensions);
    onBeamParametersChange(dimensions);
    var newLoadingParameters = { ...loadingParameters };
    var newLoadingType = loadingType;
    const loadingParamsParent = {
      type: newLoadingType as LoadingType,
      magnitude: newLoadingParameters.force as unknown as number,
      position: newLoadingParameters.distance as unknown as number,
      length: newLoadingParameters.length as unknown as number,
    };
    onLoadingParametersChange(loadingParamsParent);

    var newMaterialParams = { ...materialParameters };
    var newMaterialType = materialType;
    const materialParamsParent = {
      type: newMaterialType as MaterialType,
      elasticModulus: newMaterialParams.elasticModulus as unknown as number,
      yieldStrength: newMaterialParams.yieldStrength as unknown as number,
      density: newMaterialParams.density as unknown as number,
    };
    onMaterialParametersChange(materialParamsParent);
    onCalculate();
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent>
        <div className="w-full bg-background p-4 rounded-lg">
          {/* Beam Dimensions Section */}

           <h2 className="text-xl font-semibold mb-4">Beam Dimensions</h2>
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
                    onCheckedChange={handleUseImperial}
                  />
                  <span className={`text-sm ${useImperial ? "font-bold" : ""}`}>
                    Imperial
                  </span>
                </div>
                <div className="text-muted-foreground px] h-[24 text-base">
                  {useImperial ? "in, lbs" : "mm, N"}
                </div>
              </div>
              {getDimensionFields().map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type="number"
                    value={dimensions[field.id] ?? ""}
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
                      value="point"
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
                      value={loadingParameters[field.id] ?? ""}
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

          {/* Material Properties (dynamic fields) */}
          <div>
            <h3 className="text-lg font-medium mb-4">Material Properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dynamically render material fields */}

              <Select
                value={materialType}
                onValueChange={(value) => {
                  setMaterialType(value);
                  handleMaterialPropertyChange("material", value);
                }}
              >
                <SelectTrigger id="materialType" className="w-full">
                  <SelectValue placeholder={"Select material type"} />
                </SelectTrigger>
                <SelectContent >
                  <SelectItem
                    value="steel"
                    className="flex items-center"
                  ><span>Steel</span></SelectItem>
                  <SelectItem
                    value="aluminum"
                    className="flex items-center"
                  ><span>Aluminum</span></SelectItem><SelectItem
                    value="custom"
                    className="flex items-center"
                  ><span>Custom</span></SelectItem>
                </SelectContent>
              </Select>

              {getMaterialFields(materialType as MaterialType).map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>

                  <Input
                    id={field.id}
                    type={field.type}
                    value={materialParameters[field.id] ?? field.defaultValue}
                    onChange={(e) =>
                      handleMaterialPropertyChange(field.id, e.target.value)
                    }
                    className={`w-1/3 ${errors[field.id] ? "border-red-500" : ""}`}
                    disabled={materialType !== "custom"}
                  />

                  {errors[field.id] && (
                    <p className="text-red-500 text-xs">{errors[field.id]}</p>
                  )}
                </div>
              ))}
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
              handleCalculate();
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
