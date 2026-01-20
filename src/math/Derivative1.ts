import { DerivativeBaseClass } from "./DerivativeBaseClass";
import { I2DEquation } from "./I2DEquation";

export class Derivative1 extends DerivativeBaseClass implements I2DEquation
{
    constructor(functionToDifferentiate?: I2DEquation, colorToDraw?: string | CanvasGradient | CanvasPattern, deltaX?: number)
    {
        super(functionToDifferentiate, colorToDraw, deltaX);
    }

    /**
     * numerical first derivative based on https://www.dam.brown.edu/people/alcyew/handouts/numdiff.pdf
     * @param fx 
     * @param x {number} value of x we want to find the numerical derivative at
     */
     public evaluateAtX( x: number): number
     {
         
         //will O(delta^4) approx be too slow?
         const fxMinusDelta = this.fx.evaluateAtX(x - this.delta);
         const fxMinus2Delta = this.fx.evaluateAtX(x - 2*this.delta);
         const fxPlusDelta = this.fx.evaluateAtX(x + this.delta);
         const fxPlus2Delta = this.fx.evaluateAtX(x + 2*this.delta);
         return (8*fxPlusDelta - 8*fxMinusDelta + fxMinus2Delta - fxPlus2Delta)/(12*this.delta);
         
/*
         //O(delta^2) approx
         const fxMinusDelta = this.fx.evaluateAtX(x - this.delta);
         const fxPlusDelta = this.fx.evaluateAtX(x + this.delta);
         return (fxPlusDelta - fxMinusDelta) / (2*this.delta);
*/

     }
}