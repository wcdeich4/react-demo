import { Matrix } from "../../math/Matrix";
import { Circle } from "../Circle";
import { ISingleColor } from "../ISingleColor";
import { MathCanvas2D } from "../MathCanvas2D";
import { Coordinate } from "./Coordinate";
import { Polygon } from "./Polygon";

export class SingleColorPolygon extends Polygon implements ISingleColor
{
  public color: string | CanvasGradient | CanvasPattern;
  constructor(coords?: Coordinate[])
  {
    super(coords);
  }

  public draw(mathCanvas: MathCanvas2D, transformMatrix: Matrix | null = null, inverseTransposedMatrix: Matrix | null = null): void
  {
    // 1. Set the fill color
    mathCanvas.canvasRenderingContext2D.fillStyle = this.color;

    //TODO: make protected parent method to loop thru all the points

    // 2. Begin drawing the path
    mathCanvas.canvasRenderingContext2D.beginPath();
    let canvasX: number, canvasY: number;
    let currentCoordinate: Coordinate = this.coordinateArray[0].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
    canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
    canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);

    // 3. Move to the first point in the array
    mathCanvas.canvasRenderingContext2D.moveTo(canvasX, canvasY);

    // 4. Loop through the remaining points to draw the sides
    for (let i = 1; i < this.coordinateArray.length; i++)
    {
      currentCoordinate = this.coordinateArray[i].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
      canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
      canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);
      mathCanvas.canvasRenderingContext2D.lineTo(canvasX, canvasY);
    }

    // 5. Close the path and fill the shape
    mathCanvas.canvasRenderingContext2D.closePath(); // Connects the last point back to the first
    mathCanvas.canvasRenderingContext2D.fill();


  }



  //how to handle drawing w/ projection matrix ? parameter for draw method ?????????????????
  //probably draw(mathCanvas, perspectiveMatrix);

  //cramerSolve needs to take an array of polygon faces to avoid taking the determinantes more than 1 time, or else the inverse matrix would be more efficient.

  //Coordinate also needs a multiply by matrix method ?????????????????
  //normal vector also needs to be transformed by the projection matrix inverse?????????????????
  // ------- wait! we do not want to transform the normal vector by the projection matrix at all
  // only modify normals when model changes, specifically rotation &  scale!!!!!!!!!!!!!!!!!!!
  // -------- lighting calculations should be done in world space 3D, so we need do not transform the normal vectors to display the object, only for rotation & scale.
  //but remember to mutlply normal by transpose of inverse matrix if you need to rotate/scale the polygon
  //-->>>>>> good news the inverse of the transpose of a matrix always equals to the transpose of of the inverse of the matrix!    Also, for rotation, transpose = inverse :)
  //MathCanvas2D needs a draw Coordinates method w/ only the coordinate loop that can be reused inside other methods that applied a color, material or image!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


}