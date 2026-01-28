import { FormEvent, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ThemeState } from '../state/store';
import { downloadCanvasToPNG } from '../utilities/AudioVideoHelper';
import Menu from './Menu';
import Settings from './Settings';
import { MathCanvas2D } from '../models/MathCanvas2D';
import { JavascriptStringEvaluator } from '../math/JavascriptStringEvaluator';
import bad from '../../forbidden.json'; //TODO: make 1 configuration.json file

let htmlCanvasElement: HTMLCanvasElement = null;
let mathCanvas: MathCanvas2D = null;

export default function Calculus() {
  const equationTextboxRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = ():void => {
    if(equationTextboxRef?.current?.value && mathCanvas){
      if(bad.keywords.includes(equationTextboxRef.current.value.toLowerCase())){
        alert('unsafe')
      }
      else{
        mathCanvas.emptyDrawableArray();
        const equation = new JavascriptStringEvaluator(equationTextboxRef?.current?.value, 0.1, 'red', 'green', 'blue');
        mathCanvas.drawableArray.push(equation);
        mathCanvas.draw();
        //TODO: add legend & integration
      }
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (mathCanvas) {
      draw();
    }
    else {
      console.error("mathCanvas is null in handleSubmit.");
    }
  };

  useEffect(() => { // This code runs once, after the first render.
    htmlCanvasElement = canvasRef.current; //get the canvas element
    if (htmlCanvasElement) {
      const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
      if (canvasRenderingContext2D) {
        mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
        mathCanvas.setRangeValues(-10.0, 10.0, -10.0, 10.0); //TODO: make these user settable
        windowResizeHandler(); //initial draw
      } else {
        console.error("canvasRenderingContext2D is null.");
      }
    } else {
      console.error("canvasRef.current is null.");
    }

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
        <button type="button" className="centeredFormElement" style={{ height: "18px" }} > Y(x)= </button>
        <input type="text" id="equationId" ref={equationTextboxRef} className="centeredFormElement" style={{ height: "18px" }} />
        <button type="submit" className="centeredFormElement" style={{ height: "18px" }} >Draw</button>
      </form>
      <canvas ref={canvasRef} />
    </div>

  );
}
