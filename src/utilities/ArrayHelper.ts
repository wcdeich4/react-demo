import {StringHelper} from './StringHelper'
export abstract class ArrayHelper
{
    /**
     * splits input string and returns array of all tokens that can be converted to numbers
     * @param {string} input string to be split
     * @param {string|RegExp} separator string or regular expression to split the string
     * @returns array of numbers
     */
    public static stringToNumberArray(input: string, separator: string | RegExp): Array<number>
    {
        const stringTokenArray: Array<string> = input.split(separator);
        return ArrayHelper.stringArrayToNumberArray(stringTokenArray, 0);
    }

    /**
     * takes an array of strings and converts all elements to numbers that can be converted to numbers and returns an array of numbers
     * @param stringTokenArray an array of strings
     * @param startIndex array index to start at
     * @returns array of numbers
     */
    public static stringArrayToNumberArray(stringTokenArray: Array<string>, startIndex: number): Array<number>
    {
        const outputNumberArray: Array<number> = new Array<number>(); 
        for(let i:number = startIndex; i < stringTokenArray.length; i++ )
        {
            if (StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(stringTokenArray[i]))
            {
                continue;
            }

            if (!StringHelper.isNumeric(stringTokenArray[i]))
            {
                console.log('Warning in ArrayHelper.stringToNumberArray(input: string): Array<number> - token ' + stringTokenArray[i] + ' is not a number');
                continue;
            } 

            try
            {
                const newNumber = parseFloat(stringTokenArray[i]);
                if (isNaN(newNumber))
                {
                    console.warn('Warning in ArrayHelper.stringToNumberArray(input: string): Array<number> - token ' + stringTokenArray[i] + ' is not a number');
                }
                else
                {
                    outputNumberArray.push(newNumber);
                }
            }
            catch(e)
            {
                console.error('Error in ArrayHelper.stringToNumberArray(input: string): Array<number> ' + e.toString());
            }
        }
        return outputNumberArray;
    }

    /**
     * count the strings in an array that contain a substring, case insensitive
     * @param arrayToAnalyze array of strings
     * @param stringToFind string
     * @returns number
     */
    public static countElementsThatContain(arrayToAnalyze: Array<string>, stringToFind: string): number
    {
        let count: number = 0;
        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(stringToFind)
        && (typeof arrayToAnalyze != 'undefined') && (arrayToAnalyze != null) && (arrayToAnalyze.length > 0))
        {
            stringToFind = stringToFind.trim();
            stringToFind = stringToFind.toLowerCase();
            arrayToAnalyze.forEach(element => {
                 if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(stringToFind))
                 {
                     const lowercaseTrimmedElement = element.trim().toLowerCase();
					 if(lowercaseTrimmedElement.indexOf(stringToFind) > -1)
                     {
                        count++;
                     }
                 }
                });
            
        }
        return count;
    }

    /**
     * count the strings in an array that start with a substring, case insensitive
     * @param arrayToAnalyze array of strings
     * @param stringToFind string
     * @returns number
     */
    public static countElementsThatStartWith(arrayToAnalyze: Array<string>, stringToFind: string): number
    {
        let count: number = 0;
        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(stringToFind)
        && (typeof arrayToAnalyze != 'undefined') && (arrayToAnalyze != null) && (arrayToAnalyze.length > 0))
        {
            stringToFind = stringToFind.trim();
            stringToFind = stringToFind.toLowerCase();
            arrayToAnalyze.forEach(element => {
                 if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(stringToFind))
                 {
                     const lowercaseTrimmedElement = element.trim().toLowerCase();
                     if (lowercaseTrimmedElement.startsWith(stringToFind))
                     {
                        count++;
                     }
                 }
                });
            
        }
        return count;
    }


    public static CopyFromNumericArrayToFloat32Array(numericArray: Array<number>, numericArrayStartingIndex: number, numberOfElementsToCopy:number, floatArray: Float32Array, floatArrayStartingIndex: number, floatArraySizeLimit: number): void
    {
        if ((floatArrayStartingIndex + numberOfElementsToCopy) > floatArraySizeLimit)
        {
            throw new Error('Error in ArrayHelper.CopyFromNumericArrayToFloat32Array - (numberOfElementsToCopy + floatArrayStartingIndex) > floatArraySizeLimit');
        }

        let offset:number = 0;
        while(offset < numberOfElementsToCopy )
        {
            if ((floatArrayStartingIndex + offset) >= floatArraySizeLimit)
            {
                throw new Error('Error in ArrayHelper.CopyFromNumericArrayToFloat32Array - (floatArrayStartingIndex + offset) >= floatArraySizeLimit');
            }

            try 
            {
                floatArray[floatArrayStartingIndex + offset] = numericArray[numericArrayStartingIndex + offset] ;
            }
            catch (error) 
            {
                throw new Error('Unexpected Error in ArrayHelper.CopyFromNumericArrayToFloat32Array - floatArrayStartingIndex='+floatArrayStartingIndex + ' numericArrayStartingIndex=' + numericArrayStartingIndex + ' offset=' + offset + ' floatArraySizeLimit=' + floatArraySizeLimit + ' Error String: ' + error.toString());
            }

            offset++;
        }
    }


}