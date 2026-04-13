import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { ICloneable } from "./ICloneable";

export class Point3D extends EquatableWithTolerance implements ICloneable<Point3D>
{
    public x: number; //inheriting from Point2D would require overriding methods not needed by Point3D
    public y: number;
    public z: number;
    /**
     * constructor
     * @param {Array<number>|null} array1D array of numbers or null
     * @param {number|null} numberOfElement number or null
     */
    constructor(x: number, y: number, z: number)
    {
        super();
        this.set(x,y,z);
    }

    /**
     * get the average of an array of Point3D objects.  Useful for finding the center of a face.  Static method so it can be used in Polygon.getCenter() without creating a Point3D object first.
     * @param {Array<Point3D>} points array of Point3D objects to get the average of
     * @returns {Point3D} the average Point3D of the array of Point3D objects
     */
    public static average(points: Array<Point3D>): Point3D
    {
        let sumX: number = 0;
        let sumY: number = 0;
        let sumZ: number = 0;
        for(let i = 0; i < points.length; i++)
        {
            sumX += points[i].x;
            sumY += points[i].y;
            sumZ += points[i].z;
        }
        const averageX: number = sumX / points.length;
        const averageY: number = sumY / points.length;
        const averageZ: number = sumZ / points.length;
        return new Point3D(averageX, averageY, averageZ);
    }

    //generic methods
    /**
     * set
     * @param {number} x co-ordinate
     * @param {number} y co-ordinate
     * @param {number} z co-ordinate
     */
    public set(x: number, y: number, z: number): void
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * get Point3D as array of numbers with x, y, z in order
     * @returns {Array<number>} array of numbers with x, y, z in order
     */
    public toArray(): number[]
    {
        return [this.x, this.y, this.z];
    }    

    /**
     * get Point3D as string with x, y, z in order
     * @returns {string} string with x, y, z in order
     */
    public toString(): string
    {
        return'<' + this.x +  ', ' + this.y +  ', ' + this.z +  '>' ;
    }

    /**
     * log the Point3D to console in format <x, y, z>
     */
    public log(): void
    {
        console.log(this.toString());
    }

    /**
     * true if z component is zero
     * @returns boolean
     */
    public is2D(): boolean
    {
        return this.z === 0;
    }

    /**
     * use the current Point3D as the eye/camera, and test if it can see a face for backface culling. Optimized for 3D. Temporary arrays save memory though reuse.
     * @param {Array<Point3D>} faceVertexArray 
     * @param {Array<number>} temporaryDifferenceArray1 
     * @param {Array<number>} temporaryDifferenceArray2 
     * @param {Array<number>} temporaryCrossProductArray 
     * @returns {boolean}
     */
    public canSee(faceVertexArray: Array<Point3D>, temporaryDifferenceArray1: Array<number>, temporaryDifferenceArray2: Array<number>, temporaryCrossProductArray: Array<number>): boolean
    {
        //unrolled loop subtraction
        //faceVertexArray[1] - faceVertexArray[0]
        temporaryDifferenceArray1[0] = faceVertexArray[1].x - faceVertexArray[0].x;
        temporaryDifferenceArray1[1] = faceVertexArray[1].y - faceVertexArray[0].y;
        temporaryDifferenceArray1[2] = faceVertexArray[1].z - faceVertexArray[0].z;

        //faceVertexArray[2] - faceVertexArray[1]
        temporaryDifferenceArray2[0] = faceVertexArray[2].x - faceVertexArray[1].x;
        temporaryDifferenceArray2[1] = faceVertexArray[2].y - faceVertexArray[1].y;
        temporaryDifferenceArray2[2] = faceVertexArray[2].z - faceVertexArray[1].z;

        //inefficient? 
        Point3D.crossProductArrays(temporaryDifferenceArray1, temporaryDifferenceArray2, temporaryCrossProductArray);

        //dot product unrolled
        return 0 <= this.x * temporaryCrossProductArray[0] + this.y * temporaryCrossProductArray[1]  + this.z * temporaryCrossProductArray[2]; 
    }

    /**
     * static method for cross product with number arrays.
     * @param {Array<number>} Point3DArray1 
     * @param {Array<number>} Point3DArray2 
     * @param {Array<number>} resultArray 
     */
    public static crossProductArrays(Point3DArray1: Array<number>, Point3DArray2: Array<number>, resultArray: Array<number>): void
    {
        resultArray[0] = Point3DArray1[1] * Point3DArray2[2] - Point3DArray1[2] * Point3DArray2[1] ;
        resultArray[1] = Point3DArray1[2] * Point3DArray2[0] - Point3DArray1[0] * Point3DArray2[2] ;
        resultArray[2] = Point3DArray1[0] * Point3DArray2[1] - Point3DArray1[1] * Point3DArray2[0] ;
    }

