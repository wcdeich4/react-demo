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
  const xMinTextboxRef = useRef(null);
  const xMaxTextboxRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = ():void => {
    if(equationTextboxRef?.current?.value && mathCanvas){
      if(bad.keywords.includes(equationTextboxRef.current.value.toLowerCase())){
        alert('unsafe')
      }
      else{
        mathCanvas.emptyDrawableArray();
        const equation = new JavascriptStringEvaluator(equationTextboxRef?.current?.value, 0.1, 'red', 'green', 'blue', 'yellow');
        mathCanvas.drawableArray.push(equation);
        const numericXMin = parseFloat(xMinTextboxRef.current.value);
        console.log('numericXMin = ', numericXMin);
        const numericXMax = parseFloat(xMaxTextboxRef.current.value);
        console.log('numericXMax = ', numericXMax);
         if(!isNaN(numericXMin) && !isNaN(numericXMax)){
            mathCanvas.setRangeValues(numericXMin, numericXMax, -10.0, 10.0);
            mathCanvas.AutoScaleHeightToMatchWidth();
            mathCanvas.draw();
            const integrationResult = equation.getIntegral(numericXMin, numericXMax);
            console.log('integrationResult = ', integrationResult);
            mathCanvas.canvasRenderingContext2D.font = "30px Verdana";
            mathCanvas.canvasRenderingContext2D.fillStyle = "red"; //TODO: make color varaibles
            mathCanvas.canvasRenderingContext2D.fillText("Y(X) color: red", 110, 40);
            mathCanvas.canvasRenderingContext2D.fillStyle = "green"; //TODO: make color varaibles
            mathCanvas.canvasRenderingContext2D.fillText("Y'(X) color: green", 110, 67);
            mathCanvas.canvasRenderingContext2D.fillStyle = "blue"; //TODO: make color varaibles
            mathCanvas.canvasRenderingContext2D.fillText("Y''(X) color: blue", 110, 95);
            mathCanvas.canvasRenderingContext2D.fillStyle = "yellow"; //TODO: make color varaibles
            mathCanvas.canvasRenderingContext2D.fillText("Integral: " + Math.round((integrationResult.SimpsonSum + Number.EPSILON) * 1000) / 1000 , 325, 40);
          }else{
            console.error("numericXMin or numericXMax is NaN in draw().");
          }

        
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
    xMinTextboxRef.current.value = "-6.283185307"; //TODO: read from settings.json
    xMaxTextboxRef.current.value = "6.283185307";
    htmlCanvasElement = canvasRef.current; //get the canvas element
    if (htmlCanvasElement) {
      const canvasRenderingContext2D = htmlCanvasElement.getContext('2d');
      if (canvasRenderingContext2D) {
        mathCanvas = new MathCanvas2D(canvasRenderingContext2D);
        const numericXMin = parseFloat(xMinTextboxRef.current.value);
        const numericXMax = parseFloat(xMaxTextboxRef.current.value);
        if(mathCanvas && !isNaN(numericXMin) && !isNaN(numericXMax)){
          mathCanvas.setRangeValues(numericXMin, numericXMax, -10.0, 10.0);
          mathCanvas.AutoScaleHeightToMatchWidth();
          windowResizeHandler(); //initial draw
        }else{
          console.error("mathCanvas is null or numericXMin/numericXMax is NaN in useEffect.");
        }
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
  const offsetStyle = { '--center-offset': '50%' } as React.CSSProperties;
  return (
    <div className={currentTheme == 'light' ? 'lightTheme fullWidthFulllHeight' : 'darkTheme fullWidthFulllHeight'}>
      <Menu currentTheme={currentTheme} />
      <Settings />
      <form onSubmit={handleSubmit} className="centeredForm" style={offsetStyle} >
        <button type="button" className="centeredFormElement" style={{ height: "18px" }} onClick={() => { downloadCanvasToPNG(htmlCanvasElement, 'Canvas.png'); }} >Save </button>

        <button type="button" className="centeredFormElement" style={{ height: "18px", width: "60px" }} > X start: </button>
        <input type="text" id="equationId" ref={xMinTextboxRef} className="centeredFormElement" style={{ height: "18px", width: "40px" }} />

        <button type="button" className="centeredFormElement" style={{ height: "18px", width: "60px" }} > X end: </button>
        <input type="text" id="equationId" ref={xMaxTextboxRef} className="centeredFormElement" style={{ height: "18px", width: "40px" }} />


        <button type="button" className="centeredFormElement" style={{ height: "18px", width: "80px"  }} > Set Range </button>
        <button type="button" className="centeredFormElement" style={{ height: "18px" }} > Y(x)= </button>
        <input type="text" id="equationId" ref={equationTextboxRef} className="centeredFormElement" style={{ height: "18px" }} />
        <button type="submit" className="centeredFormElement" style={{ height: "18px" }} >Draw</button>
      </form>
      <canvas ref={canvasRef} />
    </div>

  );
}
