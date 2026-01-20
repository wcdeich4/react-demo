import { Range2D } from "./Range2D";
import { ScreenRangeConverter2D } from "./ScreenRangeConverter2D";

export class ScreenRangeWithDataFocusArea extends ScreenRangeConverter2D
{
    public dataEvaluationRange: Range2D = null;

    public constructor(xMin?: number, xMax?: number, yMin?: number, yMax?: number, width?: number, height?: number)
    {
        super();
        this.set(xMin, xMax, yMin, yMax, width, height);

        this.dataEvaluationRange = this.getRange2D(); //can be changed later
    }

    public conciseJSON(): string
    {
        return JSON.stringify(this, ['xMin', 'xMax',  'yMin', 'yMax', 'width', 'height', 'xAspectRatio', 'yAspectRatio', 'dataEvaluationRange'  ]);
    }
}