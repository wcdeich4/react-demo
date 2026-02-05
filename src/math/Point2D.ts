import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { ICloneable } from "./ICloneable";
import { Matrix } from "./Matrix";

export class Point2D extends EquatableWithTolerance implements ICloneable<Point2D> {
    constructor(x?: number, y?: number) {
        super();
        this.set(x, y);
    }

    public x: number;
    public y: number;

    /**
     * set
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     */
    public set(x?: number, y?: number): void {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    /**
     * Add complex number to this one
     * @param {Point2D} other - the other point you want to add to this one
     */
    public add(other: Point2D): void {
        this.x += other.x;
        this.y += other.y;
    }

    /**
     * Subtract complex number from this one
     * @param {Point2D} other - the other point you want to subtract from this one
     */
    public subtract(other: Point2D): void {
        this.x -= other.x;
        this.y -= other.y;
    }

    /**
     * Multiply this complex number by a scalar
     * @param {number} scalar scalar number to multilpy this point by
     */
    public multiplyByScalar(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }

    /**
     * Divide this complex number by a scalar
     * @param {number} scalar scalar number to divide this point by
     */
    public divideByScalar(scalar: number): void {
        this.x /= scalar;
        this.y /= scalar;
    }
    
    /**
     * get Point3D length
     * @returns {number} magnitude of the point
     */
    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y );
    }

    /**
     * make the radius of this complex number 1
     */
    public normalize(): void {
        const mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
    }

    /**
     * get perpendicular Point2D in clockwise direction
     * @returns {Point2D}
     */
    public getPerpendicularClockwise(): Point2D {
        return new Point2D(this.y, -this.x);
    }

    /**
     * get perpendicular Point2D in counter-clockwise direction
     * @returns {Point2D}
     */
    public getPerpendicularCounterClockwise(): Point2D {
        return new Point2D(-this.y, this.x);
    }

    /**
     * transform this Point2D by mulitplying it on the left side of matrix m, and updating this Point2D. Alters this object.
     * @param {Matrix} m generic matrix of numbers or any sub class
     * @returns {Point2D} this point times m
     */
    public transformLeftOfMatrix(m: Matrix): void {
        const x = this.x * m.elements[0][0] + this.y * m.elements[1][0];
        const y = this.x * m.elements[0][1] + this.y * m.elements[1][1];
        this.x = x;
        this.y = y;
    }

    /**
     * Get midpoint between this Point2D and other.  Does not modify this Point2D.
     * @param other {Point2D} other Point2D to get midpoint with.
     * @returns {Point2D} midpoint
     */
    public getMidPointWith(other: Point2D): Point2D {
        let result = this.clone();
        result.add(other);
        result.multiplyByScalar(0.5);
        return result;
    }

    /**
     * find the distance from this Point2D to another Point2D
     * @param {Point2D} other the other Point2D to find the distance to
     * @returns {number} the distance
     */
    public getDistanceTo(other: Point2D): number {
        const d1 = other.x - this.x;
        const d2 = other.y - this.y;
        return Math.sqrt(d1 * d1 + d2 * d2);
    }

    /**
     * copy another Point2D times a coefficient to this instance of Point2D, with arbitary limit. Modifies this object.
     * @param {number} coefficient to multiply other Point2D by.
     * @param {Point2D} other - the Point2D to add to this Point2D
     */
    public copyFromPoint2DWithCoefficient(coefficient: number, other: Point2D): void {
        this.x = coefficient * other.x;
        this.y = coefficient * other.y;
    }

    /**
     * Add another Point2D times a coefficient to this instance of Point2D, with arbitary limit. Modifies this object.
     * @param {number} coefficient to multiply other Point2D by.
     * @param {Point2D} other - the Point2D to add to this Point2D
     */
    public addPoint2DWithCoefficient(coefficient: number, other: Point2D): void {
        this.x += coefficient * other.x;
        this.y += coefficient * other.y;
    }

    /**
     * implement ICloneable
     * @returns new Point2D with the same values as this one.
     */
    public clone(): Point2D {
        return new Point2D(this.x, this.y);
    }

    public equals(obj: any): boolean {
        if (obj == null) {
            return false;
        }
        else if (typeof obj === 'undefined') {
            return false;
        }
        else if (typeof obj === 'string') {
            try {
                const other = <Point2D>JSON.parse(obj);
                return this.equalsPoint(other);
            }
            catch (error) {
                console.warn('inside Point2D.equals(obj: any), <Point2D>JSON.parse(obj) threw error ');
                console.warn(error);
                return false;
            }
        }
        else if (obj instanceof Point2D) {
            return this.equalsPoint(obj);
        }
        else {
            return false;
        }
    }

    /**
     * compare this Point to another Point
     * @param {Point2D} other point to compare to
     * @returns boolean
     */
    private equalsPoint(other: Point2D): boolean {
        return (Math.abs(this.x - other.x) <= EquatableWithTolerance.Tolerance) && (Math.abs(this.y - other.y) <= EquatableWithTolerance.Tolerance);
    }

    //TODO: Point3D
    //        ToColumnMatrix function
}