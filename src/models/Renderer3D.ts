import { Matrix } from "../math/Matrix";
import { Circle } from "./Circle";
import { ColorVector } from "./ColorVector";
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

  public drawColorVector(vector: ColorVector): void {
    if(this.mathCanvas2D){
      const projected = this.perspective.multiplyByVectorOnRight(vector);
      this.mathCanvas2D.drawPixelWorld2DCoordinates(projected.elements[0], projected.elements[1], vector.color);
    }
  }

  public drawCircle(circle: Circle): void {
    if(this.mathCanvas2D){
      this.perspective.transformVectorOnRight(circle);
      this.mathCanvas2D.drawCircleWorld2DCoordinates(circle);
    }
  }
}