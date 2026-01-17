
export class AreCoLinear
{
    private constructor()
    {
        //this is intended to be used as a static class
    }

    /**
     * Determine if three 2D points are co-linear
     * based on determinate triangle are method, see 
     * https://www.youtube.com/watch?v=ZlaRewp4Z-A
     * @param x1 {number} X Coordinate of Point1
     * @param y1 {number} Y Coordinate of Point1
     * @param x2 {number} X Coordinate of Point2
     * @param y2 {number} Y Coordinate of Point2
     * @param x3 {number} X Coordinate of Point3
     * @param y3 {number} Y Coordinate of Point3
     * @returns {boolean} true if all three points are colinear in the 2D plain
     */
    public static twoDimensional(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean
    {
        return 0 == x1 * y2 + y1 * x3 + x2 * y3 - y1 * x2 - x3 * y2 - x1 * y3;
    }

}