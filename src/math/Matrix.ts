import { EquatableWithTolerance } from "./EquatableWithTolerance";
import { Vector } from "./Vector";
//import { GenericVector } from "./GenericVector"; //use arrays as vectors ??????????????????????????????????????????
//maybe do not use array as vector b/c we want static & instance methods for vectors......................

export class Matrix extends EquatableWithTolerance
{
    public elements: number[][];
    /**
     * constructor
     * @param array2D array of array of number or null
     * @param numberOfRows number or null
     * @param numberOfColumns number or null
     */
    constructor(array2D: Array<Array<number>>|null = null, numberOfRows?: number, numberOfColumns: number|null = null)
    {
        super();
        if (array2D == null)
        {
            if ((numberOfRows != null) )
            {
                this.elements = new Array<Array<number>>(numberOfRows);

                if (numberOfColumns != null)
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
     * @param {Vector} cameraPosition camera poisition in 3D cartesian coordinates
     * @param {Vector} focalPoint point to look at in 3D cartesian coordinates
     * @param {Vector} upVector up vector in 3D cartesian coordinates (approximate is ok)
     * @param {boolean} columnMajor 
     */
    public setLookAtMatrix(cameraPosition: Vector, focalPoint: Vector, upVector: Vector, columnMajor: boolean = false ): void
    {
        const cameraZAxis: Vector = <Vector>focalPoint.getDifferenceWith(cameraPosition) as Vector; //aka forward vector
        cameraZAxis.normalize();
        const cameraXAxis: Vector = cameraZAxis.crossProduct(upVector); //aka right vector
        cameraXAxis.normalize();
        const cameraYAxis: Vector = cameraXAxis.crossProduct(cameraZAxis); //aka camera up ?
        cameraZAxis.negate();

        if (this.elements == null)
        {
            this.elements = new Array<Array<number>>(3);
        }

       // const result = new Matrix(null, 3, null);
        this.setRow(0, cameraXAxis.elements);
        this.setRow(1, cameraYAxis.elements);
        this.setRow(2, cameraZAxis.elements);

        const translationX = - cameraXAxis.dotProduct(cameraPosition);
        const translationY = - cameraYAxis.dotProduct(cameraPosition);
        const translationZ = - cameraZAxis.dotProduct(cameraPosition);
        this.setElement(0, 3, translationX);
        this.setElement(1, 3, translationY);
        this.setElement(2, 3, translationZ);

        this.setElement(3, 0, 0);
        this.setElement(3, 1, 0);
        this.setElement(3, 2, 0);
        this.setElement(3, 3, 1);

        if (columnMajor)
        {
            this.transpose();
        }

     //   return result;
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
     * Transform an array as a vector by multiplying it on the right hand side of this matrix. Does not modify the original array Uses Homogenius Efficency Hack: browsers run out of memory fast, so we may not ant to store the homogenous 1 at the end of vectors. But we need the math to work out the same.
     * @param {Vector} originalElements - array vector to multiply by
     * @param {Vector} resultElements - array vector result
     */
    public MultiplyByArrayOnRightAndStoreToResultArray(originalElements: Array<number>, resultElements: Array<number>): void
    {
        const limit = Math.min(this.getNumberOfColumns(), originalElements.length );
      //  const limit = originalElements.length ; //speed hack, wrong if size mismatch
        const numberOfRows = this.getNumberOfRows();


            let sum: number, i: number;
            for(let row = 0; row < numberOfRows; row++ )
            {
                // for (let column = 0; column < rightSideMatrix.getNumberOfColumns(); column++)
                // {
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
               // }
            }

    }

    /**
     * Transform any Vector on the right hand side. Modifies original vector. Uses Homogenius Efficency Hack: browsers run out of memory fast, so we may not ant to store the homogenous 1 at the end of vectors. But we need the math to work out the same.
     * @param {Vector} rightSideVector any generic vector to be transformed
     */
    public transformVectorOnRight(rightSideVector: Vector): void
    {
        let transformedArray = new Array<number>(rightSideVector.elements.length);
        this.MultiplyByArrayOnRightAndStoreToResultArray(rightSideVector.elements, transformedArray);
        rightSideVector.set(...transformedArray);
    }

    /**
     * Multiply by a Vector on the right hand side using Homogenius Efficency Hack: browsers run out of memory fast, so we may not ant to store the homogenous 1 at the end of vectors. But we need the math to work out the same.
     * @param {Vector} rightSideVector - vector to multiply by
     */
    public multiplyByVectorOnRight(rightSideVector: Vector): Vector
    {
        let transformedArray = new Array<number>(rightSideVector.elements.length);
        this.MultiplyByArrayOnRightAndStoreToResultArray(rightSideVector.elements, transformedArray);
        let result = new Vector(transformedArray);
        return result;
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
     * Test if matrix is equal to another Matrix. (undefined, null, other types, and vectors with different values return false)
     * @param {any} obj - other vectorto compare.
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