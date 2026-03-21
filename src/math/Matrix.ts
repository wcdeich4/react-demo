import { ArrayHelper } from "../utilities/ArrayHelper";
import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { Point3D } from "./Point3D";

export class Matrix extends EquatableWithTolerance
{
    public elements: number[][];
    /**
     * constructor
     * @param {Array<Array<number>>|null} array2D array of array of number or null. Overrides numberOfRows, numberOfColumns
     * @param {number} numberOfRows number of rows, 3 by default
     * @param {number} numberOfColumns number of rows, 3 by de fault
     */
    constructor(array2D: Array<Array<number>>|null = null, numberOfRows: number = 3, numberOfColumns: number = 3)
    {
        super();
        if (array2D == null)
        {
            if (numberOfRows > 0)
            {
                this.elements = new Array<Array<number>>(numberOfRows);
                if (numberOfColumns > 0)
                {
                    for(let i = 0; i < numberOfRows; i++)
                    {
                        this.elements[i] = new Array<number>(numberOfColumns);
                    }
                }
            }
        }
        else 
        {
            this.elements = array2D;
        }

    }

    /** get the number of rows of the matrix */
    public getNumberOfRows(): number
    {
        return this?.elements?.length;
    }

    /** get the number of columns of the matrix */
    public getNumberOfColumns(): number
    {
        return this?.elements[0]?.length;
    }

    /***
     * expand matrix rows if needed
     */
    public ensureEnoughRows(requiredNumberOfRows: number): void
    {
        if (this.elements == null)
        {
            this.elements = new Array<Array<number>>();
        }
        if (requiredNumberOfRows > this.elements.length)
        {
            this.elements.length = requiredNumberOfRows;
        }
    }

    /**
     * JavaScript 2D arrays are inherently jagged, so we have to check column length per row
     * @param {number} rowIndex - current row to check
     * @param {number} requiredNumberOfColumns - of column poistions needed
     */
    public ensureEnoughColumnsInRow(rowIndex: number, requiredNumberOfColumns: number): void
    {
        if (this.elements[rowIndex] == null)
        {
            this.elements[rowIndex] = new Array<number>();
        }
        if (requiredNumberOfColumns > this.elements[rowIndex].length )
        {
            this.elements[rowIndex].length = requiredNumberOfColumns ;
        }
    }

    /**
     * set row in matrix
     * @param {number} rowIndex - index of row to set
     * @param {number[]} row - new row that will be set
     */
    public setRow(rowIndex: number, row: number[]): void
    {
        this.ensureEnoughRows(rowIndex + 1);
        this.elements[rowIndex] = row;
    }

    /**
     * copy one row to another.  Warnings:  overwrites any data in destination row. Watch out for tangled objects if T is not a primitive type!!!
     * @param {number} sourceRowIndex row to copy
     * @param {number} destinationRowIndex row to store to
     */
    public copyRow(sourceRowIndex: number, destinationRowIndex: number): void
    {
        for(let column = 0; column < this.elements[destinationRowIndex].length; column++)
        {
            this.elements[destinationRowIndex][column] = this.elements[sourceRowIndex][column];
        }
    }

