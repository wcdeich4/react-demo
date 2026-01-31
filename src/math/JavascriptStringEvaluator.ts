import { IMathDrawable } from "../models/IMathDrawable";
import { I2DEquation } from "./I2DEquation";
import { I3DEquation } from "./I3DEquation";
import { MathDrawableBaseClass } from "./MathDrawableBaseClass";

export class JavascriptStringEvaluator extends MathDrawableBaseClass implements I2DEquation, I3DEquation, IMathDrawable
{
    public functionToEvaluate: string;

    /**
     * 
     * @param {string} equationText a one dimentional function in terms of X in Javascript, e.g. "Math.sin(X)"
     * @param {number} incrementForDrawing X step
     * @param {string} functionColor color to draw the function
     * @param {string} derivative1Color color for first derivative (not drawn if undefined)
     * @param {string} derivative2Color color for second derivative (not drawn if undefined)
     * @param {string} integralColor color for integral (not drawn if undefined)
     */
    constructor(equationText?: string, 
                incrementForDrawing?: number, 
                functionColor?: string | CanvasGradient | CanvasPattern,
                derivative1Color?: string | CanvasGradient | CanvasPattern | undefined,
                derivative2Color?: string | CanvasGradient | CanvasPattern | undefined,
                integralColor?: string | CanvasGradient | CanvasPattern | undefined,
                )
    {
        super(incrementForDrawing, functionColor, derivative1Color, derivative2Color, integralColor);
        if (equationText != null)
        {
            this.functionToEvaluate = equationText;
        }
    }


    public evaluateAtX( X: number): number 
    {
        let expression = this.functionToEvaluate.replace(/X/g, X.toString());
       // console.log(expression);
        return eval(expression);
    }

    public evaluateAtXY( X: number, Y: number): number 
    {
        let expression = this.functionToEvaluate.replace(/X/g, X.toString());
        expression = this.functionToEvaluate.replace(/Y/g, Y.toString());
       // console.log(expression);
        return eval(expression);
    }





}