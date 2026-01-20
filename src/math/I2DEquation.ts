import { ISingleColor } from "../models/ISingleColor";

export interface I2DEquation extends ISingleColor
{
    evaluateAtX(X: number): number;
}