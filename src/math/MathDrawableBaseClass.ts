import { MathCanvas2D } from "../models/MathCanvas2D";
import { I2DEquation } from "./I2DEquation";
import { IIntegralApproximationResult } from "./IIntegralApproximationResult";

export abstract class MathDrawableBaseClass implements I2DEquation {
    public abstract evaluateAtX(x: number): number;
    /**equation color */
    public color: string | CanvasGradient | CanvasPattern = 'white';
    /**derivative 1 color, will not be drawn if undefined */
    public derivative1Color?: string | CanvasGradient | CanvasPattern | undefined;
    /**derivative 2 color, will not be drawn if undefined */
    public derivative2Color?: string | CanvasGradient | CanvasPattern | undefined;
    /** integral color, will not be drawn if undefined */
    public integralColor: string | CanvasGradient | CanvasPattern | undefined;
    /** drawing step size for x axis */
    public xIncrement: number = 0.1;
    /** Delta x for derivative & integral approximation. Remember javascript minimum delta 0.00000000000000001 */
    public calculusDelta: number = 0.001;

    /**
     * constructor
     * @param {number} incrementForDrawing drawing step size for x axis
     * @param {string | CanvasGradient | CanvasPattern | undefined} equationColor function color
     * @param {string | CanvasGradient | CanvasPattern | undefined} derivative1Color derivative 1 color, will not be drawn if undefined
     * @param {string | CanvasGradient | CanvasPattern | undefined} derivative2Color derivative 2 color, will not be drawn if undefined
     * @param {string | CanvasGradient | CanvasPattern | undefined} integralColor integration color, will not be drawn if undefined
     */
    constructor(incrementForDrawing?: number,
        equationColor?: string | CanvasGradient | CanvasPattern | undefined,
        derivative1Color?: string | CanvasGradient | CanvasPattern | undefined,
        derivative2Color?: string | CanvasGradient | CanvasPattern | undefined,
        integralColor?: string | CanvasGradient | CanvasPattern | undefined,
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
        if (integralColor != null) {
            this.integralColor = integralColor;
        }
    }

    /**
     * numerical first derivative based on https://www.dam.brown.edu/people/alcyew/handouts/numdiff.pdf
     * @param x {number} value of x we want to find the numerical derivative at
     */
    public derivative1AtX(x: number): number {
        //will O(delta^4) approx be too slow?
        const fxMinusDelta = this.evaluateAtX(x - this.calculusDelta);
        const fxMinus2Delta = this.evaluateAtX(x - 2 * this.calculusDelta);
        const fxPlusDelta = this.evaluateAtX(x + this.calculusDelta);
        const fxPlus2Delta = this.evaluateAtX(x + 2 * this.calculusDelta);
        return (8 * fxPlusDelta - 8 * fxMinusDelta + fxMinus2Delta - fxPlus2Delta) / (12 * this.calculusDelta);
        /*
                 //O(delta^2) approx
                 const fxMinusDelta = this.evaluateAtX(x - this.calculusDelta);
                 const fxPlusDelta = this.evaluateAtX(x + this.calculusDelta);
                 return (fxPlusDelta - fxMinusDelta) / (2*this.calculusDelta);
        */
    }

    /**
     * numerical second derivative based on https://www.dam.brown.edu/people/alcyew/handouts/numdiff.pdf
     * @param {number} x value of x we want to find the numerical derivative at
     */
    public derivative2AtX(x: number): number {
        //will O(delta^4) approx be too slow?
        const fxPlus2Delta = this.evaluateAtX(x + 2 * this.calculusDelta);
        const fxPlusDelta = this.evaluateAtX(x + this.calculusDelta);
        const fxAtX = this.evaluateAtX(x);
        const fxMinusDelta = this.evaluateAtX(x - this.calculusDelta);
        const fxMinus2Delta = this.evaluateAtX(x - 2 * this.calculusDelta);
        return (16 * fxPlusDelta - fxPlus2Delta - 30 * fxAtX + 16 * fxMinusDelta - fxMinus2Delta) / (12 * this.calculusDelta * this.calculusDelta);
    }

    /**
     * Get the summation of the series from start to end with delta increments on the x-axis
     * @param {number} start x-axis start
     * @param {number} end x-axis stop
     * @param {number} delta skip btween values
     * @returns {number} sum
     */
    public getSummationOfSeriesXAxis(start: number, end: number, delta: number): number {
        let sum: number = 0, currentY: number;
        for(let i = start; i <= end; i += delta){
            try{
                currentY = this.evaluateAtX(i);
            }
            catch(error: any){
                currentY = NaN;
            }
            if(!isNaN(currentY)){
                sum += currentY;
            }
        }
        return sum;
    }

    /**
     * Numeric integral approximation using Left Riemann Sum, Right Riemann Sum, Midpoint Riemann Sum, Trapezoidal Rule, and Simpson's Rule
     * @param {number} start beginning of interval
     * @param {number} end end of interval
     * @returns {IIntegralApproximationResult} integral approximation results
     */
    public getIntegral(start: number, end: number): IIntegralApproximationResult {
        const left = this.calculusDelta * this.getSummationOfSeriesXAxis(start, end - this.calculusDelta, this.calculusDelta);
        const right = this.calculusDelta * this.getSummationOfSeriesXAxis(start + this.calculusDelta, end, this.calculusDelta);
        const middle = this.calculusDelta * this.getSummationOfSeriesXAxis(start + this.calculusDelta / 2, end - this.calculusDelta / 2, this.calculusDelta);
        const trapezoidalApproximation = (left + right) / 2;
        const simpsonsApproximation = (2 * middle + trapezoidalApproximation) / 3;
        const result: IIntegralApproximationResult = {
            beginInterval: start,
            endInterval: end,
            numberOfSubintervals: Math.floor((end - start) / this.calculusDelta),
            LeftRectangleSum: left,
            RightRectangleSum: right,
            MidpointRectangleSum: middle,
            TrapezoidalSum: trapezoidalApproximation,
            SimpsonSum: simpsonsApproximation,
        };
        return result;
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
        if (this.integralColor) {
            let xCurrent: number = mathCanvas.getRange()?.xMin;
            while (xCurrent <= mathCanvas.getRange()?.xMax) {
                mathCanvas.drawLineWorld2D(xCurrent, 0, xCurrent, this.evaluateAtX(xCurrent), this.integralColor);
                xCurrent += this.xIncrement;
            }
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