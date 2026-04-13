import { Matrix } from "../../../math/Matrix";
import { ColorHelper } from "../../../utilities/ColorHelper";
import { IMathDrawable } from "../../IMathDrawable";
import { Light } from "../../Light";
import { MathCanvas2D } from "../../MathCanvas2D";
import { Coordinate } from "../Coordinate";
import { Material } from "../Material";
import { Polygon } from "./Polygon";

export class MaterialPolygon extends Polygon implements IMathDrawable
{
  private currentColor?: string | CanvasGradient | CanvasPattern;
  public material?: Material;
  constructor(coords?: Coordinate[], material?: Material)
  {
    super(coords);
    if (material)
    {
      this.material = material;
    }
  }

  /**
   * Calculates the color of the polygon under the current lighting conditions.
   * @param {Array<Light>} lightArray 
   * @param {boolean?} recalculateCenter find center of the polygon again instead of using cached value, to avoid returning a wrong value after the model has been transformed.
   * @returns {string} color of the polygon under the current lighting conditions, in HTML hexadecimal format
   */
  public getColorUnderCurrentLighting(lightArray: Array<Light>, recalculateCenter?: boolean): string
  {
    const currentAmbientColor = [0, 0, 0];
    const currentDiffuseColor = [0, 0, 0];
    const currentSpecularColor = [0, 0, 0];
    for (var i = 0; lightArray && i < lightArray.length; i++)
    {
      //ambient lighting is added to the color regardless of whether the light illuminates the polygon or not, since ambient lighting is supposed to represent indirect light that has bounced around the environment and illuminates all objects equally.

      if(this.material.ambientColor && lightArray[i].ambientColor) //safety check
      {
        currentAmbientColor[0] += this.material.ambientColor[0] * lightArray[i].ambientColor[0];
        currentAmbientColor[1] += this.material.ambientColor[1] * lightArray[i].ambientColor[1];
        currentAmbientColor[2] += this.material.ambientColor[2] * lightArray[i].ambientColor[2];
      }



      //until scan line algorithms are implemented, treat diffuse and specular lighting the same.
      if (lightArray[i].illuminatesPoint(this.getCenter(recalculateCenter)))
      {
        if(this.material.diffuseColor && lightArray[i].diffuseColor) //safety check
        {
          currentDiffuseColor[0] += this.material.diffuseColor[0] * lightArray[i].diffuseColor[0];
          currentDiffuseColor[1] += this.material.diffuseColor[1] * lightArray[i].diffuseColor[1];
          currentDiffuseColor[2] += this.material.diffuseColor[2] * lightArray[i].diffuseColor[2];
        }
        if(this.material.specularColor && lightArray[i].specularColor) //safety check
        { 
          currentSpecularColor[0] += this.material.specularColor[0] * lightArray[i].specularColor[0];
          currentSpecularColor[1] += this.material.specularColor[1] * lightArray[i].specularColor[1];
          currentSpecularColor[2] += this.material.specularColor[2] * lightArray[i].specularColor[2];
        }
      }
    }

    const finalColor = [
      currentAmbientColor[0] + currentDiffuseColor[0] + currentSpecularColor[0] + this.material.emissiveColor[0],
      currentAmbientColor[1] + currentDiffuseColor[1] + currentSpecularColor[1] + this.material.emissiveColor[1],
      currentAmbientColor[2] + currentDiffuseColor[2] + currentSpecularColor[2] + this.material.emissiveColor[2]
    ];

    //cannot have more than 100% of any color, so cap the values at 1
    if (finalColor[0] > 1) finalColor[0] = 1;
    if (finalColor[1] > 1) finalColor[1] = 1;
    if (finalColor[2] > 1) finalColor[2] = 1;

    this.currentColor = ColorHelper.numberArrayToHTMLHexadecimalColorString(finalColor, 0);
    return this.currentColor;
    //TODO: unit test
  }

  public draw(mathCanvas: MathCanvas2D, transformMatrix: Matrix | null = null, inverseTransposedMatrix: Matrix | null = null, lightingArray?: Array<Light>, recalculateCenter?: boolean, recalculateColor?: boolean): void
  {
    if(!this.currentColor ||  recalculateColor ){
      this.currentColor = this.getColorUnderCurrentLighting(lightingArray, recalculateCenter);
    }
    mathCanvas.canvasRenderingContext2D.fillStyle = this.currentColor;
    this.traverseCoordinates(mathCanvas, transformMatrix, inverseTransposedMatrix);
  
    if(this.material && this.material.textureImageElement){
      throw new Error("Texture mapping is not implemented yet. It should be implemented after MaterialPolygon.draw() is implemented.");
    }

    

    // throw new Error("MaterialPolygon.draw() is not implemented yet. It should be implemented after MaterialPolygon.draw() is implemented, since they will share a lot of code, and MaterialPolygon.draw() is more complex to implement.");


    // // 1. Set the fill color
    // mathCanvas.canvasRenderingContext2D.fillStyle = this.color;

    // //TODO: make protected parent method to loop thru all the points

    // // 2. Begin drawing the path
    // mathCanvas.canvasRenderingContext2D.beginPath();
    // let canvasX: number, canvasY: number;
    // let currentCoordinate: Coordinate = this.coordinateArray[0].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
    // canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
    // canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);

    // // 3. Move to the first point in the array
    // mathCanvas.canvasRenderingContext2D.moveTo(canvasX, canvasY);

    // // 4. Loop through the remaining points to draw the sides
    // for (let i = 1; i < this.coordinateArray.length; i++)
    // {
    //   currentCoordinate = this.coordinateArray[i].getMultipliedByMatrixOnRight(transformMatrix, inverseTransposedMatrix);
    //   canvasX = mathCanvas.range.world2DXtoCanvasX(currentCoordinate.vertex.x);
    //   canvasY = mathCanvas.range.world2DYtoCanvasY(currentCoordinate.vertex.y);
    //   mathCanvas.canvasRenderingContext2D.lineTo(canvasX, canvasY);
    // }

    // // 5. Close the path and fill the shape
    // mathCanvas.canvasRenderingContext2D.closePath(); // Connects the last point back to the first
    // mathCanvas.canvasRenderingContext2D.fill();


  }



  //how to handle drawing w/ projection matrix ? parameter for draw method ?????????????????
  //probably draw(mathCanvas, perspectiveMatrix);

  //cramerSolve needs to take an array of polygon faces to avoid taking the determinantes more than 1 time, or else the inverse matrix would be more efficient.

  //Coordinate also needs a multiply by matrix method ?????????????????
  //normal vector also needs to be transformed by the projection matrix inverse?????????????????
  // ------- wait! we do not want to transform the normal vector by the projection matrix at all
  // only modify normals when model changes, specifically rotation &  scale!!!!!!!!!!!!!!!!!!!
  // -------- lighting calculations should be done in world space 3D, so we need do not transform the normal vectors to display the object, only for rotation & scale.
  //but remember to mutlply normal by transpose of inverse matrix if you need to rotate/scale the polygon
  //-->>>>>> good news the inverse of the transpose of a matrix always equals to the transpose of of the inverse of the matrix!    Also, for rotation, transpose = inverse :)
  //MathCanvas2D needs a draw Coordinates method w/ only the coordinate loop that can be reused inside other methods that applied a color, material or image!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


}