import { IndexTriplet } from '../models/IndexTriplet';
import {ArrayHelper} from './ArrayHelper'
import {StringHelper} from './StringHelper'
export abstract class OBJHelper
{
    private static objFileElementTypes: Map<string, string>;

    public static getOBJFileElementTypes(): Map<string, string>
    {
      if (OBJHelper.objFileElementTypes == null)
      {
        OBJHelper.objFileElementTypes = new Map<string, string>();
        OBJHelper.objFileElementTypes.set("f", "face");
        OBJHelper.objFileElementTypes.set("l", "line");
        OBJHelper.objFileElementTypes.set("o", "object");
        OBJHelper.objFileElementTypes.set("p", "point");
        OBJHelper.objFileElementTypes.set("g", "group");
        OBJHelper.objFileElementTypes.set("s", "smooth");
        OBJHelper.objFileElementTypes.set("curv", "curve");
        OBJHelper.objFileElementTypes.set("surf", "surface");
      }
      return OBJHelper.objFileElementTypes ;
    }

    // /**
    //  * 
    //  * @param objFileContent OBJ Wavefront filecontents
    //  * @returns Three.BufferGeometry
    //  */
    // public static loadOBJDataFromString(objFileContent: string): THREE.BufferGeometry
    // {
    //     const geometry = new THREE.BufferGeometry();
    //     try
    //     {
    //         const linesArray: Array<string> = objFileContent.split(/\r?\n/);
    //         let numberOfVerticies: number = 0;
    //         numberOfVerticies = ArrayHelper.countElementsThatStartWith(linesArray, 'v');
    //         const vertexArray = new Float32Array(3 * numberOfVerticies);
    //         let vertexArrayIndex: number = 0;

            
    //         let temporaryTextureCoordinateArray = new Array<number>();
    //         let temporaryNormalArray = new Array<number>();
 
    //         let temporaryTripleIndexArray = new Array<IndexTriplet>();
    //  //       let indexArrayIndex: number = 0;

    //  // need 3-tuple temp index array 

    //         let currentLine: string = null;
    //         let currentLineTokens: Array<string> = null;
    //         let currentLineSubTokens: Array<string> = null;
            
    //         for(let i:number = 0; i<linesArray.length; i++ )
    //         {
    //             currentLine = linesArray[i];

    //             if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(currentLine ))
    //             {
    //                 console.log("line " + i + " was undefined/null/whitespace");
    //             }
    //             else if (currentLine.startsWith('#'))
    //             {
    //               console.log('line ' + i + ' is comment : ' + currentLine);
    //             }
    //             else 
    //             {
    //               currentLineTokens = currentLine.split(/\s+/);
    //               currentLineTokens = currentLineTokens.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
                  
    //               if (currentLineTokens[0] =='vt')
    //               {
    //                 if (currentLineTokens.length != 3)
    //                 {
    //                   throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a texture coordinate line in an obj file');
    //                 }
    //                 try 
    //                 {
    //                   //remember currentLineTokens[0] is 'vt'
    //                   for (let index = 1; index < currentLineTokens.length; index++) 
    //                   {
    //                     //use x y class?
    //                     //add    public setFromOJFileLine(line: string): string  method to RealNumberVector.ts????
    //                     //or make it more generic ?
    //                     temporaryTextureCoordinateArray.push(parseFloat(currentLineTokens[index]));
                        
    //                   }
                      
                      
    //                   //textureCoordinateArray.pushStringArray(currentLineTokens, 1, currentLineTokens.length - 1);
    //                 } 
    //                 catch (error) 
    //                 {
    //                   throw new Error('Error pushing texture coordinate data into textureCoordinateArray.  Data line: ' + linesArray[i] + ' Error: ' + error.message); //re-throw with more info
    //                 }
    //               }

    //               else if (currentLineTokens[0] === 'vn')
    //               {
    //                 if (currentLineTokens.length != 4)
    //                 {
    //                   throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a normal vector line in an obj file');
    //                 }
    //                 try 
    //                 {
    //                   //remember currentLineTokens[0] is 'vn'
    //                   for (let index = 1; index < currentLineTokens.length; index++) 
    //                   {
    //                     temporaryNormalArray.push(parseFloat(currentLineTokens[index]));

    //                   }
                      
    //                   //normalArray.pushStringArray(currentLineTokens, 1, currentLineTokens.length - 1);
    //                 } 
    //                 catch (error) 
    //                 {
    //                   throw new Error('Error pushing normal vector data into normalArray.  Data line: ' + linesArray[i] + ' Error: ' + error.message); //re-throw with more info
    //                 }
    //               }

    //               else if (currentLineTokens[0] === 'v')
    //               {
    //                 if ((currentLineTokens.length < 3) || (currentLineTokens.length > 4))  //are 2D obj files possible??
    //                 {
    //                   throw new Error('line ' + i + ' has ' + currentLineTokens.length + ' whitespace separated tokens, which is not valid for a vertex line in an obj file');
    //                 }
    //                 try 
    //                 {
    //                   //remember currentLineTokens[0] is 'v'
    //                   for (let index = 1; index < currentLineTokens.length; index++) 
    //                   {
    //                     vertexArray[vertexArrayIndex] = parseFloat(currentLineTokens[index]);
    //                     vertexArrayIndex++
    //                   }


    //                   //vertexArray.pushStringArray(currentLineTokens, 1, currentLineTokens.length - 1);
    //                 } 
    //                 catch (error) 
    //                 {
    //                   throw new Error('Error pushing vertex data into vertexArray.  Data line: ' + linesArray[i] + ' Error: ' + error.message); //re-throw with more info
    //                 }
    //               }
    //               else if (currentLineTokens[0] === 'f')
    //               {
    //                 //todo: convert quad to triangles

    //                 while(!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(currentLine))
    //                 {
    //                   let newIndexTriplet: IndexTriplet = new IndexTriplet();
    //                   currentLine = newIndexTriplet.setFromOBJFileLine(currentLine);
    //                   temporaryTripleIndexArray.push(newIndexTriplet);
    //                 }
    //               }
    //               else 
    //               {
    //                 console.log('line ' + i + ' was not recoginized : ' + linesArray[i]);
    //               }
    
    
    //             }
    
    
 
    
                
    //         }

    //         const indexArray: Array<number> = new Array<number>(vertexArray.length);
    //         const normalArray: Float32Array = new Float32Array(vertexArray.length);
    //         const textureCoordinateArray: Float32Array = new Float32Array(2 * numberOfVerticies);

    //         throw new Error('TODO: copy data');
    //         //see copy example in manyaltesting.component.ts
    //         //remember -1 index does not exist

    //         geometry.setAttribute(
    //           'position',
    //           new THREE.BufferAttribute(vertexArray, 3));
      
    //       geometry.setAttribute(
    //           'normal',
    //           new THREE.BufferAttribute(normalArray, 3));
      
    //       geometry.setAttribute(
    //           'uv',
    //           new THREE.BufferAttribute(textureCoordinateArray, 2));
      
    //           geometry.setIndex(indexArray);

    //           console.log("indexArray = " + indexArray)
      
    //     }
    //     catch(e2)
    //     {
    //         console.error("error in string split and loop: " + e2);
    //     }

    //     return geometry;
    // }
}