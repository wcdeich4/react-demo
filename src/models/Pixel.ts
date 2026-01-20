import { ISingleColor } from "./ISingleColor";
import { Point2D } from "../math/Point2D";

export class Pixel extends Point2D  implements ISingleColor
{
    public color: string | CanvasGradient | CanvasPattern;
}