import {StringHelper} from './StringHelper'
export abstract class ArrayHelper
{
    /**
     * check if two arrays contain the same numbers
     * @param {Array<number>} array1 first array to compare
     * @param {Array<number>} array2 second array
     * @param {number} tolerance for numerical rounding errors
     * @returns {boolean}
     */
    public static ArraysContainSameNumbers(array1: Array<number>, array2: Array<number>, tolerance: number): boolean
    {
        let result = true;
        if(array1 == null || array2 == null || array1.length != array2.length)
        {
            result = false;
        }
        else
        {
            for(let i=0; i<array1.length; i++)
            {
                if(Math.abs(array1[i] - array2[i]) > tolerance)
                {
                    result = false;
                    break;
                }
            }
        }
        return result;
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





}