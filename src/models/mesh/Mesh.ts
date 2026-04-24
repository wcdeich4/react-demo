import { StringHelper } from "../../utilities/StringHelper";
import { Point3D } from "../../math/Point3D";
import { Point2D } from "../../math/Point2D";
import { Polygon } from "./Faces/Polygon";
import { Coordinate } from "./Coordinate";
import { Material } from "./Material";
import { Range3D } from "../../math/Range3D";
import { Light } from "../Light";
import { MathCanvas2D } from "../MathCanvas2D";
import { Matrix } from "../../math/Matrix";
import { MaterialPolygon } from "./Faces/MaterialPolygon";
import { IMathDrawable } from "../IMathDrawable";
import { GlobalSingleton } from "../GlobalSingleton";

//TODO: unit test!!!!!!!!!!!!!!!!!11
//safety check indices are less than length of arrays, and greater than or equal to 1 (obj file format is 1 indexed) ?

export class Mesh implements IMathDrawable
{
    private currentMaterialFilePath: string | null;
    private currentMaterialName: string | null;
    public boundingBox: Range3D;
    public groupName: string | null;


    //    public material: Material | null;
    public vertexArray: Array<Point3D>;
    public textureCoordinateArray: Array<Point2D>;
    public normalArray: Array<Point3D>;
    public polygonArray: Array<Polygon>;
    //TODO: add support for other obj file features such as lines, dots, smoothing groups, objects, etc.  Also add support for other file formats such as STL, PLY, etc.

