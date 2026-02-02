import { Point2D } from "../math/Point2D";
import { Vector } from "../math/Vector";

export class Coordinate{
  public vertex: Vector;
  public normal: Vector;
  public texturePercentage: Point2D;
  constructor(position?: Vector, perpendicular?: Vector, uvPercentage?: Point2D){
    if(position){
      this.vertex = position;
    }
    if(perpendicular){
      this.normal = perpendicular;
    }
    if(uvPercentage){
      this.texturePercentage = uvPercentage;
    }
  }
}