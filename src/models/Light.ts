import { Point3D } from "../math/Point3D";

export class Light
{
  /** Half angle of the light cone in radians. The way the math works out, we need the angle between the light direction and the outer edge of the light cone, which is half the total angle. Please use Radians. */
  public halfAngle: number; //in radians
  /** Position of the light source in 3D space.*/
  public position: Point3D;
  /** Direction the light is pointing in 3D space. Please normalize.*/
  public direction: Point3D;
  /** Name of the light source, just to keep track of it */
  public name: string;
  /** Ambient color of the light source */
  public ambientColor: Array<number>; //Ka in .mtl files
  /** Diffuse color of the light source */
  public diffuseColor: Array<number>; //Kd in .mtl files
  /** Specular color of the light source */
  public specularColor: Array<number>; //Ks in .mtl files

  /**
   * constructor
   * @param {Point3D} position location of the light source in 3D space.
   * @param {Point3D} direction direction the light is pointing in 3D space. Please normalize.
   * @param {number} halfAngle half angle of the light cone in radians.
   * @param {Array<number>} ambientColor ambient color of the light source.
   * @param {Array<number>} diffuseColor diffuse color of the light source.
   * @param {Array<number>} specularColor specular color of the light source.
   * @param {string} name name of the light source.
   */
  constructor(position?: Point3D, direction?: Point3D, halfAngle?: number, ambientColor?: Array<number>, diffuseColor?: Array<number>, specularColor?: Array<number>, name?: string)
  {
    if (position) {
      this.position = position;
    }
    if (direction) {
      this.direction = direction;
    }
    if (halfAngle !== undefined) {
      this.halfAngle = halfAngle;
    }
    if (ambientColor) {
      this.ambientColor = ambientColor;
    }
    if (diffuseColor) {
      this.diffuseColor = diffuseColor;
    }
    if (specularColor) {
      this.specularColor = specularColor;
    }
    if (name) {
      this.name = name;
    }
  }

  /**
   * only applies to diffuse and specular lighting, not ambient lighting
   * @param {Point3D} testPoint point to test if it is illuminated by this light source
   * @returns {boolean} true if the light illuminates the test point, false otherwise
   */
  public illuminatesPoint(testPoint: Point3D): boolean
  {
    const v = testPoint.getDifferenceWith(this.position);
    v.normalize();
    return v.dotProduct(this.direction) >= Math.cos(this.halfAngle);
  }
}