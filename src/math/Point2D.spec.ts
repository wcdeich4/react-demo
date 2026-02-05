import { Matrix } from "./Matrix";
import { Point2D } from "./Point2D";

it('Perpendicular Clockwise', () => {
  const a = new Point2D(5, -10);
  const actualPerpendicularClockwise = a.getPerpendicularClockwise();
  const expectedPerpendicularClockwise = new Point2D(-10, -5);
  expect(expectedPerpendicularClockwise.equals(actualPerpendicularClockwise)).toEqual(true);
});

it('Perpendicular Counter Clockwise', () => {
  const a = new Point2D(5, -10);
  const actualPerpendicularCounterClockwise = a.getPerpendicularCounterClockwise();
  const expectedPerpendicularCounterClockwise = new Point2D(10, 5);
  expect(expectedPerpendicularCounterClockwise.equals(actualPerpendicularCounterClockwise)).toEqual(true);
});

it('Point2D 2D Add Test1', () => {
    const x1 = 99;
    const y1 = -76;
    const u = new Point2D(x1, y1);
    const v = new Point2D(4, 5);
    u.add(v);
    expect(u.x).toEqual(x1 + v.x);
    expect(u.y).toEqual(y1 + v.y);
  });

  it('Point2D 2D Subtract Test1', () => {
    const x1 = 23;
    const y1 = -78;
    const u = new Point2D(x1, y1);
    const v = new Point2D(4, 5);
    u.subtract(v);
    expect(u.x).toEqual(x1 - v.x);
    expect(u.y).toEqual(y1 - v.y);
  });

  it('Point2D 2D multiply Test1', () => {
    const x1 = 14;
    const y1 = -58;
    const scalar = 4;
    const u = new Point2D(x1, y1);
    u.multiplyByScalar(scalar);
    expect(u.x).toEqual(x1 * scalar);
    expect(u.y).toEqual(y1 * scalar);
  });

  it('Point2D 2D divide Test1', () => {
    const x1 = 13;
    const y1 = -57;
    const scalar = 7;
    const u = new Point2D(x1, y1);
    u.divideByScalar(scalar);
    expect(u.x).toEqual(x1 / scalar);
    expect(u.y).toEqual(y1 / scalar);
  });


  it('Point2D 2D UnitPoint2D test1', () => { 
    const x = 1;
    const y = 2;
    const v1 = new Point2D(x, y);
    const mag = v1.magnitude();
    v1.normalize();
    const expected = new Point2D(x / mag, y / mag);
    expect(v1.equals(expected)).toEqual(true);
  });

  it('Point2D 2D Magnitude test1', () => {
    const v1 = new Point2D(1, 2);
    const mag = v1.magnitude();
    const expected = Math.sqrt(v1.x * v1.x + v1.y * v1.y );
    expect(mag).toEqual(expected);
  });

    it('Point2D.multiplyLeftOfMatrix', () => {
      const p = new Point2D(-5, 9);
      const m2 = new Matrix(null, 4, 4);
      m2.elements[0][0] = 1;
      m2.elements[0][1] = 2;
      m2.elements[1][0] = 3;
      m2.elements[1][1] = 4;
      p.transformLeftOfMatrix(m2);
      expect(p.x).toEqual(22);
      expect(p.y).toEqual(26);
    });

  it('Point2D MidPoint', () =>
  {
    const Point2D1: Point2D = new Point2D(-2, -3);
    const Point2D2: Point2D = new Point2D(2, 3);
    const midPoint = Point2D2.getMidPointWith(Point2D1);
    const expected: Point2D = new Point2D(0, 0);
    expect(midPoint.equals(expected)).toEqual(true);
  });

    //??????????
  //   it('2D Load data string', () =>
  // {
  //   const inputDataLine: string = 'vt 0.5 0 ';
  //   const Point2D: Point2D = new Point2D();
  //   Point2D.setFromDelimetedString(inputDataLine);
  //   console.log('2D Load data string, Point2D.x = ' + Point2D.x + ' Point2D.y = ' + Point2D.y);
  //   expect(Point2D.x).toEqual(0.5);
  //   expect(Point2D.y).toEqual(0);
  // });