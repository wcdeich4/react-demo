import { MathCanvas2D } from "./MathCanvas2D";
import { Fractile } from "./Fractile";
import { ScreenRangeConverter2D } from "../math/ScreenRangeConverter2D";
import { ColorVector } from "./ColorVector";

/**
 * https://spanishplus.tripod.com/maths/FractalBarnsley.htm
 * https://en.wikipedia.org/wiki/Barnsley_fern
 */
export class FernDotFractile extends Fractile {

  constructor() {
    super();
    this.calculated = true;
    this.range = new ScreenRangeConverter2D(-2.1818, 3.76, 0, 10);
  }

  public draw(mathCanvas: MathCanvas2D): void {
    if (typeof this.range == 'undefined' || this.range == null) {
      console.log('this.range == undefined || this.range == null ');
    }

    if (typeof mathCanvas == 'undefined' || mathCanvas == null) {
      console.log('mathCanvas == undefined || mathCanvas == null ');
    }

    mathCanvas.backgroundColor = 'black';

    // mathCanvas.range = this.range; //fails to set aspect ratios
    if (this.clearCanvasBeforeDraw) {
      mathCanvas.Erase();
      mathCanvas.fillWithBackgroundColor();
    }
    else {
      console.log('not clearing canvas before draw in FernDotFractile.draw()');
    }
    mathCanvas.setRange(this.range);

    if (typeof Worker == 'undefined') {
      alert("Sorry, your browser does not support Web Workers...");
    }
    else {
      // Dispose of any existing worker
      if(this.worker){
          this.disposeOfWorker();
      }
      this.worker = undefined;
      // Create a new web worker
      this.worker = new Worker(new URL('./FernDotFractile.WebWorker', import.meta.url), { type: 'module' });

      //max time to let worker run
      setTimeout(function () {
        if (this.worker != undefined && this.worker != null) {
          console.log('terminating worker');
          this.disposeOfWorker();
        }
      }, 30000);


      this.worker.onmessage = ({ data }) => {
        let parsedData = JSON.parse(data) as ColorVector;

        if (parsedData == undefined) {
          console.log('parsedData == undefined')
        }

        else if (parsedData == null) {
          console.log('parsedData == null')
        }

        else //if (parsedData.dot != undefined)
        {
          mathCanvas.drawPixelWorld2DCoordinatesFromVector(parsedData, parsedData.color);
        }
      };
      this.worker.postMessage('message sent from FernDotFractile.ts to worker');
    }

  }

  public process(): void {

  }

  public stop(): boolean {
    this.disposeOfWorker();
    return true;
  }


}