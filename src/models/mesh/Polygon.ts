import { Matrix } from "../../math/Matrix";
import { Coordinate } from "./Coordinate";

export class Polygon{
  //TODO: add material & lighting
  public coordinateArray: Coordinate[];
  constructor(coords?: Coordinate[])
  {
    if(coords)
    {
      this.coordinateArray = coords;
    }
    else
    {
      this.coordinateArray = [];
    }
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