import { ComplexPoint } from "./ComplexPoint";

export interface I2DComplexEquation
{
    color: string | CanvasGradient | CanvasPattern;
    evaluateAtX(c: ComplexPoint): ComplexPoint;
}