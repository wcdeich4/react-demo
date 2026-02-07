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
            if ((numberOfRows > 0) )
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
     * create look at matrix like in OpenGL, except row-major math is the default.
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
        this.elements[0] = [cameraXAxis.x, cameraXAxis.y, cameraXAxis.z,   - cameraXAxis.dotProduct(cameraPosition) ];
        this.elements[1] = [cameraYAxis.x, cameraYAxis.y, cameraYAxis.z,   - cameraYAxis.dotProduct(cameraPosition) ];
        this.elements[2] = [cameraZAxis.x, cameraZAxis.y, cameraZAxis.z,   - cameraZAxis.dotProduct(cameraPosition) ];
        this.elements[3] = [0, 0, 0, 1];

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
        for(let row = 0; row < this.getNumberOfRows(); row++ )
        {
            for(let column = 0; column < this.getNumberOfColumns(); column++)
            {
                this.elements[row][column] = 0;
            }
        }
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