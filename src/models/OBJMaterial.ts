import { StringHelper } from "../utilities/StringHelper";
import { ColorHelper } from "../utilities/ColorHelper";

export class OBJMaterial
{
    public name: string;
    public  illuminationModel: number = 4; // illum file keyword ignored by Three.js ? 
    public specularExponent: number = 0; //0 to 1000
    public dissolve: number = 1; //1.0 means fully opaque
    public opticalDensity: number = 1;  //0.001 to 10.  1.0 means light does not bend as it passes through an object. Higher values increase the amount of bending. Glass is about 1.5 
	public textureIndex: number = -1;  // -1 means none
    public ambientColor: string;
    public diffuseColor: string;
    public specularColor: string;
    public emissiveColor: string

    /**
     * load line from a Wavefront MTL file
     * @param materialFileContents {string} mtl file line
     */
    public load(materialFileContents: string): void
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
                this.ambientColor = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(linesArray[i]);
            }
            else if (currentLineTokens[0] === 'kd')
            {
                this.diffuseColor = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(linesArray[i]);
            }
            else if (currentLineTokens[0] === 'ks')
            {
                this.specularColor = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(linesArray[i]);
            }
            else if (currentLineTokens[0] === 'ke')
            {
                this.emissiveColor = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(linesArray[i]);
            }
            else if (currentLineTokens[0] === 'tf')
            {
                console.error('error: imposing a transparent color r*255 g*255 b*255 onto a texture is not yet supported. Please implement.')
            }
            else if (currentLineTokens[0].startsWith('map_')) //map_Kd
            {
                throw new Error('Texture loading not yet implemented. Please complete');
            }
            else
            {
                console.warn('unrecoginized line in Material.load(materialFileContents: string) - ' + linesArray[i]);
            }


        }
    }


}