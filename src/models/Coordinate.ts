import { Point2D } from "../math/Point2D";
import { Point3D } from "../math/Point3D";

export class Coordinate{
  public vertex: Point3D;
  public normal: Point3D;
  public texturePercentage: Point2D;
  constructor(position?: Point3D, perpendicular?: Point3D, uvPercentage?: Point2D){
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