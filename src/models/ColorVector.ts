import { Vector } from "../math/Vector";
import { ISingleColor } from "./ISingleColor";

export class ColorVector extends Vector  implements ISingleColor
{
    public color: string | CanvasGradient | CanvasPattern;
    /**
     * constructor
     * @param {Array<number>|null} array1D array of numbers or null
     * @param {number|null} numberOfElement number or null
     */
    constructor(
      array1D:Array<number>|null = null, 
      numberOfElements: number|null = null,
      color: string | CanvasGradient | CanvasPattern = 'white'
    ){
        super(array1D, numberOfElements);
        this.color = color;
    }
}