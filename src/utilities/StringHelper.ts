export abstract class StringHelper
{
    /**
     * true if input is undefined, null or only whitespace characters, else false
     * @param {string} input 
     */
    public static isUndefinedOrNullOrEmptyOrWhitespace(input: string): boolean
    {
        return (typeof input === "undefined") || (input === null) || (input.trim().length === 0);
    }

    /**
     * based on https://www.codegrepper.com/code-examples/javascript/how+to+check+if+a+var+is+number+in+typescript
     * @param {string} input string to be tested if it is numberic or not
     */
    public static isNumeric(input: string): boolean
    {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(input);
    }

    /**
     * Replace all characters in input string except numbers or letters
     * @param input {string} with characters to be replaced
     * @param replacementString {string} to replace other characters with
     * @returns {string} with all characters that are not letters or numbers replaced
     */
    public static replaceAllCharactersExceptLettersAndNumbers(input: string, replacementString: string): string
    {
        let result = input;
        if (!StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(input))
        {
            result = input.replace(/[^a-z0-9]/gi, replacementString);
        }
        return result;
    }
}