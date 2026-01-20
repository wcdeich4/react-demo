import { MathCanvas2D } from "../models/MathCanvas2D";

export abstract class MathDrawableBaseClass
{
    public abstract evaluateAtX( x: number): number ;
    public color: string | CanvasGradient | CanvasPattern;
    public xIncrement: number = 0.1;

    constructor(equationColor?: string | CanvasGradient | CanvasPattern, incrementForDrawing?: number)
    {
        if (equationColor != null)
        {
            this.color = equationColor;
        }
        if (incrementForDrawing != null)
        {
            this.xIncrement = incrementForDrawing;
        }
    }

    /**
     * draw 2D equaion on a MathCanvas
     * @param mathCanvas {MathCanvas2D} canvas to draw on
     */
    public draw(mathCanvas: MathCanvas2D): void 
    {
        let point1IsCalculatable: boolean = false;
        let point2IsCalculatable: boolean = false;
        let x1, y1, x2, y2: number ;
        
        x1 = mathCanvas.getRange().xMin;
        try
        {
            y1 = this.evaluateAtX(x1);
            point1IsCalculatable = !isNaN(y1);
        }
        catch (error)
        {
            point1IsCalculatable = false;
        }

       // console.log("point1IsCalculatable = " + point1IsCalculatable);
       // console.log('isNaN(y1) = ' + isNaN(y1));
        while(x1 <= mathCanvas.getRange().xMax)
        {
            x2 = x1 + this.xIncrement;
            try
            {
                y2 = this.evaluateAtX(x2);
                point2IsCalculatable = !isNaN(y2);
            }
            catch(error)
            {
                point2IsCalculatable = false;
            }

            if (point1IsCalculatable && point2IsCalculatable)
            {
                mathCanvas.drawLineWorld2D(x1, y1, x2, y2, this.color);
            }
            else if (point1IsCalculatable && !point2IsCalculatable)
            {
                //we need to draw this lone point so it is not lost
                mathCanvas.drawPixelWorld2DCoordinates(x1, y1, this.color);
            }
            //other cases automatically handled on next loop

            //update for next loop
            point1IsCalculatable = point2IsCalculatable;
            x1 = x2;
            y1 = y2;
        }

        //special case for last point
        //at the very end we cannot expect the point to be handled on next loop
        if (!point1IsCalculatable && point2IsCalculatable)
        {
            mathCanvas.drawPixelWorld2DCoordinates(x2, y2, this.color);
        }
    }
}