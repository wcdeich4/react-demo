import { Point2D } from "./Point2D";
import { ISize2D } from "./ISize2D";
import { Vector } from "./Vector";
import { ICloneable } from "./ICloneable";
import { Range2D } from "./Range2D";

export class ScreenRangeConverter2D extends Range2D implements ISize2D,  ICloneable<ScreenRangeConverter2D>
{
    private mostRecentCanvasToWorld2DVector: Vector;
    private mostRecentCoordinate2D: Point2D;
    public width: number;
    public height: number;
    public xAspectRatio: number = 0;
    public yAspectRatio: number = 0;

    public constructor(xMin?: number, xMax?: number, yMin?: number, yMax?: number, width?: number, height?: number)
    {
        super();
        this.set(xMin, xMax, yMin, yMax, width, height);
        this.mostRecentCanvasToWorld2DVector = new Vector([0, 0]);
        this.mostRecentCoordinate2D = new Point2D(0,0); // { x:0, y:0};
    }

    /**
     * get range 2D only
     * @returns {Range2D} new range 2D object with same  xMin, xMax, yMin, yMax,
     */
    public getRange2D(): Range2D
    {
        return new Range2D(this.xMin, this.xMax, this.yMin, this.yMax);
    }



    public static Standard(): ScreenRangeConverter2D
    {
        const standard = new ScreenRangeConverter2D(-10, 10, -10, 10);
        return standard;
    }

    /**
     * set values
     * @param xMin {number} world xMin
     * @param xMax {number} world xMax
     * @param yMin {number} world yMin
     * @param yMax {number} world yMax
     * @param width {number} canvas width in pixels
     * @param height {number} canvas height in pixels
     * @param xAspectRatio {number} x AspectRatio
     * @param yAspectRatio {number} y AspectRatio
     */
    public set(xMin?: number, xMax?: number, yMin?: number, yMax?: number, width?: number, height?: number, xAspectRatio?: number, yAspectRatio?: number): void
    {
        this.xMin = xMin ?? 0;
        this.xMax = xMax ?? 0;
        this.yMin = yMin ?? 0;
        this.yMax = yMax ?? 0;
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.xAspectRatio = xAspectRatio ?? 0;
        this.yAspectRatio = yAspectRatio ?? 0;
    }

    /**
     * copy another ScreenRangeConverter2D
     * @param range {ScreenRangeConverter2D} object to copy
     */
    public copy(range: ScreenRangeConverter2D): void
    {
        this.set(range.xMin, range.xMax, range.yMin, range.yMax, range.width, range.height, range.xAspectRatio, range.yAspectRatio);
    }

    /**
     * clone this to get another ScreenRangeConverter2D object
     * @returns {ScreenRangeConverter2D} cloned object
     */
    public clone(): ScreenRangeConverter2D 
    {
        const result = new ScreenRangeConverter2D();
        result.copy(this);
        return result;
    }

    // /**
    //  * set width, height
    //  * @param width {number} canvas width in pixels
    //  * @param height {number} canvas height in pixels
    //  */
    // public setWidthHeight(width?: number, height?: number)
    // {
    //     this.width = width ?? 0;
    //     this.height = height ?? 0;
    // }

    /**
     * update width, height, xAspectRatio and yAspectRatio
     * @param width {number} canvas width in pixels
     * @param height {number} canvas height in pixels
     */
    public resize(width: number, height: number): void
    {
        this.width = width ;
        this.height = height;

        this.yAspectRatio = height / this.yRange() ;
        this.xAspectRatio = width / this.xRange() ;
    }


    /**
     * Get the world Vector 2D co-ordinate for canvas x and y co-ordinates
     * @param x {number} canvas x co-ordinate
     * @param y {number} canvas y co-ordinate
     * @returns {Vector} world 2D co-ordinate
     */
    public canvasToWorld2D(x: number, y: number): Vector
    {
        this.mostRecentCanvasToWorld2DVector.elements[0] = x / this.xAspectRatio - Math.abs(this.xMin);
        this.mostRecentCanvasToWorld2DVector.elements[1] = Math.abs(this.yMin) - y / this.yAspectRatio  ;
        return this.mostRecentCanvasToWorld2DVector;
    }

    // /**
    //  * Get the 2D world Complex Number for canvas x and y co-ordinates
    //  * @param x {number} canvas x co-ordinate
    //  * @param y {number} canvas y co-ordinate
    //  * @returns {ComplexPoint} world 2D co-ordinate
    //  */
    // public canvasToWorld2DComplex(x: number, y: number): ComplexPoint
    // {
    //     this.mostRecentCanvasToWorld2DComplex.x = x / this.xAspectRatio - Math.abs(this.xMin);
    //     this.mostRecentCanvasToWorld2DComplex.y = Math.abs(this.yMin) - y / this.yAspectRatio  ;
    //     return this.mostRecentCanvasToWorld2DComplex;
    // }

    /**
     * Get the 2D world canvas x and y co-ordinates
     * @param x {number} canvas x co-ordinate
     * @param y {number} canvas y co-ordinate
     * @returns {Coordinate2D} world 2D co-ordinate
     */
    public canvasToWorld2DCoordinates(x: number, y: number): Point2D
    {
        this.mostRecentCoordinate2D.x = x / this.xAspectRatio - Math.abs(this.xMin);
        this.mostRecentCoordinate2D.y = Math.abs(this.yMin) - y / this.yAspectRatio  ;
        return this.mostRecentCoordinate2D;
    }

    /**
     * convert 2D world cordinate x to Canvas x
     * @param x world two dimensional coordinate for x
     * @returns canvas coordinate for x
     */
    public world2DXtoCanvasX(x: number): number
    {
        return this.xAspectRatio * ( x + Math.abs(this.xMin) )  ;
    }

    /**
     * convert 2D world cordinate y to Canvas y
     * @param x world two dimensional coordinate for y
     * @returns canvas coordinate for y
     */
    public world2DYtoCanvasY(y: number): number
    {
        return this.yAspectRatio * (  this.yMax - y )  ;
    }

    /**
     * check for data
     * @returns {boolean} true if data is present
     */
    
    public hasData(): boolean
    {
        return ((this.xMax != 0) || (this.xMin != 0) || (this.yMax != 0) || (this.yMin != 0))
    }

    public log(): void
    {
        // console.log('set range:  this.xMin = ' + this.xMin  )
        // console.log('set range:  this.xMax = ' + this.xMax  )
        // console.log('set range:  this.yMin = ' + this.yMin  )
        // console.log('set range:  this.yMax = ' + this.yMax  )
console.log('inside ScreenRangeConverter2D.log');

        for(let key in this)
        {

            
            if (this.hasOwnProperty(key) && typeof (this[key]) != 'function' && Object.getOwnPropertyDescriptor(this, key).writable != false  )
            {
                console.log(key + ' = ' + this[key] );
            }
        }
    }

    public conciseJSON(): string
    {
        return JSON.stringify(this, ['xMin', 'xMax',  'yMin', 'yMax', 'width', 'height', 'xAspectRatio', 'yAspectRatio'  ]);
    }

    /**
     * get distance betwewen pixels on the screen, in the X direction
     * @returns {number} this.xRange() / this.width;
     */
    public getScreenDeltaX(): number
    {
        return this.xRange() / this.width;
    }

    /**
     * get distance between pixelso n the screen in the Y direction
     * @returns {number} this.yRange() / this.height;
     */
    public getScreenDeltaY(): number
    {
        return this.yRange() / this.height;
    }



}