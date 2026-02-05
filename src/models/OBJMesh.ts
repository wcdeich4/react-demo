import { StringHelper } from "../utilities/StringHelper";
import { Point3D } from "../math/Point3D";

export class OBJMesh
{
    public materialIndex: number;
    public vertexArray: Array<Point3D>;
    public normalArray: Array<Point3D>;
    public textureCoordinateArray: Array<Point3D>;

    public constructor(objFileContents?: string)
    {
        this.materialIndex = -1;
        this.vertexArray = new Array<Point3D>();
        this.normalArray = new Array<Point3D>();
        this.textureCoordinateArray = new Array<Point3D>();

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
                    let textureCoordinate: Point3D = new Point3D(0,0,0);
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
                    let perpendicularPoint3D: Point3D = new Point3D(0,0,0);
                    perpendicularPoint3D.setFromDelimetedString(linesArray[i]);
                    this.normalArray.push(perpendicularPoint3D);
                }
                catch (e)
                {
                    let errorMessage: string = 'error 002 in OBJMesh.loadOBJFile(objFileContent: string).  Could not parse string ' + linesArray[i] + '  as normal Point3D.  Error: ' + e;
                    console.error(e);
                    throw new Error(errorMessage);
                }
            }
            else if (linesArray[i].startsWith('v '))
            {
                try 
                {
                    let vertex: Point3D = new Point3D(0,0,0);
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
   //     const numberOfNormalPoint3Ds = ArrayHelper.countElementsThatStartWith(linesArray, 'vn ');

         
    }

    
}