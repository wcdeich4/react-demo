import { ScreenRangeConverter2D } from "../math/ScreenRangeConverter2D";
import { Vector } from "../math/Vector";
import { MathCanvas2D } from "./MathCanvas2D";
import { Fractile } from "./Fractile";

export class SirpinskiTriangleFractile extends Fractile
{
    public color: string | CanvasGradient | CanvasPattern;
    public recursionDepthLimit: number = 7;
    private seedPoint1: Vector ;
    private seedPoint2: Vector ;
    private seedPoint3: Vector ;

    constructor(range?: ScreenRangeConverter2D)
    {
        super();
        this.color = 'red';
        if (range == null)
        {
          range = ScreenRangeConverter2D.Standard();
        }
        this.range = range;
        this.seedPoint1 = new Vector([range.xMin, range.yMin]);
        this.seedPoint2 = new Vector([0, range.yMax]);
        this.seedPoint3 = new Vector([range.xMax, range.yMin]);
        this.calculated = true;

      }

    public process(): void
    {
      //this.processTriangles(0, 0);
    }

    public processTriangles(mathCanvas: MathCanvas2D, vertex1: Vector, vertex2: Vector, vertex3: Vector, depth: number ): void
    {
      mathCanvas.drawTriangleOutlineWorld2D(vertex1.elements[0], vertex1.elements[1], vertex2.elements[0], vertex2.elements[1], vertex3.elements[0], vertex3.elements[1], this.color);

      if (this.recursionDepthLimit > depth)
      {
        setTimeout(() => { 
          let midPoint1 = vertex1.getMidPointWith(vertex2);
          let midPoint2 = vertex2.getMidPointWith(vertex3);
          let midPoint3 = vertex3.getMidPointWith(vertex1);
          this.processTriangles(mathCanvas, vertex1, midPoint1, midPoint3, depth+1);
          this.processTriangles(mathCanvas, midPoint1, vertex2, midPoint2, depth+1);
          this.processTriangles(mathCanvas, midPoint3, midPoint2, vertex3, depth+1);
        }, 
        250);

        }
      //this.calculated = true;
    }


    public draw(mathCanvas: MathCanvas2D): void
    {
      mathCanvas.backgroundColor = 'black';
      if(this.clearCanvasBeforeDraw){
          mathCanvas.Erase();
          mathCanvas.fillWithBackgroundColor();
      }
      mathCanvas.setRange(this.range);
      this.processTriangles(mathCanvas, this.seedPoint1, this.seedPoint2, this.seedPoint3, 0);
    }

    stop(): boolean 
    {
      return false; //no worker to stop
    }
}