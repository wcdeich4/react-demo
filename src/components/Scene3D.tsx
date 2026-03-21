import { FormEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../state/store';
import { downloadCanvasToPNG } from '../utilities/AudioVideoHelper';
import Menu from './Menu';
import Settings from './Settings';
import { MathCanvas2D } from '../models/MathCanvas2D';
import { CanvasRenderer } from '../models/CanvasRenderer';
import { Point3D } from '../math/Point3D';
import { Point2D } from '../math/Point2D';
import { Matrix } from '../math/Matrix';
import { Circle } from '../models/Circle';
import { SingleColorPolygon } from '../models/mesh/SingleColorPolygon';
import { Coordinate } from '../models/mesh/Coordinate';

let htmlCanvasElement: HTMLCanvasElement = null;
let mathCanvas: MathCanvas2D = null;
let renderer: CanvasRenderer = null;

export default function Scene3D()
{
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (): void =>
  {
    if (mathCanvas)
    {
      mathCanvas.draw();

      const c = new Circle(0, 0, 1, '#0000FF', 2);
      renderer.drawCircle(c);

      const coordinate0 = new Coordinate(new Point3D(0.5, -0.5, 0), new Point2D(0, 0), null);
      const coordinate1 = new Coordinate(new Point3D(0.5, 0.5, 0), new Point2D(0, 0), null);
      const coordinate2 = new Coordinate(new Point3D(-0.5, 0.5, 0), new Point2D(0, 0), null);
      const coordinate3 = new Coordinate(new Point3D(-0.5, -0.5, 0), new Point2D(0, 0), null);
      const coordinateArray = [coordinate0, coordinate1, coordinate2, coordinate3];
      const face = new SingleColorPolygon(coordinateArray);
      face.color = 'red'
      renderer.drawSingleColorPolygon(face);
    }
    else
    {
      console.error("mathCanvas is null in draw().");
    }
  }

  const windowResizeHandler = () =>
  {
    if (htmlCanvasElement)
    {
      htmlCanvasElement.width = window.innerWidth;
      htmlCanvasElement.height = window.innerHeight;
    }
    mathCanvas?.onresize();
    draw();
  };


  const fetchFileContent = async () =>
  {
    try
    {
      const url = 'http://localhost:7777/quad.obj';
      //'https://raw.githubusercontent.com/williamjclark/CrossPlatformGraphics/main/ReactArt/src/assets/teapot.obj';
      const response = await fetch(url);
      if (!response.ok)
      {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Use response.text() for a plain text file, or response.json() for JSON data
      const textContent = await response.text();
      console.log('File content:', textContent);
    } catch (err: any)
    {
      console.error('Error fetching file content:', err);
    }
  };






  useEffect(() =>
  { // This code runs once, after the first render.
    htmlCanvasElement = canvasRef.current; //get the canvas element
    if (htmlCanvasElement)
    {
      const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
      if (canvasRenderingContext2D)
      {
        mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
        mathCanvas.setRangeValues(-10, 10, -10.0, 10.0);
        mathCanvas.drawAxies2D = false;

        const cameraPosition = new Point3D(10, 10, 10); //TODO: make adjustable or in settings file
        const focalPoint = new Point3D(0, 0, 0);
        const upVector = new Point3D(0, 0, 1);
        const perspectiveMatrix = new Matrix(null, 4, 3);
        perspectiveMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);

        renderer = new CanvasRenderer(mathCanvas, perspectiveMatrix);

      } else
      {
        console.error("canvasRenderingContext2D is null.");
      }
    } else
    {
      console.error("canvasRef.current is null.");
    }

    //load model here so it is ready to draw on first resize
    fetchFileContent();





    window.addEventListener('resize', windowResizeHandler);
    windowResizeHandler(); //initial draw
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
