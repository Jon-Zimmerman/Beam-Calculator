import React from "react";
import BeamCalculator from "@/components/BeamCalculator";
import DeflectionHome from "./deflection-home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-6 md:p-12">
      <div className="w-full max-w-7xl space-y-8">
        <header className="space-y-4 text-center">
          {/* <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent h-[80px]">
            Beam Deflection Calculator
          </h1> */}
                  <DeflectionHome></DeflectionHome>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select from basic types or FRC specific beam types. Input additional
            parameters to calculate the bending strength of various beam cross
            sections under different loading conditions.
          </p>
        </header>
        {/* <div className="bg-card rounded-xl shadow-lg border border-border p-6 md:p-8"> */}
          <BeamCalculator />
        {/* </div> */}
      </div>
      <footer className="text-center text-sm text-muted-foreground pt-8 pb-4 bottom-1.5 static">
        <p>
          Not to be used for safety critical applications. No guarentees are
          made to calculation accuracy. <br></br> © {new Date().getFullYear()}{" "}
          Beam Deflection Calculator. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
