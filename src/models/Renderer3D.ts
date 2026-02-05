import { Matrix } from "../math/Matrix";
import { Circle } from "./Circle";
import { ColorPoint3D } from "./ColorPoint3D";
import { MathCanvas2D } from "./MathCanvas2D";

export class Renderer3D {
  mathCanvas2D: MathCanvas2D;
  perspective: Matrix;

  constructor(mathCanvas2D?: MathCanvas2D, perspective?: Matrix) {
    if(mathCanvas2D){
      this.mathCanvas2D = mathCanvas2D;
    }
    if(perspective){
      this.perspective = perspective;
    }
  }

  public drawColorPoint3D(Point3D: ColorPoint3D): void {
    if(this.mathCanvas2D){
      const projected = this.perspective.multiplyByPoint3DOnRight(Point3D);
      this.mathCanvas2D.drawPixelWorld2DCoordinates(projected.x, projected.y, Point3D.color);
    }
  }

  public drawCircle(circle: Circle): void {
    if(this.mathCanvas2D){
      this.perspective.transformPoint3DOnRight(circle);
      this.mathCanvas2D.drawCircleWorld2DCoordinates(circle);
    }
  }
}