    public constructor(objFileContents?: string)
    {
        this.boundingBox = new Range3D(0, 0, 0, 0, 0, 0);
        this.vertexArray = new Array<Point3D>();
        this.textureCoordinateArray = new Array<Point2D>();
        this.normalArray = new Array<Point3D>();
        this.polygonArray = new Array<Polygon>();
        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(objFileContents))
        {
            this.loadOBJFile(objFileContents, 1, 1, 1);
        }
    }

    //TODO:  sort for painter's algorithm & camera angle polymorphism



    /**
     * Load .obj file contents
     * @param {string} objFileContent full contents of a Wavefront OBJ model file
     * @param {number} xScale scale factor to apply to x component of vertex data
     * @param {number} yScale scale factor to apply to y component of vertex data
     * @param {number} zScale scale factor to apply to z component of vertex data
     */


    //TODO: make async & return promise for material
    public async loadOBJFile(objFileContent: string, xScale: number = 1, yScale: number = 1, zScale: number = 1): Promise<void>  //3 scale factors would distort normals. We would have to make a scale matrix, transpose it & then mulitply the the inverse of the transpose
    {

console.log('objFileContent==================================================== ', objFileContent);

        let linesArray: Array<string> = objFileContent.split(/\r?\n/);
        linesArray = linesArray.filter(a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));

        //loop thru 2x to ensure all vertex data is loaded before face data
        for (let i: number = 0; i < linesArray.length; i++)
        {
            if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(linesArray[i]))
            {
                continue;
            }
            else if (linesArray[i].startsWith('#'))
            {
                console.log('line ' + i + ' is comment : ' + linesArray[i]);
            }
            else
            {
                linesArray[i] = linesArray[i].trim();
                let currentLineTokens = linesArray[i].split(/\s+/); //split on whitespace
                if (currentLineTokens[0] === 'vp')
                {
                    console.error('parametric geometric space verticies not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'g')
                {
                    if (currentLineTokens.length < 2)
                    {
                        throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a group name line in an obj file');
                    }
                    this.groupName = currentLineTokens[1];
                }
                else if (currentLineTokens[0] === 'mtllib')
                {
                    if ((typeof window == 'undefined') || (typeof fetch == 'undefined'))
                    {
                        console.warn('Skipping mtllib load in non-browser test environment: ' + this.currentMaterialFilePath);
                    }
                    else
                    {
                        this.currentMaterialFilePath = currentLineTokens[1];

                        const expectedURL = window.location.origin + '/' + this.currentMaterialFilePath;
                        console.log('expected material file URL: ' + expectedURL);

                        let currentMaterialFileContents: string | null = null;
                        const response = await fetch(expectedURL);
                        if (response.ok)
                        {
                            currentMaterialFileContents = await response.text();

console.log('fetched material file contents from expected URL*********************************** ' + expectedURL, currentMaterialFileContents);

                            this.loadMTLFileAndPushToGlobalSingleton(currentMaterialFileContents);
                        }
                        else
                        {
                            const response = await fetch(this.currentMaterialFilePath);
                            if (response.ok)
                            {
                                currentMaterialFileContents = await response.text();


console.log('fetched material file contents from expected URL~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ' + expectedURL, currentMaterialFileContents);





                                this.loadMTLFileAndPushToGlobalSingleton(currentMaterialFileContents);
                            }
                            else
                            {
                                throw new Error('Failed to fetch material file. Tried URL: ' + expectedURL + ' and ' + this.currentMaterialFilePath + '. HTTP status: ' + response.status);
                            }
                        }
                    }




                }
                else if (currentLineTokens[0] === 'usemtl')
                {
                    this.currentMaterialName = currentLineTokens[1];
                }
                //TODO: make async & return promise for material




                else if (currentLineTokens[0] == 'vt')
                {
                    if (currentLineTokens.length < 3)
                    {
                        throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a texture coordinate line in an obj file');
                    }
                    try
                    {
                        //remember currentLineTokens[0] is 'vt'
                        const u = parseFloat(currentLineTokens[1]);
                        const v = parseFloat(currentLineTokens[2]);
                        this.textureCoordinateArray.push(new Point2D(u, v));
                        //w component ignored if present for now
                    }
                    catch (error: any)
                    {
                        throw new Error('Error pushing texture coordinate data into textureCoordinateArray.  Data line: ' + linesArray[i] + ' Error: ' + error);
                    }
                }
                else if (currentLineTokens[0] === 'vn')
                {
                    if ((currentLineTokens.length < 4) || (currentLineTokens.length > 5))
                    {
                        //is a 2D obj file possible?
                        throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a normal vector line in an obj file. Expected format v x y z [w]');
                    }
                    try
                    {
                        //remember currentLineTokens[0] is 'vn'
                        //normals are transformed by the inverse of the transpose, but the transpose of a pure scale is just the same scale matrix, and to get the inverse of multiplication, just divide
                        const x = parseFloat(currentLineTokens[1]) / xScale;
                        const y = parseFloat(currentLineTokens[2]) / yScale;
                        const z = parseFloat(currentLineTokens[3]) / zScale;
                        //w component ignored if present for now
                        const n = new Point3D(x, y, z);
                        n.normalize(); //don't forget to normalize
                        this.normalArray.push(n);
                    }
                    catch (error: any)
                    {
                        throw new Error('Error pushing normal vector data into normalArray.  Data line: ' + linesArray[i] + ' Error: ' + error);
                    }
                }

                else if (currentLineTokens[0] === 'v')
                {
                    if ((currentLineTokens.length < 3) || (currentLineTokens.length > 4))  //are 2D obj files possible??
                    {
                        throw new Error('line ' + linesArray[i] + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a vertex line in an obj file');
                    }
                    try
                    {
                        //remember currentLineTokens[0] is 'v'
                        const x = parseFloat(currentLineTokens[1]) * xScale;
                        const y = parseFloat(currentLineTokens[2]) * yScale;
                        const z = parseFloat(currentLineTokens[3]) * zScale;
                        this.vertexArray.push(new Point3D(x, y, z));
                        if (x < this.boundingBox.xMin) { this.boundingBox.xMin = x; }
                        else if (x > this.boundingBox.xMax) { this.boundingBox.xMax = x; }
                        if (y < this.boundingBox.yMin) { this.boundingBox.yMin = y; }
                        else if (y > this.boundingBox.yMax) { this.boundingBox.yMax = y; }
                        if (z < this.boundingBox.zMin) { this.boundingBox.zMin = z; }
                        else if (z > this.boundingBox.zMax) { this.boundingBox.zMax = z; }
                    }
                    catch (error: any)
                    {
                        throw new Error('Error pushing vertex data into vertexArray.  Data line: ' + linesArray[i] + ' Error: ' + error);
                    }
                }
            }
        } //end for each line in obj file for vertex, texture coordinate, and normal vector data


        //loop thru again just for polygon face data
        for (let i: number = 0; i < linesArray.length; i++)
        {
            if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(linesArray[i]))
            {
                continue;
            }
            else if (linesArray[i].startsWith('#'))
            {
                console.log('line ' + i + ' is comment : ' + linesArray[i]);
            }
            else
            {
                linesArray[i] = linesArray[i].trim();
                let currentLineTokens = linesArray[i].split(/\s+/); //split on whitespace

                //Case for polygonal face. We can copy a reference to the vertex, texture, and normal vector data into the current polygon. This is possible because TypeScript objects are reference types.  If we want to save back to a .obj file, then we must search the arrays to find the indices. Probably better to search starting from the end backwards, just in case there is accidental duplication.
                if (currentLineTokens[0] === 'f')
                {
                    const currentPolygon: MaterialPolygon = new MaterialPolygon();
                    currentPolygon.materialName = this.currentMaterialName;
                    //remember currentLineTokens[0] is 'f'
                    for (let j = 1; j < currentLineTokens.length; j++) //for each currentLineTokens[j]
                    {
                        if (currentLineTokens[j].startsWith('#')) //comment at end of line, ignore rest of line
                        {
                            console.log('line ' + i + ' ends contains comment : ' + linesArray[i]);
                            break;
                        }

                        // const numberOfSlashes:number = (currentLineTokens[j].match(/\//g) || []).length;

                        //interpret the face information
                        else if (currentLineTokens[j].includes('/'))
                        {
                            //if the line token contains '//' the format should be positionIndex//normalVectorIndex
                            if (currentLineTokens[j].includes('//'))
                            {
                                const curentLineSubTokens = currentLineTokens[j].split('//');
                                if ((curentLineSubTokens == null) || (curentLineSubTokens.length != 2))
                                {
                                    throw new Error('Expected OBJ format for position, normal is positionIndex//normalVectorIndex, but found: ' + currentLineTokens[j]);
                                }
                                else
                                {
                                    const currentCoordinate = new Coordinate();
                                    //TODO: throw error if currentVertexIndex is less than 0 or greater than length of vertex array, or if currentNormalVertexIndex is less than 0 or greater than length of normal array ????????????
                                    const currentVertexIndex = parseInt(curentLineSubTokens[0]) - 1; //obj file face indices are listed 1 indexed
                                    //copy refernce to vertex point into current coordinate
                                    currentCoordinate.vertex = this.vertexArray[currentVertexIndex];

                                    const currentNormalVertexIndex = parseInt(curentLineSubTokens[1]) - 1; //obj file face indices are listed 1 indexed
                                    //copy refernce to normal vector into current coordinate
                                    currentCoordinate.normal = this.normalArray[currentNormalVertexIndex];

                                    currentPolygon.coordinateArray.push(currentCoordinate);
                                }
                            }
                            else
                            {
                                //if the token contains / and does not contain // then the format should be positionIndex/textureCoordinateIndex/normalVectorIndex
                                const curentLineSubTokens = currentLineTokens[j].split('/');
                                if ((curentLineSubTokens == null) || (curentLineSubTokens.length != 3))
                                {
                                    throw new Error('Expected OBJ format for position, texture coordinate, normal is positionIndex/textureCoordinateIndex/normalVectorIndex, but found: ' + currentLineTokens[j]);
                                }
                                else
                                {
                                    const currentCoordinate = new Coordinate();

                                    const currentVertexIndex = parseInt(curentLineSubTokens[0]) - 1; //obj file face indices are listed 1 indexed
                                    //copy refernce to vertex point into current coordinate
                                    currentCoordinate.vertex = this.vertexArray[currentVertexIndex];

                                    const currentTextureCoordinateIndex = parseInt(curentLineSubTokens[1]) - 1; //obj file face indices are listed 1 indexed
                                    //copy refernce to texture uv point into current coordinate
                                    currentCoordinate.texturePercentage = this.textureCoordinateArray[currentTextureCoordinateIndex];

                                    const currentNormalVertexIndex = parseInt(curentLineSubTokens[2]) - 1; //obj file face indices are listed 1 indexed
                                    //copy refernce to normal vector into current coordinate
                                    currentCoordinate.normal = this.normalArray[currentNormalVertexIndex];

                                    currentPolygon.coordinateArray.push(currentCoordinate);
                                }
                            }
                        }
                        else
                        {
                            //if there is just a single number it is the geometric vertex index
                            let currentVertexIndex = parseInt(currentLineTokens[j]) - 1; //obj file face indices are listed 1 indexed
                            const vertex = this.vertexArray[currentVertexIndex];
                            const currentCoordinate = new Coordinate();
                            currentCoordinate.vertex = vertex;
                            currentPolygon.coordinateArray.push(currentCoordinate);
                        }

                    } //end for each currentLineTokens[i]
                    this.polygonArray.push(currentPolygon);
                }
                else if (currentLineTokens[0] === 's')
                {
                    console.log('smoothing group information not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'p')
                {
                    console.log('dots not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'l')
                {
                    console.log('lines not yet supported, file line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'curv')
                {
                    console.log('curves not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'surf')
                {
                    console.log('surfaces not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }
                else if (currentLineTokens[0] === 'o')
                {
                    console.log('objects not yet supported, line ' + i + linesArray[i] + ' was ignored');
                }



            }
        } //end for each line in obj file for polygon-face/line/dot/etc data


    }


    public draw(mathCanvas: MathCanvas2D, transformMatrix?: Matrix, inverseTransposedMatrix?: Matrix, lightingArray?: Array<Light>, recalculateCenter?: boolean, recalculateColor?: boolean): void
    {
        for (let i = 0; i < this.polygonArray.length; i++)
        {
            this.polygonArray[i].draw(mathCanvas, transformMatrix, inverseTransposedMatrix, lightingArray, recalculateCenter, recalculateColor);
        }

        //TODO: support lines and dots, ...
    }


    // private async loadMTLFileFromURL(materialFilePath: string): Promise<void>
    // {
    //     const response = await fetch(materialFilePath);
    //     if (!response.ok)
    //     {
    //         throw new Error('Failed to fetch material file: ' + materialFilePath + '. HTTP status: ' + response.status);
    //     }

    //     const currentMaterialFileContents = await response.text();
    //     this.loadMTLFileAndPushToGlobalSingleton(currentMaterialFileContents);
    // }

    protected loadMTLFileAndPushToGlobalSingleton(materialFileContents: string): void
    {
        const currentMaterial = new Material();

console.log('materialFileContents==================================================== ', materialFileContents);


        currentMaterial.load(materialFileContents).then(() =>
        {

            // console.log("material.name ======= ", currentMaterial.name);
            // console.log("material.ambientColor ======= ", currentMaterial.ambientColor);
            // console.log("material.diffuseColor ======= ", currentMaterial.diffuseColor);
            // console.log("material.specularColor ======= ", currentMaterial.specularColor);
            // console.log("material.emissiveColor ======= ", currentMaterial.emissiveColor);
            // console.log("material.illuminationModel ======= ", currentMaterial.illuminationModel);

            const globalSingleton = GlobalSingleton.getInstance();
            globalSingleton.materialNameObjectMap.set(currentMaterial.name, currentMaterial);
        }
        ).catch((error) =>
        {
            console.error("Error loading material: ", error);
        });
    }

}