import { IMathDrawable } from "../models/IMathDrawable";
import { I2DEquation } from "./I2DEquation";
import { I3DEquation } from "./I3DEquation";
import { MathDrawableBaseClass } from "./MathDrawableBaseClass";

export class JavascriptStringEvaluator extends MathDrawableBaseClass implements I2DEquation, I3DEquation, IMathDrawable
{
    public functionToEvaluate: string;

    constructor(equationText?: string, colorToDraw?: string | CanvasGradient | CanvasPattern, incrementForDrawing?: number)
    {
        super(colorToDraw, incrementForDrawing);
        if (equationText != null)
        {
            this.functionToEvaluate = equationText;
        }

    }


    evaluateAtX( X: number): number 
    {
        let expression = this.functionToEvaluate.replace(/X/g, X.toString());
       // console.log(expression);
        return eval(expression);
    }

    evaluateAtXY( X: number, Y: number): number 
    {
        let expression = this.functionToEvaluate.replace(/X/g, X.toString());
        expression = this.functionToEvaluate.replace(/Y/g, Y.toString());
       // console.log(expression);
        return eval(expression);
    }



}