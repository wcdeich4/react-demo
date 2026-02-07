import { Point3D } from "./Point3D";

it('Point3D Add Test1', () => {
  const x1 = 99;
  const y1 = -76;
  const z1 = 33;
  const u = new Point3D(x1, y1, z1);
  const v = new Point3D(4, 5, 6);
  let w: Point3D = null;
  var startTime = new Date().getTime();

  for (let index = 0; index < 1; index++) {
    w = u.getSumWith(v);
//  u.add(v);    
  }
  var elapsed = new Date().getTime() - startTime;
  console.log('elapsed Point3D add time = ' + elapsed);

  expect(w.x).toEqual(x1 + v.x);
  expect(w.y).toEqual(y1 + v.y);
  expect(w.z).toEqual(z1 + v.z);
});

it('Point3D Subtract Test1', () => {
  const x1 = 23;
  const y1 = -78;
  const z1 = 8.3;
  const u = new Point3D(x1, y1, z1);
  const v = new Point3D(4, 5, 6);
  u.subtract(v);
  expect(u.x).toEqual(x1 - v.x);
  expect(u.y).toEqual(y1 - v.y);
  expect(u.z).toEqual(z1 - v.z);
});

it('Point3D multiply Test1', () => {
  const x1 = 14;
  const y1 = -58;
  const z1 = 3.9;
  const scalar = 4;
  const u = new Point3D(x1, y1, z1);
  u.multiplyByScalar(scalar);
  expect(u.x).toEqual(x1 * scalar);
  expect(u.y).toEqual(y1 * scalar);
  expect(u.z).toEqual(z1 * scalar);
});

it('Point3D divide Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const z1 = 88;
  const scalar = 7;
  const u = new Point3D(x1, y1, z1);
  u.divideByScalar(scalar);
  expect(u.x).toEqual(x1 / scalar);
  expect(u.y).toEqual(y1 / scalar);
  expect(u.z).toEqual(z1 / scalar);
});


it('Point3D UnitPoint3D test1', () => { 
  const x = 1;
  const y = 2;
  const z = 8;
  const v1 = new Point3D(x, y, z);
  const mag = v1.magnitude();
  v1.normalize();
  const expected = new Point3D(x / mag, y / mag, z / mag);
  expect(v1.equals(expected)).toEqual(true);
});

it('Point3D Magnitude test1', () => {
  const v1 = new Point3D(1, 2, -7);
  const mag = v1.magnitude();
  const expected = Math.sqrt(v1.x * v1.x + v1.y * v1.y  + v1.z*v1.z);
  expect(mag).toEqual(expected);
});

it('Point3D Cross Product test1', () => {
  const a = new Point3D(1, 0, 0);
  const b = new Point3D(0, 1, 0);
  const expected = new Point3D(0, 0, 1);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});

it('Point3D Cross Product test2', () => {
  const a = new Point3D(0, 1, 0);
  const b = new Point3D(0, 0, 1);
  const expected = new Point3D(1, 0, 0);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});

it('Point3D Cross Product test3', () => {
  const a = new Point3D(1, 0, 0);
  const b = new Point3D(0, 0, 1);
  const expected = new Point3D(0, -1, 0);
  const actual = a.crossProduct(b);
  expect(expected.equals(actual)).toEqual(true);
});


it('Point3D Add Test1', () => {
  const x1 = 99;
  const y1 = -77;
  const z1 = -55;
  const u = new Point3D(x1, y1, z1);
  const v = new Point3D(4, 5, 6);
  u.add(v);
  expect(u.x).toEqual(x1 + v.x);
  expect(u.y).toEqual(y1 + v.y);
  expect(u.z).toEqual(z1 + v.z);
});

it('Point3D Subtract Test1', () => {
  const x1 = 22;
  const y1 = -77;
  const z1 = -55;
  const u = new Point3D(x1, y1, z1);
  const v = new Point3D(4, 5, 6);
  u.subtract(v);
  expect(u.x).toEqual(x1 - v.x);
  expect(u.y).toEqual(y1 - v.y);
  expect(u.z).toEqual(z1 - v.z);
});

it('Point3D multiply Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const z1 = -66;
  const scalar = 9;
  const u = new Point3D(x1, y1, z1);
  u.multiplyByScalar(scalar);
  expect(u.x).toEqual(x1 * scalar);
  expect(u.y).toEqual(y1 * scalar);
  expect(u.z).toEqual(z1 * scalar);
});

it('Point3D divide Test1', () => {
  const x1 = 13;
  const y1 = -57;
  const z1 = -66;
  const scalar = 3;
  const u = new Point3D(x1, y1, z1);
  u.divideByScalar(scalar);
  expect(u.x).toEqual(x1 / scalar);
  expect(u.y).toEqual(y1 / scalar);
  expect(u.z).toEqual(z1 / scalar);
});

it('Point3D UnitPoint3D test1', () => {
  const x = 1;
  const y = 2;
  const z = 3;
  const v1 = new Point3D(x, y, z);
  const mag = v1.magnitude();
  v1.normalize();
  const expected = new Point3D(x / mag, y / mag, z / mag);
  expect(v1.equals(expected)).toEqual(true);
});

it('Point3D Magnitude test1', () => {
  const v1 = new Point3D(1, 2, 3);
  const mag = v1.magnitude();
  const expected = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  expect(mag).toEqual(expected);
});




it('Point3D Negate', () => {
  const x1 = 99;
  const y1 = -76;
  const z1 = -33;
  const u = new Point3D(x1, y1, z1);
  const v = u.getNegated();
  expect(v.x).toEqual(x1 * -1);
  expect(v.y).toEqual(y1 * -1);
  expect(v.z).toEqual(z1 * -1);
});



  it('3D Load data string', () =>
  {
    const inputDataLine: string = 'vn 0.5 0 0.866025 ';
    const p: Point3D = new Point3D(0,0,0);
    p.setFromDelimetedString(inputDataLine);
    expect(p.x).toEqual(0.5);
    expect(p.y).toEqual(0);
    expect(p.z).toEqual(0.866025);
  });
