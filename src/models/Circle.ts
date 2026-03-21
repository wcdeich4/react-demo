import { Point3D } from "../math/Point3D";
import { ISingleColor } from "./ISingleColor";

export class Circle extends Point3D implements ISingleColor
{
    public radius: number;
    public color: string | CanvasGradient | CanvasPattern;
    constructor(x?: number, y?: number, z?: number, color: string | CanvasGradient | CanvasPattern = 'white', radius: number = 1
    ){
        super(x,y,z);
        this.color = color;
        this.radius = radius;
    }
}