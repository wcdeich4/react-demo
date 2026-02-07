import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../state/store';
import { Fractile } from '../models/Fractile';
import { SirpinskiTriangleFractile } from '../models/SirpinskiTriangleFractle';
import { FernDotFractile } from '../models/FernDotFractile';
import { FernLineFractile } from '../models/FernLineFractile';
import { MandelbrotFractile } from '../models/MandelbrotFractile';
import { downloadCanvasToPNG, startRecordingStream, stopRecording } from '../utilities/AudioVideoHelper';
import Menu from './Menu';
import Settings from './Settings';
import { Point3D } from '../math/Point3D';
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
const textureImageElement: HTMLImageElement = document.createElement("img"); //new Image();

function drawTexture(): void {
  if(mathCanvas){
    const coordinate0 = new Coordinate(new Point3D(10, 10, 0), null, new Point2D(0, 0)); //z=0 inefficient
    const coordinate1 = new Coordinate(new Point3D(310, 10, 0), null, new Point2D(1, 0));
    const coordinate2 = new Coordinate(new Point3D(310, 310, 0), null, new Point2D(1, 1));
    const coordinate3 = new Coordinate(new Point3D(10, 310, 0), null, new Point2D(0, 1));
    const coordinateArray = [coordinate0, coordinate1, coordinate2, coordinate3];
    mathCanvas.drawImageVarArgCanvasXY(textureImageElement, coordinateArray);
  }
}

export default function Fractiles() {
  const [isChromeBased, setIsChromeBased] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const selectedFractileRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowResizeHandler = () => {
    if (htmlCanvasElement) {
      htmlCanvasElement.width = window.innerWidth ;
      htmlCanvasElement.height = window.innerHeight ;
    }
    mathCanvas?.onresize();
    fractileMap?.get(selectedFractileRef?.current?.value)?.onresize(window.innerWidth, window.innerHeight);
    if (mathCanvas) {
      fractileMap?.get(selectedFractileRef?.current?.value)?.draw(mathCanvas);
      drawTexture();
    }
    else {
      console.error("mathCanvas is null in windowResizeHandler.");
    }
  };


  const draw = () => {
    if (mathCanvas) {
      fractileMap?.get(selectedFractileRef?.current?.value)?.draw(mathCanvas);
      drawTexture();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (mathCanvas) {
      window.requestAnimationFrame(draw)
    }
    else {
      console.error("mathCanvas is null in handleSubmit.");
    }
  };

  useEffect(() => { // This code runs once, after the first render.
    textureImageElement.src = sun;
    textureImageElement.crossOrigin = "anonymous";
    textureImageElement.onload = () => {
      htmlCanvasElement = canvasRef.current; //get the canvas element
      if (htmlCanvasElement) {
        canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
        if (canvasRenderingContext2D) {
          canvasRenderingContext2D.imageSmoothingEnabled = false;

          mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
          windowResizeHandler(); //initial draw
        } else {
          console.error("canvasRenderingContext2D is null.");
        }
      } else {
        console.error("canvasRef.current is null.");
      }
    };

    const browserUserAgent = navigator.userAgent;
    setIsChromeBased(browserUserAgent.includes("Chrome") || browserUserAgent.includes("Edg") || browserUserAgent.includes("OPR"));

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);
  }, []); // empty array ensures it only runs on mount

  const startStopRecording = () => {
    if(isRecording){
      stopRecording();
      setIsRecording(false);
    }else{
      //TODO: import frame rate from settings
      startRecordingStream(htmlCanvasElement.captureStream(96), 'canvas_recording.webm');
      setIsRecording(true);
    }
  }

  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  const offsetStyle = { '--center-offset': '25%' } as React.CSSProperties;
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'}>
      <Menu currentTheme={currentTheme} />
      <Settings />
      <form onSubmit={handleSubmit} className="centeredForm" style={offsetStyle} >
        <button type="button" className={isChromeBased ? 'centeredFormElement blackOutline' : 'hidden'} style={{ height: "18px" }} onClick={startStopRecording} >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button type="button" className="centeredFormElement blackOutline" style={{ height: "18px" }} onClick={() => { downloadCanvasToPNG(htmlCanvasElement, 'Canvas.png'); }} >Save PNG </button>
        <button type="button" className="centeredFormElement" onClick={() => { fractileMap?.get(selectedFractileRef?.current?.value)?.stop() }} >
          <img src={stop} alt="Stop" className="centeredFormElement" />
        </button>
        <select id="displaySelect" className="centeredFormElement" style={{ height: "18px" }} ref={selectedFractileRef} >
          <option value="SirpinskiTriangle">SirpinskiTriangle</option>
          <option value="FernDots">Fern Dots</option>
          <option value="FernLines">Fern Lines</option>
          <option value="Mandelbrot">Mandelbrot</option>
        </select>
        <button type="submit" className="centeredFormElement blackOutline" style={{ height: "18px" }} >Draw</button>
      </form>
      <canvas ref={canvasRef} />
    </div>

  );
}
