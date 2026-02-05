import { MathCanvas2D } from "./MathCanvas2D";
import { Fractile } from "./Fractile";
import { Point2D } from "../math/Point2D";
import { ScreenRangeConverter2D } from "../math/ScreenRangeConverter2D";

export class FernLineFractile extends Fractile {
  public branchPointPercentage: number = 0.4;
  public scalePercentage: number = 0.6;
  public recursionDepthLimit = 5;
  private seedPoint1: Point2D;
  private seedPoint2: Point2D;

  constructor(range?: ScreenRangeConverter2D) {
    super();
    if (range == null) {
      range = ScreenRangeConverter2D.Standard();
    }
    this.range = range;
    this.seedPoint1 = new Point2D(0, -10);
    this.seedPoint2 = new Point2D(0, 10);
    this.calculated = true;
  }

  public draw(mathCanvas: MathCanvas2D): void {
    if (this.clearCanvasBeforeDraw) {
      mathCanvas.Erase();
      mathCanvas.fillWithBackgroundColor();
    }
    // mathCanvas.range = this.range; //fails to set aspect ratios
    mathCanvas.setRange(this.range);
    this.processLines(mathCanvas, this.seedPoint1, this.seedPoint2, 0);
  }

  public process(): void {

  }

  public processLines(mathCanvas: MathCanvas2D, vertex1: Point2D, vertex2: Point2D, depth: number = 0): void {
    mathCanvas.drawLineWorld2D(vertex1.x, vertex1.y, vertex2.x, vertex2.y, 'green');

    if (this.recursionDepthLimit > depth) {
      const sizeOfCurrentLineSegment = vertex2.getDistanceTo(vertex1);
      const directionPoint2D = vertex2.clone();
      directionPoint2D.subtract(vertex1);
      directionPoint2D.normalize();

      const newInbetweenPoint = directionPoint2D.clone();
      newInbetweenPoint.multiplyByScalar(this.branchPointPercentage * sizeOfCurrentLineSegment);
      newInbetweenPoint.add(vertex1);

      const prevendicularPoint2D1: Point2D = directionPoint2D.getPerpendicularClockwise();
      prevendicularPoint2D1.normalize();
      prevendicularPoint2D1.multiplyByScalar(sizeOfCurrentLineSegment * this.scalePercentage * 0.5);
      const newEndPoint1 = newInbetweenPoint.clone();
      newEndPoint1.add(prevendicularPoint2D1);

      const prevendicularPoint2D2: Point2D = directionPoint2D.getPerpendicularCounterClockwise();
      prevendicularPoint2D2.normalize();
      prevendicularPoint2D2.multiplyByScalar(sizeOfCurrentLineSegment * this.scalePercentage * 0.5);
      const newEndPoint2 = newInbetweenPoint.clone();
      newEndPoint2.add(prevendicularPoint2D2)

      if (depth == 1) {
        console.log('vertex1 x = ' + vertex1.x + ' y= ' + vertex1.y);
        console.log('vertex2 x = ' + vertex2.x + ' y= ' + vertex2.y);

        console.log('newInbetweenPoint x = ' + newInbetweenPoint.x + ' y= ' + newInbetweenPoint.y);
        console.log('newEndPoint1 x = ' + newEndPoint1.x + ' y= ' + newEndPoint1.y);
        console.log('newEndPoint2 x = ' + newEndPoint2.x + ' y= ' + newEndPoint2.y);
      }
      this.processLines(mathCanvas, newInbetweenPoint, newEndPoint1, depth + 1);
      this.processLines(mathCanvas, newInbetweenPoint, newEndPoint2, depth + 1);
      this.processLines(mathCanvas, newInbetweenPoint, vertex2, depth + 1);
    }
    //  this.calculated = true;
  }

  public stop(): boolean {
    return false; //no worker to stop
  }
}