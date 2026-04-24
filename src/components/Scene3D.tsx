import { FormEvent, useEffect, useRef } from 'react';
import * as fs from 'fs';
import * as path from 'path';
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
import { SingleColorPolygon } from '../models/mesh/Faces/SingleColorPolygon';
import { Coordinate } from '../models/mesh/Coordinate';
import { Light } from '../models/Light';
import { IMathDrawable } from '../models/IMathDrawable';
import { Material } from '../models/mesh/Material';
import { MaterialPolygon } from '../models/mesh/Faces/MaterialPolygon';
import { GlobalSingleton } from '../models/GlobalSingleton';
import { Mesh } from '../models/mesh/Mesh';

let htmlCanvasElement: HTMLCanvasElement = null;
let mathCanvas: MathCanvas2D = null;
let renderer: CanvasRenderer = null;
let currentTime: number;
let previousRenderTime: number = Date.now();
let intervalForTargetFrameRate: number = 1000/24.0;
let timeSinceLastFrameRender: number;


export default function Scene3D()
{
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lightingArray: Array<Light> = [
    new Light(new Point3D(0, 0, 10), new Point3D(0, 0, -1), Math.PI / 4, null, [0,1,0], null, null)
  ] ;

  const drawList: Array<IMathDrawable> = [];
  


  const draw = (): void =>
  {
    //frame rate calculations
    currentTime = Date.now();
    timeSinceLastFrameRender = currentTime - previousRenderTime;
    if (timeSinceLastFrameRender >= intervalForTargetFrameRate)
    {
      //adjust for time taken to render the frame
      previousRenderTime = currentTime - (timeSinceLastFrameRender % intervalForTargetFrameRate);

      //do actual drawing here
      if (mathCanvas)
      {
        mathCanvas.draw();

        const c = new Circle(0, 0, 1, '#0000FF', 2);
        drawList.push(c);
        //renderer.drawCircle(c);

      //   const coordinate0 = new Coordinate(new Point3D(0.5, -0.5, 0), new Point2D(0, 0), null);
      //   const coordinate1 = new Coordinate(new Point3D(0.5, 0.5, 0), new Point2D(0, 0), null);
      //   const coordinate2 = new Coordinate(new Point3D(-0.5, 0.5, 0), new Point2D(0, 0), null);
      //   const coordinate3 = new Coordinate(new Point3D(-0.5, -0.5, 0), new Point2D(0, 0), null);
      //   const coordinateArray = [coordinate0, coordinate1, coordinate2, coordinate3];
      //   const face = new SingleColorPolygon(coordinateArray);
      //   face.color = 'red'
      //   drawList.push(face);
      //  // renderer.drawSingleColorPolygon(face);

        for (let i = 0; i < drawList.length; i++)
        {
          drawList[i].draw(mathCanvas, renderer.perspective, null, lightingArray, false);
        }



      }
      else
      {
        console.error("mathCanvas is null in draw().");
      }


      
    }


    window.requestAnimationFrame(draw);

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
      const origin = window.location.origin;
      const quadMeshURL = origin + '/quad.obj';
      const quadResponse = await fetch(quadMeshURL);
      if (!quadResponse.ok)
      {
        throw new Error(`HTTP error! status: ${quadResponse.status}`);
      }
      const quadFileContents = await quadResponse.text();
      console.log(quadMeshURL + ' content:', quadFileContents);

    const mesh = new Mesh();
    mesh.loadOBJFile(quadFileContents).then(() => {
      // console.log('inside mesh.loadOBJFile.then()------------------------------------------------');
      // console.log('mesh.groupName: ', mesh.groupName);
      // console.log('mesh.vertexArray: ', mesh.vertexArray);
      // console.log('mesh.textureCoordinateArray: ', mesh.textureCoordinateArray);
      // console.log('mesh.normalArray: ', mesh.normalArray);
      // console.log('mesh.polygonArray: ', mesh.polygonArray);
      // console.log('mesh.boundingBox: ', mesh.boundingBox);

      drawList.push(mesh);


    }).catch((error) => {
      console.error("Error loading mesh: ", error);
    });


   //   const currentURL = window.location.href;
    //  const url = currentURL.replace('scene', 'white.mtl');  

    // const mesh = new Mesh();
    // mesh.loadOBJFile(fileContent);





      // const currentURL = window.location.href;
      // const url = currentURL.replace('scene', 'white.mtl');  


   //   const url = 'http://localhost:7777/white.mtl';  //TODO: make url path knowledge dynamic w/ string edit
      //const response = await fetch(url);
      // if (!response.ok)
      // {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
  //     const textContent = await response.text();
  //  //   console.log(url + ' content:', textContent);
  //     const plainWhiteMaterial = new Material();
      
      // await plainWhiteMaterial.load(textContent).then(() => {
      //   console.log("material.name ======= ", plainWhiteMaterial.name);
      //   console.log("material.ambientColor ======= ", plainWhiteMaterial.ambientColor);
      //   console.log("material.diffuseColor ======= ", plainWhiteMaterial.diffuseColor);
      //   console.log("material.specularColor ======= ", plainWhiteMaterial.specularColor);
      //   console.log("material.emissiveColor ======= ", plainWhiteMaterial.emissiveColor);
      //   console.log("material.illuminationModel ======= ", plainWhiteMaterial.illuminationModel);

      //   const coordinateArray = [
      //     new Coordinate(new Point3D(0.5, -0.5, 0)), 
      //     new Coordinate(new Point3D(0.5, 0.5, 0)), 
      //     new Coordinate(new Point3D(-0.5, 0.5, 0)),
      //     new Coordinate(new Point3D(-0.5, -0.5, 0))
      //   ];
      //   const globalSingleton = GlobalSingleton.getInstance();
      //   globalSingleton.materialNameObjectMap.set('white', plainWhiteMaterial);





      //   const materialPolygon = new MaterialPolygon(coordinateArray, 'white', null);

      //   drawList.push(materialPolygon);


      // }).catch((error) => {
      //   console.error("Error loading material: ", error);
      // });
















/* works but requires url path knowledge
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
//*/










    } catch (err: any)
    {
      console.error('Error fetching file content:', err);
    }
  };


  // const renderLoop = (): void => {
  //     // if (!this.pause) {
  //     //     // rotate local matrix of the cube
  //     //     this.cube.rotateZ(0.5 * RADIANS);
  
  //     //     // execute the model view 3D pipeline and render the scene
  //     //     this.scene.modelView();
  //     //     this.renderer.render(this.scene);
  //     // }
  //     window.requestAnimationFrame(renderLoop);
  // };



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
