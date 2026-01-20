import { I2DEquation } from "./I2DEquation";
import { MathDrawableBaseClass } from "./MathDrawableBaseClass";

export abstract class DerivativeBaseClass extends MathDrawableBaseClass
{
    constructor(functionToDifferentiate?: I2DEquation, colorToDraw?: string | CanvasGradient | CanvasPattern, deltaX?: number, incrementForDrawing?: number)
    {
        super(colorToDraw, incrementForDrawing);
        if (functionToDifferentiate != null)
        {
            this.fx = functionToDifferentiate;
        }
        if (deltaX != null)
        {
            this.delta = deltaX;
        }
    }

    /**
     * delta x for numerical difference approximation
     * remember javascript minimum delta 0.00000000000000001
     */
    public delta: number = 0.001;

    /**
     * {I2DEquation} function we want to get a derivative value for
     */
    public fx: I2DEquation;

}