    /**
     * set column
     * @param {number} columnIndex - coulmn to set
     * @param {number[]} column - new column
     */
    public setColumn(columnIndex: number, column: number[]): void
    {
        this.ensureEnoughRows(column.length  );
        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) 
        {
            this.ensureEnoughColumnsInRow(rowIndex, columnIndex + 1);
            this.elements[rowIndex][columnIndex] = column[rowIndex];
        }
    }

    /**
     * set element in matrix with safety checks
     * @param {number} rowIndex - row index to set newElement at
     * @param {number} columnIndex - column index to set newElement at
     * @param {number} newElement - new element to set
     */
    public setElement(rowIndex: number, columnIndex: number, newElement: number): void
    {
        this.ensureEnoughRows(rowIndex +1 );
        this.ensureEnoughColumnsInRow(rowIndex, columnIndex + 1);
        this.elements[rowIndex][columnIndex] = newElement;
    }
    
    /**
     * transpose this matrix
     */
    public transpose(): void
    {
        //taking the minimum of rows and columns is a dirty hack.  It prevents an error for non-square matricies, but could result in bad behavior down the road.
        const limit = Math.min(this.getNumberOfRows(), this.getNumberOfColumns());
        let temp: number;
        for(let row=0; row < limit; row++)
        {
            for(let col=0; col < limit; col++)
            {
                if (col < row)
                {
                    temp = this.elements[row][col];
                    this.elements[row][col] = this.elements[col][row] ;
                    this.elements[col][row] = temp; 
                }
            }
        }
		
    }

    /**
     * get dispaly string for matrix
     * @returns {string} matrix string representation
     */
    public toString(): string
    {
        let result = '';
        for (let row = 0; row < this.elements.length; row++)
        {
            result += '[';
            for (let col = 0; col < this.elements[row].length; col++)
            {
                result = result + this.elements[row][col] + ' ';
            }
            result += '[';
        }
        return result;
    }


    /**
     * create look at matrix similar to OpenGL, except row-major math is the default.
     * Only use on 4x3 or larger matricies.  HACK: ignores 4th row for speed, and relies on homogenous efficency hack in transformPoint3DOnRight and MultiplyByArrayOnRight to treat missing 4th row as 0,0,0,1
     * https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL
     * https://medium.com/@carmencincotti/lets-look-at-magic-lookat-matrices-c77e53ebdf78
     * @param {Point3D} cameraPosition camera poisition in 3D cartesian coordinates
     * @param {Point3D} focalPoint point to look at in 3D cartesian coordinates
     * @param {Point3D} upVector up Point3D in 3D cartesian coordinates (approximate is ok)
     * @param {boolean} columnMajor 
     */
    public setLookAtMatrix(cameraPosition: Point3D, focalPoint: Point3D, upVector: Point3D, columnMajor: boolean = false ): void
    {
        const cameraZAxis: Point3D = <Point3D>focalPoint.getDifferenceWith(cameraPosition) as Point3D; //aka forward Point3D
        cameraZAxis.normalize();
        const cameraXAxis: Point3D = cameraZAxis.crossProduct(upVector); //aka right Point3D
        cameraXAxis.normalize();
        const cameraYAxis: Point3D = cameraXAxis.crossProduct(cameraZAxis); //aka camera up ?
        cameraZAxis.negate();

       // this.elements = new Array<Array<number>>(4); skip safety for speed
       // this.elements[0] = [cameraXAxis.x, cameraXAxis.y, cameraXAxis.z,   - cameraXAxis.dotProduct(cameraPosition) ];
        this.elements[0][0] = cameraXAxis.x; 
        this.elements[0][1] = cameraXAxis.y; 
        this.elements[0][2] = cameraXAxis.z; 
        this.elements[0][3] = - cameraXAxis.dotProduct(cameraPosition) ;

       // this.elements[1] = [cameraYAxis.x, cameraYAxis.y, cameraYAxis.z,   - cameraYAxis.dotProduct(cameraPosition) ];
        this.elements[1][0] = cameraYAxis.x;
        this.elements[1][1] = cameraYAxis.y;
        this.elements[1][2] = cameraYAxis.z;
        this.elements[1][3] = - cameraYAxis.dotProduct(cameraPosition) ;

        //this.elements[2] = [cameraZAxis.x, cameraZAxis.y, cameraZAxis.z,   - cameraZAxis.dotProduct(cameraPosition) ];
        this.elements[2][0] = cameraZAxis.x;
        this.elements[2][1] = cameraZAxis.y;
        this.elements[2][2] = cameraZAxis.z;
        this.elements[2][3] = - cameraZAxis.dotProduct(cameraPosition) ;

        //this.elements[3] = [0, 0, 0, 1];
        //HACK: ignore 4th row for speed, and rely on homogenous efficency hack in transformPoint3DOnRight and MultiplyByArrayOnRight to treat missing 4th row as 0,0,0,1

        if (columnMajor)
        {
            this.transpose();
        }
    }

    /**
     * zero out matrix
     */
    public setZeros(): void
    {
        ArrayHelper.setZeros(this.elements);
        // for(let row = 0; row < this.getNumberOfRows(); row++ )
        // {
        //     for(let column = 0; column < this.getNumberOfColumns(); column++)
        //     {
        //         this.elements[row][column] = 0;
        //     }
        // }
    }

    /**
     * identity matrix
     */
    public setIdentity(): void
    {
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                if (row === column)
                {
                    this.elements[row][column] = 1;
                }
                else
                {
                    this.elements[row][column] = 0;
                }
            }
        }
    }

    /**
     * set this matrix to a rotation matrix that rotates around the x-axis.
     * @param radians of angle to rotate through
     */
    public setRotationX(radians: number): void //Rotate AROUND x-Axis
    {	this.setZeros();
        this.elements[0][0] = 1; //X identity
        this.elements[1][1] = Math.cos(radians);
        this.elements[1][2] = -Math.sin(radians);
        this.elements[2][1] = Math.sin(radians);
        this.elements[2][2] = Math.cos(radians);
        this.elements[3][3] = 1; //homogeneous coordinate
    }

    /**
     * set this matrix to a rotation matrix that rotates around the y-axis.
     * @param radians of angle to rotate through
     */
    public setRotationY(radians: number): void //Rotate around Y-Axis
    {	this.setZeros();
        this.elements[0][0] = Math.cos(radians);
        this.elements[0][2] = Math.sin(radians);
        this.elements[1][1] = 1; //Y identity
        this.elements[2][0] = -Math.sin(radians);
        this.elements[2][2] = Math.cos(radians);
        this.elements[3][3] = 1; //homogeneous coordinate
    }

    /**
     * set this matrix to a rotation matrix that rotates around the z-axis.
     * @param radians of angle to rotate through
     */
    public setRotationZ(radians: number): void //Rotate around Z-Axis
    {	this.setZeros();
        this.elements[0][0] = Math.cos(radians);
        this.elements[0][1] = -Math.sin(radians);
        this.elements[1][0] = Math.sin(radians);
        this.elements[1][1] = Math.cos(radians);
        this.elements[2][2] = 1; //Z identity
        this.elements[3][3] = 1; //homogeneous coordinate
    }

    /**
     * Rotation around any axis using Rodrigues' rotation formula.  Only use on 3x3 or larger matricies.  HACK: ignores 4th row for speed, and relies on homogenous efficency hack in transformPoint3DOnRight and MultiplyByArrayOnRight to treat missing 4th row as 0,0,0,1
     * @reference https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
     * @reference https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
     * @param {Point3D} axis to rotate around
     * @param {number} radians of angle to rotate through
     */
    public setRotateAnyAxis(axis: Point3D, radians: number): void
    {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const oneMinusCos = 1 - cos;

        this.elements[0][0] = cos + axis.x * axis.x * oneMinusCos;
        this.elements[0][1] = axis.x * axis.y * oneMinusCos - axis.z * sin;
        this.elements[0][2] = axis.x * axis.z * oneMinusCos + axis.y * sin;

        this.elements[1][0] = axis.y * axis.x * oneMinusCos + axis.z * sin;
        this.elements[1][1] = cos + axis.y * axis.y * oneMinusCos;
        this.elements[1][2] = axis.y * axis.z * oneMinusCos - axis.x * sin;

        this.elements[2][0] = axis.z * axis.x * oneMinusCos - axis.y * sin;
        this.elements[2][1] = axis.z * axis.y * oneMinusCos + axis.x * sin;
        this.elements[2][2] = cos + axis.z * axis.z * oneMinusCos;
    }



    /**
     * Multiply this matrix by another matrix on the right hand side
     * @param {Matrix} rightSideMatrix - the other matrix to multiply by
     * @returns Matrix
     * @throws error if the number of rows of this mtrix does not equal the number of columns of the other matrix
     */
    public multiplyBy(rightSideMatrix: Matrix): Matrix
    {
        if (this.getNumberOfColumns() !== rightSideMatrix.getNumberOfRows())
        {
            throw new Error('Matrix Row Column mismatch.  Cannot multiply');
        }
        else
        {
            const result = new Matrix(null, this.getNumberOfRows(), rightSideMatrix.getNumberOfColumns());
            let currentElement: number;
            
            
            let limit = Math.min(this.getNumberOfRows(), rightSideMatrix.getNumberOfColumns()); //treat small matricies as having an infinite number of zeros.

            for(let rightSideMatrixColumnIndex = 0;  rightSideMatrixColumnIndex < limit; rightSideMatrixColumnIndex++)
            {
                for(let leftSideMatrixRow = 0; leftSideMatrixRow < limit; leftSideMatrixRow ++)
                {
                    currentElement = 0;
                    for( let i:number = 0; i < limit; i++)
                    {
                        currentElement += this.elements[leftSideMatrixRow][i] * rightSideMatrix.elements[i][rightSideMatrixColumnIndex];
                    }
                    result.elements[leftSideMatrixRow][rightSideMatrixColumnIndex] = currentElement;
                }
            }
            return result;
        }
    }

    /**
     * Transform an array as a Point3D by multiplying it on the right hand side of this matrix. Does not modify the original array Uses Homogenius Efficency Hack: browsers run out of memory fast, so we may not ant to store the homogenous 1 at the end of Point3Ds. But we need the math to work out the same.
     * @param {Array<number>} originalElements - array of numbers treated as vector
     * @returns {Array<number>} result
     */
    public MultiplyByArrayOnRight(originalElements: Array<number>): Array<number>
    {
        const limit = Math.min(this.getNumberOfColumns(), originalElements.length );
        const resultElements = new Array<number>(limit);
        const numberOfRows = this.getNumberOfRows();
            let sum: number, i: number;
            for(let row = 0; row < numberOfRows; row++ )
            {
                sum = 0;
                i = 0;
                while(i < limit)
                {
                    sum += this.elements[row][i]*originalElements[i];
                    i++;
                }
                //Homogenius Efficency Hack. Remember this.elements[row].length = number of columns in current row
                //number of columns in this row = this.elements[row].length 
                if ( this.elements[row].length > originalElements.length )
                {
                    sum += this.elements[row][limit] ;
                }
                resultElements[row] = sum;
            }
        return resultElements;
    }

    /**
     * Transform any Point3D on the right hand side. Modifies original Point3D. Homogenius Efficency Hack: treats Point3D as x,y,z,1
     * @param {Point3D} rightSide any generic Point3D to be transformed
     */
    public transformPoint3DOnRight(rightSide: Point3D): void
    {
        const numberOfColumns = this.getNumberOfColumns();
        let x= this.elements[0][0]*rightSide.x + this.elements[0][1]*rightSide.y + this.elements[0][2]*rightSide.z ;
        if(numberOfColumns > 3){
            x += this.elements[0][3]; //Homogenius Efficency Hack
        }
        let y= this.elements[1][0]*rightSide.x + this.elements[1][1]*rightSide.y + this.elements[1][2]*rightSide.z ;
        if(numberOfColumns > 3){
            y += this.elements[1][3]; //Homogenius Efficency Hack
        }
        let z= this.elements[2][0]*rightSide.x + this.elements[2][1]*rightSide.y + this.elements[2][2]*rightSide.z ; 
        if(numberOfColumns > 3){
            z += this.elements[2][3]; //Homogenius Efficency Hack
        }
        rightSide.set(x,y,z);
    }

    /**
     * Multiply by a Point3D on the right hand side and get new Point3D. Does  not change this original Point3D object.
     * @param {Point3D} rightSide - Point3D to multiply by
     */
    public multiplyByPoint3DOnRight(rightSide: Point3D): Point3D
    {
        const NewVect = rightSide.clone();
        this.transformPoint3DOnRight(NewVect);        
        return NewVect;
    }

    /**
     * Gets the determinant of a 2D matrix. Wrong for larger matricies.
     * @returns {number} determinant of a 2D matrix
     */
    public determinate2D(): number
    {
        return this.elements[0][0] * this.elements[1][1] - this.elements[0][1] * this.elements[1][0];
    }

    /**
     * Gets the 3x3 determinant. Wrong for larger matricies, and throws an error for smaller matricies because if checks take time.
     * @returns {number} 3x3 determinant
     */
    public determinant3D(): number
    {
        return this.elements[0][0] * this.elements[1][1] * this.elements[2][2]
             + this.elements[1][2] * this.elements[0][1] * this.elements[2][0]
             + this.elements[1][0] * this.elements[0][2] * this.elements[2][1]
             - this.elements[2][2] * this.elements[0][1] * this.elements[1][0]
             - this.elements[2][0] * this.elements[0][2] * this.elements[1][1]
             - this.elements[0][0] * this.elements[1][2] * this.elements[2][1];
    }

    /**
     * Gets the 4x4 determinant. Wrong for larger matricies, and throws an error for smaller matricies because if checks take time.
     * @returns {number} 4x4 determinant
     */
    public determinant4D(): number
    {
        return this.elements[1][1]*this.elements[3][2]*this.elements[2][0]*this.elements[0][3]-this.elements[2][2]*this.elements[0][1]*this.elements[1][0]*this.elements[3][3]+this.elements[3][0]*this.elements[1][1]*this.elements[0][2]*this.elements[2][3]-this.elements[3][0]*this.elements[0][1]*this.elements[1][2]*this.elements[2][3]+this.elements[0][1]*this.elements[1][0]*this.elements[3][2]*this.elements[2][3]-this.elements[3][0]*this.elements[2][1]*this.elements[0][2]*this.elements[1][3]-this.elements[2][1]*this.elements[3][2]*this.elements[1][0]*this.elements[0][3]+this.elements[3][1]*this.elements[2][2]*this.elements[1][0]*this.elements[0][3]-this.elements[3][1]*this.elements[1][0]*this.elements[0][2]*this.elements[2][3]+this.elements[1][2]*this.elements[0][1]*this.elements[2][0]*this.elements[3][3]+this.elements[3][1]*this.elements[2][0]*this.elements[0][2]*this.elements[1][3]-this.elements[2][2]*this.elements[3][0]*this.elements[1][1]*this.elements[0][3]+this.elements[0][0]*this.elements[3][1]*this.elements[1][2]*this.elements[2][3]-this.elements[0][0]*this.elements[3][1]*this.elements[2][2]*this.elements[1][3]+this.elements[1][0]*this.elements[0][2]*this.elements[2][1]*this.elements[3][3]+this.elements[1][2]*this.elements[3][0]*this.elements[2][1]*this.elements[0][3]-this.elements[0][0]*this.elements[1][1]*this.elements[3][2]*this.elements[2][3]+this.elements[0][0]*this.elements[2][1]*this.elements[3][2]*this.elements[1][3]-this.elements[2][0]*this.elements[0][2]*this.elements[1][1]*this.elements[3][3]+this.elements[3][0]*this.elements[0][1]*this.elements[2][2]*this.elements[1][3]-this.elements[3][1]*this.elements[1][2]*this.elements[2][0]*this.elements[0][3]+this.elements[0][0]*this.elements[2][2]*this.elements[1][1]*this.elements[3][3]-this.elements[0][0]*this.elements[1][2]*this.elements[2][1]*this.elements[3][3]-this.elements[0][1]*this.elements[2][0]*this.elements[3][2]*this.elements[1][3];
    }

    /**
     * Gets the inverse of of 2D matrix using Cramer's rule. Wrong for larger matricies.
     * @returns {number} inverse matrix
     */
    public getInverse2D(padForSafety: boolean = false): Matrix
    {
        if(this.getNumberOfRows() < 2 || this.getNumberOfColumns() < 2)
        {
            throw new Error('Matrix.getInverse2D is only valid for 2x2 matrices. Can be used for larger matricies that have zeros outside the 2x2 area.');
        }
        const determinant = this.determinate2D();
        if (Math.abs(determinant) < EquatableWithTolerance.Tolerance)
        {
            throw new Error('Matrix is not invertible');
        }
        let n: number = 2;
        if (padForSafety){
            n = Math.max(this.getNumberOfRows(), this.getNumberOfColumns());
        }
        const resultArray = new Array<Array<number>>(n);
        for(let i=0; i<n; i++){
            resultArray[i] = new Array<number>(n);
        }
        if(padForSafety){
            ArrayHelper.setZeros(resultArray);
        }
        resultArray[0][0] = this.elements[1][1]/determinant;
        resultArray[0][1] = - this.elements[0][1]/determinant;
        resultArray[1][0] = - this.elements[1][0]/determinant;
        resultArray[1][1] = this.elements[0][0]/determinant;
        return new Matrix(resultArray);
    }

    /**
     * Get the inverse of a 3x3 matrix using Cramer's rule. Wrong for larger matricies, and throws an error for smaller matricies. This should be sufficient b/c only the normal vectors get transformed by the inverse of the transpose of the transform matrix. Normals are invariant under translation, so we do not need the 4th dimension for translation. Also, we do not need to multiply the normal by the projection matrix b/c lighting is handled in 3D world space.
     * @return {Matrix} inverse of this matrix
     * @throws error if this matrix is smaller than 3x3 or not invertible
     */
    public getInverse3D(): Matrix
    {
        const determinant = this.determinant3D();
        if (Math.abs(determinant) < EquatableWithTolerance.Tolerance)
        {
            return this.getInverse2D(true); //try 2D inverse as a fallback.  This is a hack, but it is better than nothing if we are trying to invert a transform matrix that only has rotation and uniform scaling, and no translation or non-uniform scaling.
        }
        const resultArray = new Array<Array<number>>(3);
        resultArray[0] = new Array<number>(3);
        resultArray[1] = new Array<number>(3);
        resultArray[2] = new Array<number>(3);
        resultArray[0][0] = (this.elements[1][1]*this.elements[2][2] - this.elements[1][2]*this.elements[2][1])/determinant;
        resultArray[0][1] = (this.elements[0][2]*this.elements[2][1] - this.elements[0][1]*this.elements[2][2])/determinant;
        resultArray[0][2] = (this.elements[0][1]*this.elements[1][2] - this.elements[0][2]*this.elements[1][1])/determinant;

        resultArray[1][0] = (this.elements[1][2]*this.elements[2][0] - this.elements[1][0]*this.elements[2][2])/determinant;
        resultArray[1][1] = (this.elements[0][0]*this.elements[2][2] - this.elements[0][2]*this.elements[2][0])/determinant;
        resultArray[1][2] = (this.elements[0][2]*this.elements[1][0] - this.elements[0][0]*this.elements[1][2])/determinant;

        resultArray[2][0] = (this.elements[1][0]*this.elements[2][1] - this.elements[1][1]*this.elements[2][0])/determinant;
        resultArray[2][1] = (this.elements[0][1]*this.elements[2][0] - this.elements[0][0]*this.elements[2][1])/determinant;
        resultArray[2][2] = (this.elements[0][0]*this.elements[1][1] - this.elements[0][1]*this.elements[1][0])/determinant;

        return new Matrix(resultArray);
    }


    /**
     * clone
     * @returns Matrix
     */
    public clone(): Matrix
    {
        const myClone = new Matrix(null, this.getNumberOfRows(), this.getNumberOfColumns());
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                myClone.elements[row][column] = this.elements[row][column];
            }
        }
        return myClone;
    }

    /**
     * Test if matrix is equal to another Matrix. (undefined, null, other types, and Point3Ds with different values return false)
     * @param {any} obj - other Point3Dto compare.
     */
    public equals(obj: any): boolean
    {
        if (typeof obj === 'undefined')
        {
            return false;
        }
        else if (obj == null)
        {
            return false;
        }
        //TODO : parse json?
        else if (obj instanceof Matrix)
        {
            const otherMatrix = obj as Matrix;
            if (((typeof this.elements === 'undefined')  && (typeof otherMatrix.elements !== 'undefined'))
            || ((typeof this.elements !== 'undefined')  && (typeof otherMatrix.elements === 'undefined')))
            {
                return false;
            }
            else if ((typeof this.elements === 'undefined')  && (typeof otherMatrix.elements === 'undefined'))
            {
                return true; //vaciously true
            }
            else
            {
                if (((this.elements === null) && (otherMatrix.elements !== null)) || ((this.elements !== null) && (otherMatrix.elements === null)))
                {
                    return false;
                }
                else if ((this.elements === null) && (otherMatrix.elements === null))
                {
                    return true; //vaciously true
                }
                else
                {
                    //they both have data, but do they match?
                    if (this.elements.length !== otherMatrix.elements.length)
                    {
                        return false; //different number of rows
                    }
                    else
                    {
                        for(let row = 0; row < this.elements.length; row++)
                        {
                            if (this.elements[row].length !== otherMatrix.elements[row].length)
                            {
                                return false; //column number miss matc
                            }
                            else
                            {
                                let absoluteDifference: number;
    
                                for(let col = 0; col < this.elements[row].length ; col++)
                                {
                                    absoluteDifference = Math.abs(this.elements[row][col] - otherMatrix.elements[row][col]);
                                    if (absoluteDifference > EquatableWithTolerance.Tolerance)
                                    {
                                        return false;
                                    }
                                }
                            }
                        }
                        //if we get here everything matchedd
                        return true;
                    }
                }
            }


        }
        else
        {
            //some other kind of object
            return false;
        }
    }


    public log(): void
    {
        console.log(this.toString());
    }



}