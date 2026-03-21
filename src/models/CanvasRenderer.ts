import { Matrix } from "../math/Matrix";
import { Circle } from "./Circle";
import { MathCanvas2D } from "./MathCanvas2D";
import { SingleColorPolygon } from "./mesh/SingleColorPolygon";

export class CanvasRenderer
{
  mathCanvas2D: MathCanvas2D;
  perspective: Matrix;

  constructor(mathCanvas2D?: MathCanvas2D, perspective?: Matrix)
  {
    if (mathCanvas2D)
    {
      this.mathCanvas2D = mathCanvas2D;
    }
    if (perspective)
    {
      this.perspective = perspective;
    }
  }

  public drawCircle(circle: Circle): void
  {
    if (this.mathCanvas2D)
    {
      this.perspective.transformPoint3DOnRight(circle);
      this.mathCanvas2D.drawCircleWorld2DCoordinates(circle);
    }
  }

  public drawSingleColorPolygon(f:SingleColorPolygon){
    console.log('face = ', f)
    f.draw(this.mathCanvas2D, this.perspective)
  }









}