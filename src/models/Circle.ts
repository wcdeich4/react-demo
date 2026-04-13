import { Matrix } from "../math/Matrix";
import { Point3D } from "../math/Point3D";
import { IMathDrawable } from "./IMathDrawable";
import { ISingleColor } from "./ISingleColor";
import { Light } from "./Light";
import { MathCanvas2D } from "./MathCanvas2D";

export class Circle extends Point3D implements ISingleColor, IMathDrawable
{
    public radius: number;
    public color: string | CanvasGradient | CanvasPattern;
    constructor(x?: number, y?: number, z?: number, color: string | CanvasGradient | CanvasPattern = 'white', radius: number = 1)
    {
        super(x,y,z);
        this.color = color;
        this.radius = radius;
    }

    public draw(mathCanvas: MathCanvas2D, transformMatrix?: Matrix, inverseTransposedMatrix?: Matrix, lightingArray?: Array<Light>, recalculateCenter?: boolean, recalculateColor?: boolean): void
    {
        if (mathCanvas)
        {
            const perspectiePoint = transformMatrix.multiplyByPoint3DOnRight(this);
            mathCanvas.drawCircleWorld2DCoordinates(perspectiePoint.x, perspectiePoint.y, this.radius, this.color);
        }
    }
}