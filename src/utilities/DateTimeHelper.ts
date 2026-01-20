import { StringHelper } from "./StringHelper";

export abstract class DateTimeHelper
{
    /**
     * get current date time as ISO string
     * @returns string of current date time toISOString()
     */
    public static getCurrentISODateTime(): string
    {
        const d = new Date();
        return d.toISOString();  
    }

    /**
     * get filename safe string for a data object
     * @param dateTime {Date} to get filename safe string for
     * @param replacementString {string} to replace spaces and characters that are not filename safe
     * @returns {string} of dateTime with characters that are not filename safe
     */
    public static getFilenameSafeStringForDate(dateTime: Date, replacementString: string): string
    {
        let dateString = dateTime.toISOString();
        dateString = StringHelper.replaceAllCharactersExceptLettersAndNumbers(dateString, replacementString);
        return dateString;
    }

    /**
     * get filename safe string for a the current time and date
     * @param replacementString {string} to replace spaces and characters that are not filename safe
     * @returns {string} of current date and time with characters that are not filename safe
     */
    public static getFilenameSafeStringForCurrentDatetime(replacementString: string): string
    {
        let dateString = DateTimeHelper.getCurrentISODateTime();
        dateString = StringHelper.replaceAllCharactersExceptLettersAndNumbers(dateString, replacementString);
        return dateString;
    }
}