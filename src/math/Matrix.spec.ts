import { Probability } from './Probability';
import { Matrix } from './Matrix';
import { Point3D } from './Point3D';
import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { ArrayHelper } from '../utilities/ArrayHelper';
import { EquatableWithTolerance } from './EquatableWithTolerance';

describe('Matrix tests', () => {
  it('Matrix.setLookAtMatrix first octant camera', () => {
    const cameraPosition = new Point3D(10, 10, 10);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);
    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(5, 5, 5);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);
    //make other projection matrix to compare??
  });

  it('Matrix.setLookAtMatrix 2nd octant camera', () => {
    const cameraPosition = new Point3D(-10, 10, 10);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(-5, 5, 5);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);

    //make other projection matrix to compare??
  });


  it('Matrix.setLookAtMatrix look at origin from every angle', () => {
    let r1: number = 1, r2: number = 2, x: number, y: number, z: number;
    const cameraPosition = new Point3D(0,0,0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);
    const point1 = new Point3D(0,0,0);
    let projectedPoint: Point3D;
    let isMatch = false;
    const lookAtMatrix = new Matrix(null, 4, 4);;
    for (let longitude = 0; longitude < 2 * Math.PI; longitude += Math.PI / 24) {
      for (let latitude = 0; latitude < Math.PI; latitude += Math.PI / 24) {
        x = r2 * Math.sin(latitude) * Math.cos(longitude);
        y = r2 * Math.sin(latitude) * Math.sin(longitude);
        z = r2 * Math.cos(latitude);
        cameraPosition.set(x, y, z);

        lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);

        x = r1 * Math.sin(latitude) * Math.cos(longitude);
        y = r1 * Math.sin(latitude) * Math.sin(longitude);
        z = r1 * Math.cos(latitude);
        point1.set(x, y, z);
        projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);

        if(!projectedPoint){
          console.error('projected point not !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111')
        }

        isMatch = Math.abs(projectedPoint.x - origin.x) < 0.0001 && Math.abs(projectedPoint.y - origin.y) < 0.0001;
        if (!isMatch) {

          console.log('?????????????????????????????????????????????????????????????????????????????????????????????????????')
          projectedPoint.log();
          throw new Error("mismatch ");
        }

      }

    }






    //make other projection matrix to compare??
  });



  it('Matrix.setLookAtMatrix x-axis camera', () => {
    const cameraPosition = new Point3D(10, 0, 0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(5, 0, 0);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);

    //make other projection matrix to compare??
  });

  it('Matrix.setLookAtMatrix negative x-axis camera', () => {
    const cameraPosition = new Point3D(-10, 0, 0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(-5, 0, 0);

    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x); 
    expect(projectedPoint.y).toEqual(origin.y);
  });

  it('Matrix.setLookAtMatrix y-axis camera', () => {
    const cameraPosition = new Point3D(0, 10, 0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(0, 5, 0);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    const isMatch = Math.abs(projectedPoint.x - origin.x) < 0.0001 &&
          Math.abs(projectedPoint.y - origin.y) < 0.0001;
    expect(isMatch).toEqual(true);
  });

  it('Matrix.setLookAtMatrix negative y-axis camera', () => {
    const cameraPosition = new Point3D(0, -10, 0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(0, -5, 0);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);
  });


  it('Matrix.setLookAtMatrix z-axis camera', () => {
    const cameraPosition = new Point3D(0, 0, 10);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(0, 0, 5);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);
  });

  it('Matrix.setLookAtMatrix negative z-axis camera', () => {
    const cameraPosition = new Point3D(0, 0, -10);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);
    const lookAtMatrix = new Matrix(null, 4, 4);;
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);
    const point1 = new Point3D(0, 0, -5);
    const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(point1);
    expect(projectedPoint.x).toEqual(origin.x);
    expect(projectedPoint.y).toEqual(origin.y);
  });


  it('Matrix.setLookAtMatrix test 2 singularity', () => {
    const cameraPosition = new Point3D(0, 0, 0);
    const origin = new Point3D(0, 0, 0);
    const focalPoint = <Point3D>origin;
    const upVector = new Point3D(0, 0, 1);

    const lookAtMatrix = new Matrix(null, 4, 4);
    lookAtMatrix.setLookAtMatrix(cameraPosition, focalPoint, upVector);

    const Point3DArray = new Array<Point3D>();
    Point3DArray.push(origin);
    const numberOfRandomPoints = 100;
    for (let index = 0; index < numberOfRandomPoints; index++) {
      Point3DArray.push(new Point3D(
        Probability.getRandomNumberInRange(-10000, 10000),
        Probability.getRandomNumberInRange(-10000, 10000),
        Probability.getRandomNumberInRange(-10000, 10000)
     ));
    }

    Point3DArray.forEach(p => {
      const projectedPoint = lookAtMatrix.multiplyByPoint3DOnRight(p);

      const isMatch = !isNaN(projectedPoint.x) && 
                      Math.abs(projectedPoint.x - origin.x) < 0.0001 && 
                      Math.abs(projectedPoint.y - origin.y) < 0.0001 && 
                      !isNaN(projectedPoint.y) ;

      expect(isMatch).toEqual(true);      
    });

  });

  it('GenericMatrix.SetColumn', () => {
    const m2 = new Matrix(null, 4, 4);
    m2.elements[0][0] = 1;
    m2.elements[0][1] = 2;
    m2.elements[1][0] = 3;
    m2.elements[1][1] = 4;
    const v = new Point3D(9, 8, 7);
    m2.setColumn(6, [v.x, v.y, v.z]);

    expect(m2.elements[0][0]).toEqual(1);
    expect(m2.elements[0][1]).toEqual(2);
    expect(m2.elements[1][0]).toEqual(3);
    expect(m2.elements[1][1]).toEqual(4);

    expect(m2.elements[0][4]).toEqual(undefined);
    expect(m2.elements[0][5]).toEqual(undefined);

    expect(m2.elements[0][6]).toEqual(v.x);
    expect(m2.elements[1][6]).toEqual(v.y);
    expect(m2.elements[2][6]).toEqual(v.z);
    expect(m2.elements[3][6]).toEqual(undefined);
  });


  it('GenericMatrix.transpose', () => {
    const numberOfRows = 4;
    const numberOfColumns = 4;
    const m = new Matrix(null, numberOfRows, numberOfColumns);
    m.elements[0][0] = 1;
    m.elements[0][1] = 2;
    m.elements[1][0] = 3;
    m.elements[1][1] = 4;
    const n = m.clone();
    n.transpose();

    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        expect(m.elements[row][col]).toEqual(n.elements[col][row]);
      }
    }
  });


  it('Matrix.getNumberOfRowsColumns', () => {
    const expectedNumberOfRows = 4;
    const expectedNumberOfColumns = 5;
    const m = new Matrix(null, expectedNumberOfRows, expectedNumberOfColumns);
    const actualNumberOfRows = m.getNumberOfRows();
    expect(expectedNumberOfRows).toEqual(actualNumberOfRows);
    const actualNumberOfColumns = m.getNumberOfColumns();
    expect(expectedNumberOfColumns).toEqual(actualNumberOfColumns);
  });

  it('Matrix.multiply', () => {
    const A = new Matrix(null, 4, 4);
    A.elements[0][0] = 1; A.elements[0][1] = 2; A.elements[0][2] = 3; A.elements[0][3] = 4;
    A.elements[1][0] = 5; A.elements[1][1] = 6; A.elements[1][2] = 7; A.elements[1][3] = 8;
    A.elements[2][0] = 9; A.elements[2][1] = 10; A.elements[2][2] = 11; A.elements[2][3] = 12;
    A.elements[3][0] = 13; A.elements[3][1] = 14; A.elements[3][2] = 15; A.elements[3][3] = 16;

    const B = new Matrix(null, 4, 4);
    B.elements[0][0] = 16; B.elements[0][1] = 15; B.elements[0][2] = 14; B.elements[0][3] = 13;
    B.elements[1][0] = 12; B.elements[1][1] = 11; B.elements[1][2] = 10; B.elements[1][3] = 9;
    B.elements[2][0] = 8; B.elements[2][1] = 7; B.elements[2][2] = 6; B.elements[2][3] = 5;
    B.elements[3][0] = 4; B.elements[3][1] = 3; B.elements[3][2] = 2; B.elements[3][3] = 1;

    const C = new Matrix(null, 4, 4);
    C.elements[0][0] = 80; C.elements[0][1] = 70; C.elements[0][2] = 60; C.elements[0][3] = 50;
    C.elements[1][0] = 240; C.elements[1][1] = 214; C.elements[1][2] = 188; C.elements[1][3] = 162;
    C.elements[2][0] = 400; C.elements[2][1] = 358; C.elements[2][2] = 316; C.elements[2][3] = 274;
    C.elements[3][0] = 560; C.elements[3][1] = 502; C.elements[3][2] = 444; C.elements[3][3] = 386;

    //A times B equals expected
    let D;
    var startTime = new Date().getTime();
    for (let i = 0; i < 10000; i++) {
      D = A.multiplyBy(B);
    }
    var elapsed = new Date().getTime() - startTime;
    console.log("Generic matrix 4x4 elapsed = " + elapsed);

    if (typeof D === 'undefined') {
      throw new Error('D matrix is unefined in Matrix.spec.ts???????!!!!!!!!!!!!');
    }

    let CMatchesD = C.equals(D);
    if (!CMatchesD) {
      console.log(C);
      console.log(D);
    }


    expect(CMatchesD).toEqual(true);

    const E = new Matrix(null, 4, 4);
    E.elements[0][0] = 386; E.elements[0][1] = 444; E.elements[0][2] = 502; E.elements[0][3] = 560;
    E.elements[1][0] = 274; E.elements[1][1] = 316; E.elements[1][2] = 358; E.elements[1][3] = 400;
    E.elements[2][0] = 162; E.elements[2][1] = 188; E.elements[2][2] = 214; E.elements[2][3] = 240;
    E.elements[3][0] = 50; E.elements[3][1] = 60; E.elements[3][2] = 70; E.elements[3][3] = 80;

    //B times A equals expected
    const F = B.multiplyBy(A);
    expect(F.equals(E)).toEqual(true);

    //A times B does not equal B times A
    expect(F.equals(D)).toEqual(false);

  });

  it('transoform should match multiply on right', () => {
    const v1 = new Point3D(2, 3, 4);

    const A = new Matrix(null, 4, 4);
    A.elements[0][0] = 1; A.elements[0][1] = 2; A.elements[0][2] = 3; A.elements[0][3] = 4;
    A.elements[1][0] = 5; A.elements[1][1] = 6; A.elements[1][2] = 7; A.elements[1][3] = 8;
    A.elements[2][0] = 9; A.elements[2][1] = 10; A.elements[2][2] = 11; A.elements[2][3] = 12;
    A.elements[3][0] = 13; A.elements[3][1] = 14; A.elements[3][2] = 15; A.elements[3][3] = 16;

    const v1MultipliedOnRight = A.multiplyByPoint3DOnRight(v1);

    A.transformPoint3DOnRight(v1);

    expect(v1.equals(v1MultipliedOnRight)).toEqual(true);
  });


  it('multiply array should match multiply Point3D on right', () => {
    const A = new Matrix(null, 4, 4);
    A.elements[0][0] = 1; A.elements[0][1] = 2; A.elements[0][2] = 3; A.elements[0][3] = 4;
    A.elements[1][0] = 5; A.elements[1][1] = 6; A.elements[1][2] = 7; A.elements[1][3] = 8;
    A.elements[2][0] = 9; A.elements[2][1] = 10; A.elements[2][2] = 11; A.elements[2][3] = 12;
    A.elements[3][0] = 13; A.elements[3][1] = 14; A.elements[3][2] = 15; A.elements[3][3] = 16;

    const p1 = new Point3D(2, 3, 4);
    const p1Multiplied = A.multiplyByPoint3DOnRight(p1);
    const p1MultipliedAsArray = p1Multiplied.toArray();

    const array1 = p1.toArray();
    const array2 = A.MultiplyByArrayOnRight(array1);

    expect(ArrayHelper.ArraysContainSameNumbers(array2, p1MultipliedAsArray, EquatableWithTolerance.Tolerance))

  });









});
