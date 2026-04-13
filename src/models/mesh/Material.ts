import { StringHelper } from "../../utilities/StringHelper";
import { ColorHelper } from "../../utilities/ColorHelper";
import { ArrayHelper } from "../../utilities/ArrayHelper";
import { Light } from "../Light";

export class Material
{

//TODO: global singleton material library to avoid loading the same material multiple times for different objects that use the same material.
    public name: string;  //TODO: default to file name



 //   public textureImageFilePath: string|null = null;
    
    public textureImageElement: HTMLImageElement|null = null;
    
    //public textureIndex: number = -1;  // -1 means none

    //TODO: fix mistake!!!!!!!!!!!! The HTML5 canvas fill style is only 1 string & there is no way to average 4 different color strings!  So, gotta store them as number arrays, then combine them somehow, then convert to canvas style string
    public ambientColor: Array<number>; //Ka in .mtl files
    public diffuseColor: Array<number>; //Kd in .mtl files
    public specularColor: Array<number>; //Ks in .mtl files
    public emissiveColor: Array<number>; //Ke in .mtl files

    //TODO: use advanced material properties
    public illuminationModel: number = 4; // illum
    public specularExponent: number = 0; //0 to 1000
    public dissolve: number = 1; //1.0 means fully opaque 
    public opticalDensity: number = 1;  //0.001 to 10.  1.0 means light does not bend as it passes through an object. Higher values increase the amount of bending. Glass is about 1.5 
	





    /**
     * usage:
        const material = new Material();
        await material.loadTexture('/path/to/texture.png');
        console.log(material.textureImageElement);
     * @param textureImageFilePath 
     * @returns {Promise<void>}
     */
    public async loadTexture(textureImageFilePath: string|null): Promise<void> {
        if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(textureImageFilePath)) {
            return;
        }

        if (typeof Image === 'undefined') {
            // Running in Node / test environment where browser Image is not available.
            return;
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = textureImageFilePath;

        await new Promise<void>((resolve, reject) => {
            image.onload = () => {
                this.textureImageElement = image;
                resolve();
            };
            image.onerror = () => {
                reject(new Error(`Failed to load texture image from ${textureImageFilePath}`));
            };
        });
    }

    /**
     * load line from a Wavefront MTL file
     * @param {string} materialFileContents mtl file line
     */
    public async load(materialFileContents: string): Promise<void>
    {
        let linesArray: Array<string> = materialFileContents.split(/\r?\n/);
        linesArray = linesArray.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
        let currentLineTokens: Array<string> = null;
        for(let i:number = 0; i<linesArray.length; i++ )
        {
         //   currentLine = linesArray[i];
            currentLineTokens = linesArray[i].split(/(\s+)/);
            currentLineTokens = currentLineTokens.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
            currentLineTokens[0] = currentLineTokens[0].toLowerCase();
            if (currentLineTokens[0] === '#')
            {
                console.log("Material.load(materialFileContents: string) - line " + i + " is comment: " + linesArray[i] );
            }
            else if (currentLineTokens[0] === 'newmtl')
            {
                this.name = currentLineTokens[1];
            }
            else if (currentLineTokens[0] === 'illum')
            {
                this.illuminationModel = parseFloat(currentLineTokens[1]);
            }
            else if (currentLineTokens[0] === 'ni')
            {
                this.opticalDensity = parseFloat(currentLineTokens[1]);
            }
            else if (currentLineTokens[0] === 'ns')
            {
                this.specularExponent = parseFloat(currentLineTokens[1]);
            }
            else if ((currentLineTokens[0] === 'tr') || (currentLineTokens[0] === 'd'))
            {
                this.dissolve = parseFloat(currentLineTokens[1]);
            }
            else if (currentLineTokens[0] === 'ka')
            {
                this.ambientColor = ArrayHelper.stringArrayToNumberArray(currentLineTokens, 1, 3);
            }
            else if (currentLineTokens[0] === 'kd')
            {
                this.diffuseColor = ArrayHelper.stringArrayToNumberArray(currentLineTokens, 1, 3);
            }
            else if (currentLineTokens[0] === 'ks')
            {
                this.specularColor = ArrayHelper.stringArrayToNumberArray(currentLineTokens, 1, 3);
            }
            else if (currentLineTokens[0] === 'ke')
            {
                this.emissiveColor = ArrayHelper.stringArrayToNumberArray(currentLineTokens, 1, 3);
            }
            else if (currentLineTokens[0] === 'tf')
            {
                console.error('error: imposing a transparent color r*255 g*255 b*255 onto a texture is not yet supported. Please implement.')
            }
            else if (currentLineTokens[0].startsWith('map_')) //map_Kd
            {
                await this.loadTexture(currentLineTokens[1]);
            }
            else
            {
                console.warn('cannot recoginize line ' + i + ' in Material.load(materialFileContents: string) - ' + linesArray[i]);
            }


        }
    }


}