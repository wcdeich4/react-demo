/// <reference lib="webworker" />
import { ColorHelper } from "../utilities/ColorHelper";
import { ComplexPoint } from "../math/ComplexPoint";
import { Pixel } from "./Pixel";
import { ScreenRangeWithDataFocusArea } from "../math/ScreenRangeWithDataFocusArea";

let mandelbrotRange: ScreenRangeWithDataFocusArea = null;
let pixel: Pixel = new Pixel();
const complexCoordinate: ComplexPoint = new ComplexPoint(0, 0);
const iterationLimit = 80; //TODO: put in .ini or .json file
const Zn: ComplexPoint = new ComplexPoint(0, 0);
let n: number = 0;
let okayToContinue = true;

addEventListener('message', (event: MessageEvent) => {

    console.log('Mandelbrot.WebWorker addEventListener(message received : ');
    console.log(event.data);

    if (event.data.includes('stop')) //did not work b/c a new message is not processed until the previous message is processed :(
    {
        console.log('stop received');
        okayToContinue = false;
    }
    else {
        mandelbrotRange = JSON.parse(event.data, function reviver(key, value) {
            if (typeof value === 'object') {
                return Object.assign(new ScreenRangeWithDataFocusArea, value);
            }
            else {
                return value;
            }
        }) as ScreenRangeWithDataFocusArea;


        if (mandelbrotRange == null) {
            console.log('mandelbrotRange = JSON.parse(data) as ScreenRangeConverter2D returned null in Mandelbrot.WebWorker ');
        }
        else {
            let deltaX = mandelbrotRange.getScreenDeltaX();
            let deltaY = mandelbrotRange.getScreenDeltaY();

            let worldX = mandelbrotRange.dataEvaluationRange.xMin;
            pixel.x = mandelbrotRange.world2DXtoCanvasX(worldX);
            const endX = mandelbrotRange.world2DXtoCanvasX(mandelbrotRange.dataEvaluationRange.xMax);

            const highY = mandelbrotRange.world2DYtoCanvasY(mandelbrotRange.dataEvaluationRange.yMax);
            const lowY = mandelbrotRange.world2DYtoCanvasY(mandelbrotRange.dataEvaluationRange.yMin);



            while (pixel.x < endX) {
                let worldY = mandelbrotRange.yMax;
                pixel.y = highY;
                //while( worldY <= mandelbrotRange.yMax )
                while (pixel.y <= lowY) {
                    complexCoordinate.set(worldX, worldY);
                    Zn.set(worldX, worldY);
                    for (n = 1; n < iterationLimit; n++) {
                        Zn.square();
                        Zn.add(complexCoordinate);
                        if (Zn.magnitudeSquared() > 4) {
                            break;
                        }
                    }

                    if (n >= iterationLimit) {
                        pixel.color = 'black';
                    }
                    else {
                        pixel.color = ColorHelper.FastFullySaturatedHueToHex(n / iterationLimit);
                    }

                    postMessage(JSON.stringify(pixel));
                    //console.log(pixel);

                    worldY -= deltaY;
                    pixel.y++;
                }
                worldX += deltaX;
                pixel.x++;
            }



        }
    }






























});




//*/