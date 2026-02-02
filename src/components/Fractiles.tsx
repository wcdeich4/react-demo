import { FormEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../state/store';
import { Fractile } from '../models/Fractile';
import { SirpinskiTriangleFractile } from '../models/SirpinskiTriangleFractle';
import { FernDotFractile } from '../models/FernDotFractile';
import { FernLineFractile } from '../models/FernLineFractile';
import { MandelbrotFractile } from '../models/MandelbrotFractile';
import { downloadCanvasToPNG } from '../utilities/AudioVideoHelper';
import Menu from './Menu';
import Settings from './Settings';
import { Vector } from '../math/Vector';
import { MathCanvas2D } from '../models/MathCanvas2D';
import stop from '../assets/stop.png';
import sun from '../assets/sun.png';
import { Point2D } from '../math/Point2D';
import { Coordinate } from '../models/Coordinate';

const fractileMap: Map<string, Fractile> = new Map<string, Fractile>();
fractileMap.set('SirpinskiTriangle', new SirpinskiTriangleFractile());
fractileMap.set('FernDots', new FernDotFractile());
fractileMap.set('FernLines', new FernLineFractile());
fractileMap.set('Mandelbrot', new MandelbrotFractile());

let htmlCanvasElement: HTMLCanvasElement = null;
let canvasRenderingContext2D: CanvasRenderingContext2D = null;
let mathCanvas: MathCanvas2D = null;
const overlayImageElement: HTMLImageElement = document.createElement("img"); //new Image();

function drawoverlay(): void {
  if(mathCanvas){
    const coordinate0 = new Coordinate(new Vector([10, 10]), null, new Point2D(0, 0));
    const coordinate1 = new Coordinate(new Vector([310, 10]), null, new Point2D(1, 0));
    const coordinate2 = new Coordinate(new Vector([310, 310]), null, new Point2D(1, 1));
    const coordinate3 = new Coordinate(new Vector([10, 310]), null, new Point2D(0, 1));
    const coordinateArray = [coordinate0, coordinate1, coordinate2, coordinate3];
    mathCanvas.drawImageVarArgCanvasXY(overlayImageElement, coordinateArray);
  }
}

export default function Fractiles() {
  const selectedFractileRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowResizeHandler = () => {
    if (htmlCanvasElement) {
      htmlCanvasElement.width = window.innerWidth;
      htmlCanvasElement.height = window.innerHeight;
    }
    mathCanvas?.onresize();
    fractileMap?.get(selectedFractileRef?.current?.value)?.onresize(window.innerWidth, window.innerHeight);
    if (mathCanvas) {
      fractileMap?.get(selectedFractileRef?.current?.value)?.draw(mathCanvas);
      drawoverlay();
    }
    else {
      console.error("mathCanvas is null in windowResizeHandler.");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (mathCanvas) {
      fractileMap?.get(selectedFractileRef?.current?.value)?.draw(mathCanvas);
      drawoverlay();
    }
    else {
      console.error("mathCanvas is null in handleSubmit.");
    }
  };

  useEffect(() => { // This code runs once, after the first render.
    

    overlayImageElement.src = sun;
    overlayImageElement.crossOrigin = "anonymous";
    overlayImageElement.onload = () => {
      htmlCanvasElement = canvasRef.current; //get the canvas element
      if (htmlCanvasElement) {
        canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
        if (canvasRenderingContext2D) {
          mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
          windowResizeHandler(); //initial draw
        } else {
          console.error("canvasRenderingContext2D is null.");
        }
      } else {
        console.error("canvasRef.current is null.");
      }
    };

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, []); // empty array ensures it only runs on mount


  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  const offsetStyle = { '--center-offset': '25%' } as React.CSSProperties;
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'}>
      <Menu currentTheme={currentTheme} />
      <Settings />
      <form onSubmit={handleSubmit} className="centeredForm" style={offsetStyle} >
        <button type="button" className="centeredFormElement" style={{ height: "18px" }} onClick={() => { downloadCanvasToPNG(htmlCanvasElement, 'Canvas.png'); }} >Save </button>
        <button type="button" className="centeredFormElement" onClick={() => { fractileMap?.get(selectedFractileRef?.current?.value)?.stop() }} >
          <img src={stop} alt="Stop" className="centeredFormElement" />
        </button>
        <select id="displaySelect" className="centeredFormElement" style={{ height: "18px" }} ref={selectedFractileRef} >
          <option value="SirpinskiTriangle">SirpinskiTriangle</option>
          <option value="FernDots">Fern Dots</option>
          <option value="FernLines">Fern Lines</option>
          <option value="Mandelbrot">Mandelbrot</option>
        </select>
        <button type="submit" className="centeredFormElement" style={{ height: "18px" }} >Draw</button>
      </form>
      <canvas ref={canvasRef} />
    </div>

  );
}
