import type { ComponentType } from "react";
import { BenchPressCalculator } from "./BenchPressCalculator";
import { BodyRecompCalculator } from "./BodyRecompCalculator";
import { BulkingCalorieCalculator } from "./BulkingCalorieCalculator";
import { DotsCalculator } from "./DotsCalculator";
import { FfmiCalculator } from "./FfmiCalculator";
import { LeanBodyMassCalculator } from "./LeanBodyMassCalculator";
import { MacroCalculator } from "./MacroCalculator";
import { MaxLiftCalculator } from "./MaxLiftCalculator";
import { PercentChart } from "./PercentChart";
import { HowStrongAmITool } from "./StandardsChecker";
import { OneRepMaxCalculator } from "./OneRepMaxCalculator";
import { PlateCalculator } from "./PlateCalculator";
import { ProteinIntakeCalculator } from "./ProteinIntakeCalculator";
import { RpeCalculator } from "./RpeCalculator";

/** Tool page slug → its interactive calculator (each is a client component taking no props). */
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  "1rm-calculator": OneRepMaxCalculator,
  "bench-press-calculator": BenchPressCalculator,
  "rpe-calculator": RpeCalculator,
  "protein-intake-calculator": ProteinIntakeCalculator,
  "ffmi-calculator": FfmiCalculator,
  "dots-calculator": DotsCalculator,
  "bulking-calorie-calculator": BulkingCalorieCalculator,
  "lean-body-mass-calculator": LeanBodyMassCalculator,
  "body-recomposition-calculator": BodyRecompCalculator,
  "plate-calculator": PlateCalculator,
  "squat-deadlift-max-calculator": MaxLiftCalculator,
  "1rm-percentage-chart": PercentChart,
  "how-strong-am-i": HowStrongAmITool,
  "muscle-gain-macro-calculator": MacroCalculator,
};

export {
  BenchPressCalculator,
  BodyRecompCalculator,
  BulkingCalorieCalculator,
  DotsCalculator,
  FfmiCalculator,
  HowStrongAmITool,
  LeanBodyMassCalculator,
  MacroCalculator,
  MaxLiftCalculator,
  OneRepMaxCalculator,
  PercentChart,
  PlateCalculator,
  ProteinIntakeCalculator,
  RpeCalculator,
};
