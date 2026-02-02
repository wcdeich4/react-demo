import { AreCoLinear } from '../math/AreCoLinear';
import { Vector } from '../math/Vector';
import { IMathDrawable } from './IMathDrawable';
import { Pixel } from './Pixel';
import { ScreenRangeConverter2D } from '../math/ScreenRangeConverter2D';
import { Coordinate } from './Coordinate';
import { Circle } from './Circle';

export class MathCanvas2D {
    public range: ScreenRangeConverter2D;
    public applySafetyChecks: boolean = true;
    public drawAxies2D: boolean = true;
    public xAxisColor: string | CanvasGradient | CanvasPattern = 'white';
    public yAxisColor: string | CanvasGradient | CanvasPattern = 'white';
    public backgroundColor: string | CanvasGradient | CanvasPattern | null = null;
    public drawableArray: Array<IMathDrawable> = new Array<IMathDrawable>();
    public canvasRenderingContext2D: CanvasRenderingContext2D;
    private controlPoint1: Vector;
    private controlPoint2: Vector;

    //prevent new variable instantiation to save precious memory fps
    // private xAspectRatio: number = 0;
    // private yAspectRatio: number = 0;
    private canvasX1: number;
    private canvasY1: number;
    private canvasX2: number;
    private canvasY2: number;
    private canvasX3: number;
    private canvasY3: number;

    public constructor(canvas: CanvasRenderingContext2D, canvasRange?: ScreenRangeConverter2D, backgroundColor: string | CanvasGradient | CanvasPattern | null = null) {
        this.canvasRenderingContext2D = canvas;
        if (canvasRange != null) {
            this.setRange(canvasRange);
        }
        this.backgroundColor = backgroundColor;
        this.controlPoint1 = new Vector([0, 0]);
        this.controlPoint2 = new Vector([0, 0]);
    }

