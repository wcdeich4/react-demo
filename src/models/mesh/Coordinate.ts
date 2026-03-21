import { ICloneable } from "../../math/ICloneable";
import { Matrix } from "../../math/Matrix";
import { Point2D } from "../../math/Point2D";
import { Point3D } from "../../math/Point3D";

export class Coordinate implements ICloneable<Coordinate>
{
  public vertex: Point3D;
  public texturePercentage: Point2D;
  public normal: Point3D;
  constructor(position?: Point3D, uvPercentage?: Point2D, perpendicular?: Point3D)
  {
    if (position)
    {
      this.vertex = position;
    }
    if (perpendicular)
    {
      this.normal = perpendicular;
    }
    if (uvPercentage)
    {
      this.texturePercentage = uvPercentage;
    }
  }

  /**
   * Transform by a Matrix. The inverseTransposedMatrix is passed separately b/c we cannot take time to make it for each coordinate automatically.
   * @param {Matrix|null} transformMatrix to multiply on the right.  It may inlude the perspective matrix.  Ignored if null.
   * @param {Matrix} inverseTransposedMatrix inverse transposed matrix to multiply the normal by on the right. This is necessary because normals must be transformed differently than vertices & we cannot take time to calculate the inverse transposed matrix for each coordinate automatically.  Should not include the perspective matrix.  Ignored if null.
   */
  public getMultipliedByMatrixOnRight(transformMatrix: Matrix|null = null, inverseTransposedMatrix: Matrix|null = null): Coordinate
  {
    console.log('inside coordinate.getMultipliedByMatrixOnRight this = ', this)
    const newCoordinate = this.clone();
    if (transformMatrix){
      newCoordinate.vertex = transformMatrix.multiplyByPoint3DOnRight(this.vertex);
    }
    //texure percentage is not transformed by the matrix because it is a percentage, not a position in space. It is used to determine how much of the texture to use, so it should not be transformed by the matrix.
    if (inverseTransposedMatrix != undefined){
      newCoordinate.normal = inverseTransposedMatrix.multiplyByPoint3DOnRight(this.normal);
    }
    return newCoordinate;
  }

  /**
   * clone this coordinate
  * @returns {Coordinate} identical coordinate
  */
  public clone(): Coordinate
  {
    return new Coordinate(
      this.vertex.clone(),
      this.texturePercentage?.clone() ?? null,
      this.normal?.clone() ?? null);
  }

}