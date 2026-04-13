import { Matrix } from "../math/Matrix";
import { Light } from "./Light";
import { MathCanvas2D } from "./MathCanvas2D";

export interface IMathDrawable
{
    draw(mathCanvas: MathCanvas2D, transformMatrix?: Matrix, inverseTransposedMatrix?: Matrix, lightingArray?: Array<Light>, recalculateCenter?: boolean, recalculateColor?: boolean): void
}