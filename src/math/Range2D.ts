export class Range2D 
{
    public xMin: number;
    public xMax: number;
    public yMin: number;
    public yMax: number;

    public constructor(xMin?: number, xMax?: number, yMin?: number, yMax?: number)
    {
        this.set(xMin, xMax, yMin, yMax);
    }

    /**
     * set values
     * @param xMin {number} world xMin
     * @param xMax {number} world xMax
     * @param yMin {number} world yMin
     * @param yMax {number} world yMax
     */
    public set(xMin?: number, xMax?: number, yMin?: number, yMax?: number): void
    {
        this.xMin = xMin ?? 0;
        this.xMax = xMax ?? 0;
        this.yMin = yMin ?? 0;
        this.yMax = yMax ?? 0;
    }

    /**
     * get x range
     * @returns {number} this.xMax - this.xMin
     */
    public xRange(): number
    {
        return this.xMax - this.xMin;
    }

    /**
     * get y range
     * @returns {number} this.yMax - this.yMin
     */
    public yRange(): number
    {
        return this.yMax - this.yMin;
    }
}