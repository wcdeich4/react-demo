import { MathCanvas2D } from "../models/MathCanvas2D";
import { I2DEquation } from "./I2DEquation";

export abstract class MathDrawableBaseClass implements I2DEquation {
    public abstract evaluateAtX(x: number): number;
    /**equation color */
    public color: string | CanvasGradient | CanvasPattern = 'white';
    /**derivative 1 color, will not be drawn if undefined */
    public derivative1Color?: string | CanvasGradient | CanvasPattern | undefined;
    /**derivative 2 color, will not be drawn if undefined */
    public derivative2Color?: string | CanvasGradient | CanvasPattern | undefined;
    /** drawing step size for x axis */
    public xIncrement: number = 0.1;
    /** Delta x for numerical difference approximation. Remember javascript minimum delta 0.00000000000000001 */
    public derivativeDelta: number = 0.001;

    /**
     * constructor
     * @param {number} incrementForDrawing drawing step size for x axis
     * @param {string | CanvasGradient | CanvasPattern | undefined} equationColor function color
     * @param {string | CanvasGradient | CanvasPattern | undefined} derivative1Color derivative 1 color, will not be drawn if undefined
     * @param {string | CanvasGradient | CanvasPattern | undefined} derivative2Color derivative 2 color, will not be drawn if undefined
     */
    constructor(incrementForDrawing?: number,
        equationColor?: string | CanvasGradient | CanvasPattern | undefined,
        derivative1Color?: string | CanvasGradient | CanvasPattern | undefined,
        derivative2Color?: string | CanvasGradient | CanvasPattern | undefined,
    ) {
        if (equationColor != null) {
            this.color = equationColor;
        }
        if (derivative1Color != null) {
            this.derivative1Color = derivative1Color;
        }
        if (derivative2Color != null) {
            this.derivative2Color = derivative2Color;
        }
        if (incrementForDrawing != null) {
            this.xIncrement = incrementForDrawing;
        }
    }

    /**
     * numerical first derivative based on https://www.dam.brown.edu/people/alcyew/handouts/numdiff.pdf
     * @param x {number} value of x we want to find the numerical derivative at
     */
    public derivative1AtX(x: number): number {
        //will O(delta^4) approx be too slow?
        const fxMinusDelta = this.evaluateAtX(x - this.derivativeDelta);
        const fxMinus2Delta = this.evaluateAtX(x - 2 * this.derivativeDelta);
        const fxPlusDelta = this.evaluateAtX(x + this.derivativeDelta);
        const fxPlus2Delta = this.evaluateAtX(x + 2 * this.derivativeDelta);
        return (8 * fxPlusDelta - 8 * fxMinusDelta + fxMinus2Delta - fxPlus2Delta) / (12 * this.derivativeDelta);
        /*
                 //O(delta^2) approx
                 const fxMinusDelta = this.evaluateAtX(x - this.derivativeDelta);
                 const fxPlusDelta = this.evaluateAtX(x + this.derivativeDelta);
                 return (fxPlusDelta - fxMinusDelta) / (2*this.derivativeDelta);
        */
    }

    /**
     * numerical second derivative based on https://www.dam.brown.edu/people/alcyew/handouts/numdiff.pdf
     * @param {number} x value of x we want to find the numerical derivative at
     */
    public derivative2AtX(x: number): number {
        //will O(delta^4) approx be too slow?
        const fxPlus2Delta = this.evaluateAtX(x + 2 * this.derivativeDelta);
        const fxPlusDelta = this.evaluateAtX(x + this.derivativeDelta);
        const fxAtX = this.evaluateAtX(x);
        const fxMinusDelta = this.evaluateAtX(x - this.derivativeDelta);
        const fxMinus2Delta = this.evaluateAtX(x - 2 * this.derivativeDelta);
        return (16 * fxPlusDelta - fxPlus2Delta - 30 * fxAtX + 16 * fxMinusDelta - fxMinus2Delta) / (12 * this.derivativeDelta * this.derivativeDelta);
    }

    /**
     * Get the summation of the series from start to end with delta increments on the x-axis
     * @param {number} start x-axis start
     * @param {number} end x-axis stop
     * @param {number} delta skip btween values
     * @returns {number} sum
     */
    public getSummationOfSeriesXAxis( start: number, end: number, delta: number ): number 
    {
        let sum = 0;
        for (let i = start; i <= end; i += delta)
        {
            sum += this.evaluateAtX(i);
        }
        return sum;
    }

    /**
     * draw this equaion on a MathCanvas
     * @param {MathCanvas2D} mathCanvas canvas to draw on
     */
    public draw(mathCanvas: MathCanvas2D): void {
        this.drawFunction(mathCanvas, this.evaluateAtX.bind(this), this.color);
        if (this.derivative1Color) {
            this.drawFunction(mathCanvas, this.derivative1AtX.bind(this), this.derivative1Color);
        }
        if (this.derivative2Color) {
            this.drawFunction(mathCanvas, this.derivative2AtX.bind(this), this.derivative2Color);
        }
    }

    /**
     * draw 2D function on a MathCanvas
     * @param {MathCanvas2D} mathCanvas 
     * @param {(X: number) => number} functionToEvaluate 
     * @param {string | CanvasGradient | CanvasPattern | undefined} color 
     */
    protected drawFunction(mathCanvas: MathCanvas2D, functionToEvaluate: (X: number) => number, color: string | CanvasGradient | CanvasPattern | undefined): void {
        let point1IsCalculatable: boolean = false;
        let point2IsCalculatable: boolean = false;
        let x1: number, y1: number, x2: number, y2: number;

        x1 = mathCanvas.getRange().xMin;
        try {
            y1 = functionToEvaluate(x1);
            point1IsCalculatable = !isNaN(y1);
        }
        catch (error) {
            point1IsCalculatable = false;
        }

        // console.log("point1IsCalculatable = " + point1IsCalculatable);
        // console.log('isNaN(y1) = ' + isNaN(y1));
        while (x1 <= mathCanvas.getRange().xMax) {
            x2 = x1 + this.xIncrement;
            try {
                y2 = functionToEvaluate(x2);
                point2IsCalculatable = !isNaN(y2);
            }
            catch (error) {
                point2IsCalculatable = false;
            }

            if (point1IsCalculatable && point2IsCalculatable) {
                mathCanvas.drawLineWorld2D(x1, y1, x2, y2, color);
            }
            else if (point1IsCalculatable && !point2IsCalculatable) {
                //we need to draw this lone point so it is not lost
                mathCanvas.drawPixelWorld2DCoordinates(x1, y1, color);
            }
            //other cases automatically handled on next loop

            //update for next loop
            point1IsCalculatable = point2IsCalculatable;
            x1 = x2;
            y1 = y2;
        }

        //special case for last point
        //at the very end we cannot expect the point to be handled on next loop
        if (!point1IsCalculatable && point2IsCalculatable) {
            mathCanvas.drawPixelWorld2DCoordinates(x2, y2, color);
        }
    }

}