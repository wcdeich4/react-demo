import { StringHelper } from "../utilities/StringHelper";
import { Vector } from "../math/Vector";

export class OBJMesh
{
    public materialIndex: number;
    public vertexArray: Array<Vector>;
    public normalArray: Array<Vector>;
    public textureCoordinateArray: Array<Vector>;

    public constructor(objFileContents?: string)
    {
        this.materialIndex = -1;
        this.vertexArray = new Array<Vector>();
        this.normalArray = new Array<Vector>();
        this.textureCoordinateArray = new Array<Vector>();

    }

    //TODO:  sort for painter's algorithm & camera angle polymorphism


    /**
     * Load .obj file contents
     * @param objFileContent {string} full contents of a Wavefront OBJ model file
     */
    public loadOBJFile(objFileContent: string): void
    {
        let linesArray: Array<string> = objFileContent.split(/\r?\n/);
        linesArray = linesArray.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));

        //todo: ensure lowercase

        for(let i:number = 0; i < linesArray.length; i++ )
        {
            if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(linesArray[i] ))
            {
                console.log("line " + i + " was undefined/null/whitespace");
            }
            else if (linesArray[i].startsWith('#'))
            {
              console.log('line ' + i + ' is comment : ' + linesArray[i]);
            }
            else if (linesArray[i].startsWith('vt '))
            {
                try 
                {
                    let textureCoordinate: Vector = new Vector();
                    textureCoordinate.setFromDelimetedString(linesArray[i]);
                    this.textureCoordinateArray.push(textureCoordinate);
                }
                catch (e)
                {
                    let errorMessage: string = 'error 001 in OBJMesh.loadOBJFile(objFileContent: string).  Could not parse string ' + linesArray[i] + '  as TextureCoordinate.  Error: ' + e;
                    console.error(e);
                    throw new Error(errorMessage);
                }
            }
            else if (linesArray[i].startsWith('vn '))
            {
                try 
                {
                    let perpendicularVector: Vector = new Vector();
                    perpendicularVector.setFromDelimetedString(linesArray[i]);
                    this.normalArray.push(perpendicularVector);
                }
                catch (e)
                {
                    let errorMessage: string = 'error 002 in OBJMesh.loadOBJFile(objFileContent: string).  Could not parse string ' + linesArray[i] + '  as normal vector.  Error: ' + e;
                    console.error(e);
                    throw new Error(errorMessage);
                }
            }
            else if (linesArray[i].startsWith('v '))
            {
                try 
                {
                    let vertex: Vector = new Vector();
                    vertex.setFromDelimetedString(linesArray[i]);
                    this.vertexArray.push(vertex);
                }
                catch (e)
                {
                    let errorMessage: string = 'error 003 in OBJMesh.loadOBJFile(objFileContent: string).  Could not parse string ' + linesArray[i] + '  as vertex.  Error: ' + e;
                    console.error(e);
                    throw new Error(errorMessage);
                }

                

            }

            //TODO faces!!!!!........ support points & lines are part of mesh????? I guess....
        }

        //probably not needed - actually wrong - even numberOfVerticies bc we need to repeat for index-less BufferGeometry
 //       const numberOfVerticies = ArrayHelper.countElementsThatStartWith(linesArray, 'v ');
  //      const numberTextureCoordinates = ArrayHelper.countElementsThatStartWith(linesArray, 'vt ');
   //     const numberOfNormalVectors = ArrayHelper.countElementsThatStartWith(linesArray, 'vn ');

         
    }

    
}