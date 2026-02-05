import { FormEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../state/store';
import { downloadCanvasToPNG } from '../utilities/AudioVideoHelper';
import Menu from './Menu';
import Settings from './Settings';
import { MathCanvas2D } from '../models/MathCanvas2D';
import { Renderer3D } from '../models/Renderer3D';
import { Point3D } from '../math/Point3D';
import { Matrix } from '../math/Matrix';
import { Circle } from '../models/Circle';

let htmlCanvasElement: HTMLCanvasElement = null;
let mathCanvas: MathCanvas2D = null;
let renderer: Renderer3D = null;

export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = ():void => {
    if(mathCanvas){
      mathCanvas.draw();

      const p = new Circle(0, 0, 0, '#FF0000', 2);
      renderer.drawCircle(p); //only comes up on resize!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    else {
      console.error("mathCanvas is null in draw().");
    }
  }

  const windowResizeHandler = () => {
    if (htmlCanvasElement) {
      htmlCanvasElement.width = window.innerWidth;
      htmlCanvasElement.height = window.innerHeight;
    }
    mathCanvas?.onresize();
    draw();
  };

  useEffect(() => { // This code runs once, after the first render.
    htmlCanvasElement = canvasRef.current; //get the canvas element
    if (htmlCanvasElement) {
      const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
      if (canvasRenderingContext2D) {
        mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
        mathCanvas.setRangeValues(-10, 10, -10.0, 10.0);
        mathCanvas.drawAxies2D = false;

        const cameraPosition = new Point3D(10, 10, 10); //TODO: make adjustable or in settings file
        const focalPoint = new Point3D(0, 0, 0);
        const upVector = new Point3D(0, 0, 1);
        const perspectiveMatrix = new Matrix(null, 4, 4);
        perspectiveMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);

        renderer = new Renderer3D(mathCanvas, perspectiveMatrix);

      }else{
        console.error("canvasRenderingContext2D is null.");
      }
    }else{
      console.error("canvasRef.current is null.");
    }

    window.addEventListener('resize', windowResizeHandler);
    return () => window.removeEventListener('resize', windowResizeHandler);

  }, []); // empty array ensures it only runs on mount


  const currentTheme = useSelector((state: ThemeState) => state.theme.mode);
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'}>
      <Menu currentTheme={currentTheme} />
      <Settings />

      <canvas ref={canvasRef} />
    </div>

  );
}
