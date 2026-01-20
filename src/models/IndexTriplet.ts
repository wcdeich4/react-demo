import {StringHelper} from '../utilities/StringHelper'

export class IndexTriplet
{
    constructor(vertexIndex?: number, textureCoordinateIndex?: number, normalIndex?: number)
    {
      this.vertexIndex = vertexIndex ?? -1;
      this.textureCoordinateIndex = textureCoordinateIndex ?? -1;
      this.normalIndex = normalIndex ?? -1;
    }
    public vertexIndex: number = -1;
    public textureCoordinateIndex: number = -1;
    public normalIndex: number = -1;

    /**
     * set the indices from a line of an OBJ file
     * @param {string} line a line of an OBJ file
     * @returns rest of the line after eating off part with data needed
     * @throws Error if line is undefined / null / empty string / whitespace / does not contain necessary data
     */
    public setFromOBJFileLine(line: string): string
    {
      let returnValue: string = '';
      if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(line))
      {
        let errorMessage: string = 'line undefined / null / empty string / whitespace in IndexTriplet.SetFromOBJFileLine(line: string): string'; 
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      else
      {
        //remove letter at beginning of string
        let stringStartIndex: number = 0;
        while (!StringHelper.isNumeric(line[stringStartIndex]))
        {
          stringStartIndex++;
        }
        line = line.substring(stringStartIndex);

        let currentLineTokens: Array<string> = line.split(/(\s+)/);
        currentLineTokens = currentLineTokens.filter(a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
        
        let currentOBJElementToken = currentLineTokens[0];

        let numberOfSlashes:number = (currentOBJElementToken.match(/\//g) || []).length;

      
        if (numberOfSlashes == 0) //position index only
        {
          if (StringHelper.isNumeric(currentOBJElementToken))
          {
            this.vertexIndex = parseInt(currentOBJElementToken);
          }
          else
          {
            console.warn("warning: could not interpret " + currentOBJElementToken + " as an OBJ Element Vertex Index");
          }
        }
        else
        {
          let currentOBJElementIndices: Array<string> = currentOBJElementToken.split('/').filter(Boolean); //filter removes any empty elements from array
          if (currentOBJElementIndices.length == 3)
          {
            this.vertexIndex = parseInt(currentOBJElementIndices[0]);
            this.textureCoordinateIndex = parseInt(currentOBJElementIndices[1]);
            this.normalIndex = parseInt(currentOBJElementIndices[2]);
          }
          else if (currentOBJElementIndices.length == 2)
          {
            if (currentOBJElementToken.includes('//')) 
            {
              this.vertexIndex = parseInt(currentOBJElementIndices[0]);
              this.textureCoordinateIndex = -1;
              this.normalIndex = parseInt(currentOBJElementIndices[1]);
            }
            else
            {
              this.vertexIndex = parseInt(currentOBJElementIndices[0]);
              this.textureCoordinateIndex = parseInt(currentOBJElementIndices[1]);
              this.normalIndex = -1;
            }
          }
          else
          {
            throw Error(line + ' does not appear to be formatted correctly for an OBJ object element line');
          }
        }

        //returnValue is the rest of the line string - if anything left
        if (currentLineTokens.length > 1)
        {
          for (let i = 1; i < currentLineTokens.length; i++)
          {
            returnValue = returnValue + currentLineTokens[i] + ' ';
          }
        }
      }

      return returnValue;
    }
}