    /**
     * update x and y aspect ratios and width and height
     */
    public onresize(): void {
        if (this.range != null) {
            this.range.resize(this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
        }
    }

    /**
     * get width
     * @returns this.canvasRenderingContext2D.canvas.width
     */
    public getWidth(): number {
        return this.canvasRenderingContext2D.canvas.width;
    }

    /**
     * get height
     * @returns this.canvasRenderingContext2D.canvas.height
     */
    public getHeight(): number {
        return this.canvasRenderingContext2D.canvas.height;
    }

    /**
     * remove all elements in the drawable array by setting the length to zero
     */
    public emptyDrawableArray(): void {
        this.drawableArray.length = 0;
    }

    /**
     * fill background with the background color
     */
    public fillWithBackgroundColor(): void {
        this.canvasRenderingContext2D.fillStyle = this.backgroundColor;
        this.canvasRenderingContext2D.fillRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
    }

    /**
     * draw all the objects in the drawableArray in order
     */
    public draw(): void {
        this.Erase();

        if (this.backgroundColor != null) {
            this.canvasRenderingContext2D.fillStyle = this.backgroundColor;
            this.canvasRenderingContext2D.fillRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
        }

        if (this.drawAxies2D) {
            this.drawLineWorld2D(this.range.xMin, 0, this.range.xMax, 0, this.xAxisColor);
            this.drawLineWorld2D(0, this.range.yMin, 0, this.range.yMax, this.yAxisColor);
        }
        this.drawableArray.forEach(d => d.draw(this));
    }

    /**
     * Set range. The this.range variable needs to be private so we can enforce this.onresize() to be called every time it is set.
     * @param range {ScreenRangeConverter2D} xMin, xMax, yMin, yMax for the size of the canvas pixels
     */
    public setRange(range: ScreenRangeConverter2D): void {
        this.range = range;
        this.onresize();
    }

    /**
     * get the current range object.  The this.range variable needs to be private so we can enforce this.onresize() to be called every time it is set.
     * @returns {ScreenRangeConverter2D} this.range
     */
    public getRange(): ScreenRangeConverter2D {
        return this.range;
    }

    /**
     * set range values and calculatePixelsPerUnit() if possible 
     * @param xMin minimum x
     * @param xMax maximum x
     * @param yMin minimum y
     * @param yMax maximum y
     */
    public setRangeValues(xMin: number, xMax: number, yMin: number, yMax: number): void {
        if (this.range == null) {
            let newRrange = new ScreenRangeConverter2D(xMin, xMax, yMin, yMax);
            this.setRange(newRrange);
        }
        else {
            this.range.set(xMin, xMax, yMin, yMax);
            this.onresize();
        }

    }



    public AutoScaleHeightToMatchWidth(): void {
        let heightOverWidth: number = this.canvasRenderingContext2D.canvas.height / this.canvasRenderingContext2D.canvas.width;
        this.range.yMax *= heightOverWidth;
        this.range.yMin *= heightOverWidth;

        //TODO: handle non-centered ranges
        this.onresize();
    }


    public AutoScaleWidthToMatchHeight(): void {
        //TODO: handle non-centered ranges
        let widthOverHeight: number = this.canvasRenderingContext2D.canvas.width / this.canvasRenderingContext2D.canvas.height;
        this.range.xMax = this.range.yMax * widthOverHeight;
        this.range.xMin = this.range.yMin * widthOverHeight;
        this.onresize();
    }

    /**
     * clear contents of the canvas
     */
    public Erase(): void {
        this.canvasRenderingContext2D.clearRect(0, 0, this.canvasRenderingContext2D.canvas.width, this.canvasRenderingContext2D.canvas.height);
    }

    /**
     * draw triangle in World 2D coordinates
     * @param {number} x1 x-coordinate 1
     * @param {number} y1 y-coordinate 1
     * @param {number} x2 x-coordinate 2
     * @param {number} y2 y-coordinate 2
     * @param {number} x3 x-coordinate 3
     * @param {number} y3 y-coordinate 3
     * @param {string | CanvasGradient | CanvasPattern} color fill style
     */
    public drawTriangleWorld2D(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string | CanvasGradient | CanvasPattern): void {
        let drawLineInstead: boolean = this.applySafetyChecks && AreCoLinear.twoDimensional(x1, y1, x2, y2, x3, y3);
        if (drawLineInstead) {
            //Even thought these points are co-linear, there is no guarantee what order they are in, so we don't know which point is the one in the middle, and doing the math to find the point in the middle woudl take more time than just drawing two line segments
            this.drawTriangleOutlineWorld2D(x1, y1, x2, y2, x3, y3, color);
        }
        else {
            this.canvasX1 = this.range.world2DXtoCanvasX(x1);
            // console.log("X1 = " + this.canvasX1);
            this.canvasY1 = this.range.world2DYtoCanvasY(y1);
            console.log("Y1 = " + this.canvasY1);

            this.canvasX2 = this.range.world2DXtoCanvasX(x2);
            //  console.log("X2 = " + this.canvasX2);
            this.canvasY2 = this.range.world2DYtoCanvasY(y2);
            //  console.log("Y2 = " + this.canvasY2);

            this.canvasX3 = this.range.world2DXtoCanvasX(x3);
            //  console.log("X3 = " + this.canvasX3);
            this.canvasY3 = this.range.world2DYtoCanvasY(y3);
            console.log("Y3 = " + this.canvasY3);

            this.canvasRenderingContext2D.beginPath();
            this.canvasRenderingContext2D.fillStyle = color;
            this.canvasRenderingContext2D.moveTo(this.canvasX1, this.canvasY1);
            this.canvasRenderingContext2D.lineTo(this.canvasX2, this.canvasY2);
            this.canvasRenderingContext2D.lineTo(this.canvasX3, this.canvasY3);
            this.canvasRenderingContext2D.closePath();
            this.canvasRenderingContext2D.fill();
        }
    }

    /**
     * draw triangle outline in World 2D coordinates
     * @param {number} x1 x-coordinate 1
     * @param {number} y1 y-coordinate 1
     * @param {number} x2 x-coordinate 2
     * @param {number} y2 y-coordinate 2
     * @param {number} x3 x-coordinate 3
     * @param {number} y3 y-coordinate 3
     * @param {string | CanvasGradient | CanvasPattern} color fill style
     */
    public drawTriangleOutlineWorld2D(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: string | CanvasGradient | CanvasPattern): void {
        this.drawLineWorld2D(x1, y1, x2, y2, color);
        this.drawLineWorld2D(x2, y2, x3, y3, color);
        this.drawLineWorld2D(x3, y3, x1, y1, color);
    }

    /**
     * draw line segment array of verticies in world 2D
     * For speed sake, no safety checks are done
     * @param {string | CanvasGradient | CanvasPattern} color stroke style
     * @param {...Array<Vector>} coordinateArray Array of Vector
     */
    public drawLineSegmentcoordinateArrayWorld2D(color: string | CanvasGradient | CanvasPattern, ...coordinateArray: Array<Vector>): void {
        for (let i = 0; i < coordinateArray.length - 1; i++) {
            this.drawLineWorld2D(coordinateArray[i].elements[0], coordinateArray[i].elements[1], coordinateArray[i + 1].elements[0], coordinateArray[i + 1].elements[1], color);
        }
    }

    //refrences: 
    //https://stackoverflow.com/questions/4774172/image-mapping-in-canvas
    //https://www.youtube.com/watch?v=XHT23NnW-EY
    //https://github.com/FuzzyCat444/Simple3DJavaScript
    //https://www.youtube.com/watch?v=1pGowJqNmH0
    public drawImageVarArgCanvasXY(image: HTMLImageElement, coordinateArray: Array<Coordinate>): void { 
        const u0 = coordinateArray[0].texturePercentage.x * image.width;
        const v0 = coordinateArray[0].texturePercentage.y * image.height;
        const x0 = coordinateArray[0].vertex.elements[0];
        const y0 = coordinateArray[0].vertex.elements[1];

        const u1 = coordinateArray[1].texturePercentage.x * image.width;
        const v1 = coordinateArray[1].texturePercentage.y * image.height;
        const x1 = coordinateArray[1].vertex.elements[0];
        const y1 = coordinateArray[1].vertex.elements[1];

        const u2 = coordinateArray[2].texturePercentage.x * image.width;
        const v2 = coordinateArray[2].texturePercentage.y * image.height;
        const x2 = coordinateArray[2].vertex.elements[0];
        const y2 = coordinateArray[2].vertex.elements[1];

        this.canvasRenderingContext2D.save();
        this.canvasRenderingContext2D.beginPath();
        this.canvasRenderingContext2D.moveTo(coordinateArray[0].vertex.elements[0], coordinateArray[0].vertex.elements[1]);
        for (let i = 1; i < coordinateArray.length; i++) {
            this.canvasRenderingContext2D.lineTo(coordinateArray[i].vertex.elements[0], coordinateArray[i].vertex.elements[1]);
        }
        this.canvasRenderingContext2D.closePath();
        this.canvasRenderingContext2D.clip();

        //   // TODO: eliminate common subexpressions.
        var denom = u0 * (v2 - v1) - u1 * v2 + u2 * v1 + (u1 - u2) * v0;
        if (denom == 0) {
            console.error("denom = 0 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }
        var m11 = - (v0 * (x2 - x1) - v1 * x2 + v2 * x1 + (v1 - v2) * x0) / denom;
        var m12 = (v1 * y2 + v0 * (y1 - y2) - v2 * y1 + (v2 - v1) * y0) / denom;
        var m21 = (u0 * (x2 - x1) - u1 * x2 + u2 * x1 + (u1 - u2) * x0) / denom;
        var m22 = - (u1 * y2 + u0 * (y1 - y2) - u2 * y1 + (u2 - u1) * y0) / denom;
        var dx = (u0 * (v2 * x1 - v1 * x2) + v0 * (u1 * x2 - u2 * x1) + (u2 * v1 - u1 * v2) * x0) / denom;
        var dy = (u0 * (v2 * y1 - v1 * y2) + v0 * (u1 * y2 - u2 * y1) + (u2 * v1 - u1 * v2) * y0) / denom;
        this.canvasRenderingContext2D.transform(m11, m12, m21, m22, dx, dy);
        this.canvasRenderingContext2D.drawImage(image, 0, 0);
        this.canvasRenderingContext2D.restore();
    }

    /**
     * draw line in World 2D coordinates
     * @param x1 x coordinate 1
     * @param y1 y coordinate 1
     * @param x2 x coordinate 2
     * @param y2 y coordinate 2
     * @param color {string | CanvasGradient | CanvasPattern} stroke style
     */
    public drawLineWorld2D(x1: number, y1: number, x2: number, y2: number, color: string | CanvasGradient | CanvasPattern): void {
        //no!  a single point line (degenerate line) is not srawn by default by HTML5 canvas!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if ((x1 == x2) && (y1 == y2)) {
            //TODO: add drawPoint for circle
            this.drawPixelWorld2DCoordinates(x1, y1, color);
        }
        else {
            this.canvasX1 = this.range.world2DXtoCanvasX(x1);
            this.canvasY1 = this.range.world2DYtoCanvasY(y1);

            this.canvasX2 = this.range.world2DXtoCanvasX(x2);
            this.canvasY2 = this.range.world2DYtoCanvasY(y2);

            this.canvasRenderingContext2D.strokeStyle = color;
            this.canvasRenderingContext2D.beginPath();
            this.canvasRenderingContext2D.moveTo(this.canvasX1, this.canvasY1);
            this.canvasRenderingContext2D.lineTo(this.canvasX2, this.canvasY2);
            this.canvasRenderingContext2D.stroke();
        }
    }

    /**
     * fill a single pixel in World 2D coordinates from Vector
     * @param {Vector} point coordinates
     * @param {string | CanvasGradient | CanvasPattern} color fill style
     */
    public drawPixelWorld2DCoordinatesFromVector(point: Vector, color: string | CanvasGradient | CanvasPattern): void {
        this.drawPixelWorld2DCoordinates(point.elements[0], point.elements[1], color)
    }

    /**
     * draw pixel object
     * @param {Pixel} p pixel to draw
     */
    public drawPixelWorld2D(p: Pixel): void {
        this.drawPixelWorld2DCoordinates(p.x, p.y, p.color);
    }

    /**
     * fill a single pixel in World 2D coordinates
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @param color {string | CanvasGradient | CanvasPattern} fill style
     */
    public drawPixelWorld2DCoordinates(x: number, y: number, color: string | CanvasGradient | CanvasPattern): void {
        this.canvasX1 = this.range.world2DXtoCanvasX(x);
        this.canvasY1 = this.range.world2DYtoCanvasY(y);
        //    console.log('X1 = ' + this.canvasX1);
        this.canvasRenderingContext2D.fillStyle = color;
        this.canvasRenderingContext2D.fillRect(this.canvasX1, this.canvasY1, 1, 1);
    }

    /**
     * draw circle in World 2D coordinates
     * @param {Circle} circle object to draw
     */
    public drawCircleWorld2DCoordinates(circle: Circle): void {
        this.canvasX1 = this.range.world2DXtoCanvasX(circle.elements[0]);
        this.canvasY1 = this.range.world2DYtoCanvasY(circle.elements[1]);  
        this.canvasRenderingContext2D.fillStyle = circle.color;
        this.canvasRenderingContext2D.beginPath();
        this.canvasRenderingContext2D.arc(this.canvasX1, this.canvasY1, circle.radius, 0, 2 * Math.PI);
        this.canvasRenderingContext2D.fill();
    }

    public drawPixelCanvas2D(p: Pixel): void {
        this.canvasRenderingContext2D.fillStyle = p.color;
        this.canvasRenderingContext2D.fillRect(p.x, p.y, 1, 1);
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo
     * https://www.w3schools.com/html/html5_canvas.asp
     * https://medium.com/free-code-camp/nerding-out-with-bezier-curves-6e3c0bc48e2f
     * https://www.codeproject.com/Articles/31859/Draw-a-Smooth-Curve-through-a-Set-of-2D-Points-wit
     * https://people.math.sc.edu/Burkardt/f_src/spline/spline.html
     * https://math.stackexchange.com/questions/301736/how-do-i-find-a-bezier-curve-that-goes-through-a-series-of-points
     * @param {Vector} P0 First point already transfotmed to Canvas 2D Coordinates
     * @param {Vector} P1 Second point already transfotmed to Canvas 2D Coordinates
     * @param {Vector} P2 Third point already transfotmed to Canvas 2D Coordinates
     * @param {Vector} P3 Fourth point already transfotmed to Canvas 2D Coordinates
     * @param {string | CanvasGradient | CanvasPattern} color to draw
     */
    public bezierCurveThrough4Points(P0: Vector, P1: Vector, P2: Vector, P3: Vector, color: string | CanvasGradient | CanvasPattern): void {
        //use this.controlPoint1 and this.controlPoint2 to hold the control points
        //C0 = P0
        //C1 = (1/9)*( -10*P0 + 24*P1 -  8*P2 +  3*P3 )
        //C2 = (1/9)*(   3*P0 -  8*P1 + 24*P2 - 10*P3 )
        // C3 = P3
        this.controlPoint1.copyFromVectorWithCoefficientAndLimit(-10, P0, 2); // C1 = -5*P0
        this.controlPoint1.addVectorWithCoefficientAndLimit(24, P1, 2); // C1 = C1 + 18 * P1
        this.controlPoint1.addVectorWithCoefficientAndLimit(-8, P2, 2); // C1 = C1 - 9 * P2
        this.controlPoint1.addVectorWithCoefficientAndLimit(3, P3, 2); // C1 = C1 + 2 * P3
        this.controlPoint1.multiplyByScalar(1 / 9); // C1 = C1 / 6

        this.controlPoint2.copyFromVectorWithCoefficientAndLimit(3, P0, 2); // C2 = 2 * P0
        this.controlPoint2.addVectorWithCoefficientAndLimit(-8, P1, 2); // C2 = C2 - 9*P1)
        this.controlPoint2.addVectorWithCoefficientAndLimit(24, P2, 2); //C2 = C2 + 18*P2 
        this.controlPoint2.addVectorWithCoefficientAndLimit(-10, P3, 2); //C2 = C2 -5*P3
        this.controlPoint2.multiplyByScalar(1 / 9); // C2 = C2 / 6

        console.log('C2 = ');
        this.controlPoint2.log();

        this.canvasRenderingContext2D.strokeStyle = color;
        this.canvasRenderingContext2D.beginPath();
        this.canvasRenderingContext2D.moveTo(P0.elements[0], P0.elements[1]);

        this.canvasRenderingContext2D.bezierCurveTo(this.controlPoint1.elements[0], this.controlPoint1.elements[1], this.controlPoint2.elements[0], this.controlPoint2.elements[1], P3.elements[0], P3.elements[1]);
        //  this.canvasRenderingContext2D.bezierCurveTo(0,0, 0, 0, P3.elements[0], P3.elements[1]);
        this.canvasRenderingContext2D.stroke();
        this.canvasRenderingContext2D.closePath();


        //move to, then bezier to!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1

        // this.canvasRenderingContext2D.moveTo(P0.elements[0], P0.elements[1], 
    }


    // /**
    //  * protected helper method to convert 2D world cordinate x to Canvas x
    //  * @param x world two dimensional coordinate for x
    //  * @returns canvas coordinate for x
    //  */
    // protected world2DXtoCanvasX(x: number): number
    // {
    //     //return this.canvasRenderingContext2D.canvas.width * ( x + Math.abs(this.range.xMin) )  / this.range.xRange() ;
    //     return this.xAspectRatio * ( x + Math.abs(this.range.xMin) )  ;
    // }


    // /**
    //  * protected helper method to convert 2D world cordinate y to Canvas y
    //  * @param x world two dimensional coordinate for y
    //  * @returns canvas coordinate for y
    //  */
    // protected world2DYtoCanvasY(y: number): number
    // {
    //     return this.yAspectRatio * (  this.range.yMax - y )  ;
    // }




}