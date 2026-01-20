import { Range2D } from "./Range2D";

export class Range3D extends Range2D 
{
    public zMin: number;
    public zMax: number;

    public constructor(xMin?: number, xMax?: number, yMin?: number, yMax?: number)
    {
        super();
        this.set(xMin, xMax, yMin, yMax);
    }

    /**
     * set values
     * @param xMin {number} world xMin
     * @param xMax {number} world xMax
     * @param yMin {number} world yMin
     * @param yMax {number} world yMax
     * @param zMin {number} world zMin
     * @param zMax {number} world zMax
     */
    public set(xMin?: number, xMax?: number, yMin?: number, yMax?: number, zMin?: number, zMax?: number): void
    {
        this.xMin = xMin ?? 0;
        this.xMax = xMax ?? 0;
        this.yMin = yMin ?? 0;
        this.yMax = yMax ?? 0;
        this.zMin = zMin ?? 0;
        this.zMax = zMax ?? 0;
    }

    /**
     * get z range
     * @returns {number} this.zMax - this.zMin
     */
    public zRange(): number
    {
        return this.zMax - this.zMin;
    }
}

