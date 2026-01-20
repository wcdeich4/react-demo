import { MathCanvas2D } from "./MathCanvas2D";
import { Fractile } from "./Fractile";
import { Pixel } from "./Pixel";
import { ScreenRangeWithDataFocusArea } from "../math/ScreenRangeWithDataFocusArea";

export class MandelbrotFractile extends Fractile {
    public iterationLimit: number = 80;
    private mathCanvas: MathCanvas2D = null;

    constructor() {
        super();
        //we may want to only evaluate points where some data can be found, while letting the whole range be resized to fit the screen
        //this.dataEvaluationRange 
        this.range = new ScreenRangeWithDataFocusArea(-2.00, 0.47, -1.12, 1.12);
        this.calculated = true;
        //  this.range.dataEvaluationRange = this.range.getRange2D();

        //   this.range.log();

    }



    public onresize(width: number, height: number): void {
        if (this.range != null) {
            this.range.resize(width, height);
        }

        if (this.mathCanvas != null) {
            this.disposeOfWorker();
            this.draw(this.mathCanvas);
        }
    }


    draw(mathCanvas: MathCanvas2D): void {
        if (this.range == null) {
            console.error("this.range is null in MandelbrotFractile.draw()");
            return;
        }

        this.mathCanvas = mathCanvas;
        this.mathCanvas.backgroundColor = 'red';
        if (this.clearCanvasBeforeDraw) {
            mathCanvas.Erase();
            mathCanvas.fillWithBackgroundColor();
        }
        // mathCanvas.range = this.range; //fails to set aspect ratios
        mathCanvas.setRange(this.range);
        mathCanvas.AutoScaleWidthToMatchHeight();

        if (typeof Worker == 'undefined') {
            alert("Sorry, your browser does not support Web Workers...");
        }
        else {
            if (this.worker) {
                this.disposeOfWorker();
            }
            this.worker = undefined;
            // Create a new web worker
            this.worker = new Worker(new URL('./Mandelbrot.WebWorker', import.meta.url), { type: 'module' });

            console.log('worker created');
            //  this.worker.postMessage('message sent from MandelbrotFractile.ts to worker');

            //max time to let worker run
            setTimeout(function () {
                if (this.worker != undefined && this.worker != null) { this.disposeOfWorker(); }
            }, 60000); //max time allowed to run the worker

            this.worker.onmessage = ({ data }) => {
                let parsedData: Pixel = null;
                try {
                    parsedData = <Pixel>JSON.parse(data) as Pixel;
                    mathCanvas.drawPixelCanvas2D(parsedData);
                }
                catch (error) {
                    console.error('parsedData = JSON.parse(data) as Pixel produced error: ' + error.toString());
                }
            }
        }

        this.worker.postMessage(mathCanvas.getRange().conciseJSON());
    }

    process(): void {

    }

    public stop(): boolean {
        this.disposeOfWorker();
        return true;
    }


}