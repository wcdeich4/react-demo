import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { Matrix } from "./Matrix";

export class Point2D extends EquatableWithTolerance 
{
    constructor(x?: number, y?: number)
    {
        super();
        this.set(x,y);
    }

    public x: number;
    public y: number;

    /**
     * set
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     */
    public set(x?: number, y?: number): void
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    /**
     * set by Point2D object
     * @param {Point2D} coordinate 
     */
    public copyXY(coordinate: Point2D): void
    {
        this.set(coordinate.x, coordinate.y);
    }

    /**
     * multiply this Point2D on the left side of matrix m, and get new Point2D object. Does not alter this Point2D object.
     * @param m {GenericMatrix<number>} generic matrix of numbers or any sub class
     * @returns {Point2D} this point times m
     */
    public multiplyLeftOfMatrix(m: Matrix): Point2D
    {
        const product = new Point2D();
        product.x = this.x * m.elements[0][0] + this.y * m.elements[1][0];
        product.y = this.x * m.elements[0][1] + this.y * m.elements[1][1];
        return product;
    }

    /**
     * compare this Point to another Point
     * @param other {Point2D} to compare to this Point2D
     * @returns boolean
     */
    public equalsPoint(other: Point2D): boolean
    {
        return (Math.abs(this.x - other.x) <= EquatableWithTolerance.Tolerance) && (Math.abs(this.y - other.y) <= EquatableWithTolerance.Tolerance);
    }

    public equals(obj: any): boolean
    {
        if (obj == null)
        {
            return false;
        }
        else if (typeof obj === 'undefined')
        {
            return false;
        }
        else if (typeof obj === 'string')
        {
            try
            {
                const other = <Point2D>JSON.parse(obj);
                return this.equalsPoint(other);
            }
            catch (error)
            {
                console.warn('inside Point2D.equals(obj: any), <Point2D>JSON.parse(obj) threw error ');
                console.warn(error);
                return false;
            }
        }
        else if (obj instanceof Point2D)
        {
            return this.equalsPoint(obj);
        }
        else
        {
            return false;
        }
    }
    
    //TODO: Point3D
    //        ToColumnMatrix function
}