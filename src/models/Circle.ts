import { ColorVector } from "./ColorVector";

export class Circle extends ColorVector{
    public radius: number;
    constructor(
      array1D:Array<number>|null = null, 
      numberOfElements: number|null = null,
      color: string | CanvasGradient | CanvasPattern = 'white',
      radius: number = 1
    ){
        super(array1D, numberOfElements, color);
        this.radius = radius;
    }
}