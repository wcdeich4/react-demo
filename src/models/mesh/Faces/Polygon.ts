import { Matrix } from "../../../math/Matrix";
import { Point3D } from "../../../math/Point3D";
import { IMathDrawable } from "../../IMathDrawable";
import { Light } from "../../Light";
import { MathCanvas2D } from "../../MathCanvas2D";
import { Coordinate } from "../Coordinate";

export abstract class Polygon implements IMathDrawable
{
  protected currentCenter: Point3D | null = null;
  public coordinateArray: Coordinate[];
  constructor(coords?: Coordinate[])
  {
    if (coords)
    {
      this.coordinateArray = coords;
    }
    else
    {
      this.coordinateArray = [];
    }
  }
  /**
   * abstract draw method for polymorphic drawing of different types of polygons. The parameters allow for transformation and lighting calculations to be applied during the drawing process.
   * @param {MathCanvas2D} mathCanvas The math canvas to draw on.
   * @param {Matrix | null} transformMatrix The transformation matrix to apply.
   * @param {Matrix | null} inverseTransposedMatrix The inverse transposed matrix to apply.
   * @param {Array<Light> | null} lightingArray The array of lights to apply.
   * @param {boolean | null} recalculateCenter Whether to recalculate the center point.
   * @param {boolean | null} recalculateColor Whether to recalculate the color.
   */
  public abstract draw(mathCanvas: MathCanvas2D, transformMatrix?: Matrix, inverseTransposedMatrix?: Matrix, lightingArray?: Array<Light>, recalculateCenter?: boolean, recalculateColor?: boolean): void;

  /**
   * get center point of the polygon, which is the average of all the vertices.
   * @param {boolean?} refresh the data even if present, to avoid returning a cached value that may be wrong after the model has been transformed.
   * @returns {Point3D} the center point of the polygon, which is the average of all the vertices.
   */
  public getCenter(refresh?: boolean): Point3D
  {
    let result = null;
    if (this.currentCenter && !refresh)
    {
      result = this.currentCenter;
    }
    else
    {
      result = Point3D.average(this.coordinateArray.map(c => c.vertex));
      this.currentCenter = result;
    }
    return result;
    // let sumX: number = 0;
    // let sumY: number = 0;
    // let sumZ: number = 0;
    // for(let i = 0; i < this.coordinateArray.length; i++)
    // {
    //   sumX += this.coordinateArray[i].vertex.x;
    //   sumY += this.coordinateArray[i].vertex.y;
    //   sumZ += this.coordinateArray[i].vertex.z;
    // }
    // const centerX: number = sumX / this.coordinateArray.length;
    // const centerY: number = sumY / this.coordinateArray.length;
    // const centerZ: number = sumZ / this.coordinateArray.length;
    // this.currentCenter = new Point3D(centerX, centerY, centerZ);
    // return this.currentCenter;
  }


  /**
   * Traverses the coordinates of the polygon and draws them on the canvas.
   * @param {MathCanvas2D} mathCanvas The math canvas to draw on.
   * @param {Matrix | null} transformMatrix The transformation matrix to apply.
   * @param {Matrix | null} inverseTransposedMatrix The inverse transposed matrix to apply.
   */
  protected traverseCoordinates(mathCanvas: MathCanvas2D, transformMatrix: Matrix | null = null, inverseTransposedMatrix: Matrix | null = null): void
  {
    // Begin drawing the path
    mathCanvas.canvasRenderingContext2D.beginPath();
    let canvasX: number, canvasY: number;
    let currentCoordinate: Coordinate = this.coordinateArray[0].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
    canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
    canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);

    // Move to the first point in the array
    mathCanvas.canvasRenderingContext2D.moveTo(canvasX, canvasY);

    // Loop through the remaining points to draw the sides
    for (let i = 1; i < this.coordinateArray.length; i++)
    {
      currentCoordinate = this.coordinateArray[i].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
      canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
      canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);
      mathCanvas.canvasRenderingContext2D.lineTo(canvasX, canvasY);
    }

    // Close the path and fill the shape
    mathCanvas.canvasRenderingContext2D.closePath(); // Connects the last point back to the first
    mathCanvas.canvasRenderingContext2D.fill();
  }







  // /**
  //  * Transform by a Matrix. The inverseTransposedMatrix is passed separately b/c we cannot take time to make it for each face automatically.
  //  * @param matrix 
  //  * @param inverseTransposedMatrix 
  //  */
  // public transformByMatrixOnRight(matrix: Matrix, inverseTransposedMatrix: Matrix): void{
  //   throw new Error("Not implemented yet");
  // }


}