    /**
     * Get the right handed cross product of this Point3D and another Point3D
     * @param {Point3D} other to get cross product with
     * @returns {Point3D} right handed cross product Point3D
     */
    public crossProduct(other: Point3D): Point3D
    {
        return new Point3D(this.y * other.z - this.z * other.y ,
                            this.z * other.x - this.x * other.z ,
                            this.x * other.y - this.y * other.x);
    }

    /**
     * get Point3D length
     * @returns {number} magnitude of the Point3D
     */
    public magnitude(): number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * scale Point3D to length of 1
     */
    public normalize(): void
    {
        let mag = this.magnitude();
        if (mag !== 0)
        {
            this.x /= mag;
            this.y /= mag;
            this.z /= mag;
        }
    }

    /**
     * negate this Point3D
     */
    public negate(): void
    {
        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;
    }

    /**
     * get a new Point3D with value of this Point3D negated without modifying this Point3D
     * @returns {Point3D} negated Point3D
     */
    public getNegated(): Point3D
    {
        const result = this.clone();
        result.negate();
        return result;
    }

    /***
     * Dot Product of this and another Point3D.  For length mismatch, it treats shorter Point3Ds as longer Point3Ds with as many zero value elements as necessary.
     * @param {Point3D} other - the Point3D to dot product multiply with this Point3D
     * @returns number
     */
    public dotProduct(other: Point3D): number
    {
        return this.x * other.x + this.y * other.y  + this.z * other.z;
    }

    /***
     * Add another Point3D to this instance of Point3D. Modifies this object. Treats shorter Point3Ds as longer Point3Ds with as many zero value elements as necessary.
     * @param {Point3D} other - the Point3D to add to this Point3D
     */
    public add(other: Point3D): void
    {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
    }

    /**
     * Create new Point3D equal to the sum of this Point3D and other without modifying this Point3D or ther other. Does not modifies this object. Treats shorter Point3Ds as longer Point3Ds with as many zero value elements as necessary.
     * @param {Point3D} other - the Point3D to get sum with
     * @returns {Point3D} new Point3D with sum of this Point3D and other Point3D
     */
    public getSumWith(other: Point3D): Point3D
    {
        const result = this.clone();
        result.add(other);
        return result;
    }

    /***
     * Subtract another Point3D from this instance of Point3D. Modifies this object. Treats shorter Point3Ds as longer Point3Ds with as many zero value elements as necessary.
     * @param {Point3D} other - the Point3D to subtract from this Point3D
     */
    public subtract(other: Point3D): void
    {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
    }

    /**
     * Create new Point3D equal to the this Point3D minus other without modifying this Point3D or ther other. Does not modifies this object. Treats shorter Point3Ds as longer Point3Ds with as many zero value elements as necessary.
     * @param {Point3D} other - the Point3D to get difference with
     * @returns {Point3D} new Point3D equal to this Point3D minus other Point3D
     */
    public getDifferenceWith(other: Point3D): Point3D
    {
        const result = this.clone();
        result.subtract(other);
        return result;
    }

    /***
     * multiply this instance of Point3D by a scalar.  Changes this Point3D.
     * @param {number} scalar - number to multiply the Point3D elements by 
     */
    public multiplyByScalar(scalar: number): void
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    //make version that does not change this Point3D & has a limit !

    /***
     * divide this instance of Point3D by a scalar.  Changes this Point3D.
     * @param {number} scalar - number to divide the Point3D elements by 
     */
    public divideByScalar(scalar: number): void
    {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    //make version that does not change this Point3D??

    /**
     * implement ICloneable
     * @returns new Point3D with the same values as this one.
     */
    public clone(): Point3D
    {
        return new Point3D(this.x, this.y, this.z);
    }

    /**
     * implement EquatableWithTolerance.equals
     * @param {any} obj to compare to
     * @returns {boolean} true if equal within tolerance, false otherwise
     */
    public equals(obj: any): boolean
    {
        let result = false;
        if (obj == null || typeof obj === 'undefined') {
            return false;
        }
        else if (typeof obj === 'string') {
            try {
                const other = <Point3D>JSON.parse(obj);
                return this.equalsPoint(other);
            }
            catch (error) {
                console.warn('inside Point2D.equals(obj: any), <Point2D>JSON.parse(obj) threw error ');
                console.warn(error);
                return false;
            }
        }
        else if (obj instanceof Point3D)
        {
            result = this.equalsPoint(obj);
        }
        else
        {
            result =  false;
        }
        return result;
    }

    /**
     * compare this Point to another Point
     * @param {Point3D} other point to compare to
     * @returns boolean
     */
    private equalsPoint(other: Point3D): boolean
    {
        return (Math.abs(this.x - other.x) < EquatableWithTolerance.Tolerance)
        && (Math.abs(this.y - other.y) < EquatableWithTolerance.Tolerance)
        && (Math.abs(this.z - other.z) < EquatableWithTolerance.Tolerance);
    }


}