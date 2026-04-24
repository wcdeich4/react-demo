import { MaterialPolygon } from './MaterialPolygon';
import { Material } from '../Material';
import { Light } from '../../Light';
import { Coordinate } from '../Coordinate';
import { Point3D } from '../../../math/Point3D';

describe('MaterialPolygon tests', () => {
  it('should create a MaterialPolygon with material', () => {
    const material = new Material();
    const coords = [new Coordinate(new Point3D(0, 0, 0)), new Coordinate(new Point3D(1, 0, 0)), new Coordinate(new Point3D(0, 1, 0))];
    const poly = new MaterialPolygon(coords, null, material);
  //  expect(poly.material).toBe(material);
    expect(poly.coordinateArray).toEqual(coords);
  });

  it('should create a MaterialPolygon without material', () => {
    const coords = [new Coordinate(new Point3D(0, 0, 0)), new Coordinate(new Point3D(1, 0, 0)), new Coordinate(new Point3D(0, 1, 0))];
    const poly = new MaterialPolygon(coords);
   // expect(poly.material).toBeUndefined(); 
    expect(poly.coordinateArray).toEqual(coords);
  });

  it('getColorUnderCurrentLighting with no lights', () => {
    const material = new Material();
    material.ambientColor = [0.1, 0.2, 0.3];
    material.diffuseColor = [0.4, 0.5, 0.6];
    material.specularColor = [0.7, 0.8, 0.9];
    material.emissiveColor = [0.0, 0.0, 0.0];
    const coords = [new Coordinate(new Point3D(0, 0, 0))];
    const poly = new MaterialPolygon(coords, null, material);
    const color = poly.getColorUnderCurrentLighting([]);
    // Since no lights, only emissive, but ambient etc. are 0
    expect(color).toBe('#000000'); // All zeros
  });

  it('getColorUnderCurrentLighting with ambient light', () => {
    const material = new Material();
    material.ambientColor = [0.5, 0.5, 0.5];
    material.diffuseColor = [0.0, 0.0, 0.0];
    material.specularColor = [0.0, 0.0, 0.0];
    material.emissiveColor = [0.0, 0.0, 0.0];
    const coords = [new Coordinate(new Point3D(0, 0, 0))];
    const poly = new MaterialPolygon(coords, null, material);
    const light = new Light();
    light.ambientColor = [1.0, 1.0, 1.0];
    light.diffuseColor = [0.0, 0.0, 0.0];
    light.specularColor = [0.0, 0.0, 0.0];
    // Mock illuminatesPoint to return false, so no diffuse/specular
    light.illuminatesPoint = jest.fn().mockReturnValue(false);
    const color = poly.getColorUnderCurrentLighting([light]);
    expect(color).toBe('#808080'); // 0.5 * 1.0 * 255 ≈ 128 = 80 in hex
  });


  it('getColorUnderCurrentLighting with emissive material', () => {
    const material = new Material();
    material.ambientColor = [0.0, 0.0, 0.0];
    material.diffuseColor = [0.0, 0.0, 0.0];
    material.specularColor = [0.0, 0.0, 0.0];
    material.emissiveColor = [1, 0.5, 0]; 
    const coords = [new Coordinate(new Point3D(0, 0, 0))];
    const poly = new MaterialPolygon(coords, null, material);
    const color = poly.getColorUnderCurrentLighting([]);
    expect(color).toBe('#ff8000'); // 0.5 * 1.0 * 255 ≈ 128 = 80 in hex
  });

  it('getColorUnderCurrentLighting with diffuse light', () => {
    const material = new Material();
    material.ambientColor = [0.0, 0.0, 0.0];
    material.diffuseColor = [1.0, 1.0, 1.0];
    material.specularColor = [0.0, 0.0, 0.0];
    material.emissiveColor = [0.0, 0.0, 0.0];
    const coords = [new Coordinate(new Point3D(0, 0, 0))];
    const poly = new MaterialPolygon(coords, null, material);
    const light = new Light();
    light.ambientColor = [0.0, 0.0, 0.0];
    light.diffuseColor = [1.0, 1.0, 1.0];
    light.specularColor = [1.0, 1.0, 1.0];
   // light.illuminatesPoint = jest.fn().mockReturnValue(true);
    light.position = new Point3D(0, 0, 1);
    light.direction = new Point3D(0, 0, -1);
    light.halfAngle = Math.PI / 4; // 45 degrees
    const color = poly.getColorUnderCurrentLighting([light]);
    expect(color).toBe('#ffffff'); // 1.0 * 1.0 * 255 = 255
  });


  it('getColorUnderCurrentLighting specular treated like diffuse light for now', () => {
    const material = new Material();
    material.ambientColor = [0.0, 0.0, 0.0];
    material.diffuseColor = [0.0, 0.0, 0.0];
    material.specularColor = [1.0, 1.0, 1.0];
    material.emissiveColor = [0.0, 0.0, 0.0];
    const coords = [new Coordinate(new Point3D(0, 0, 0))];
    const poly = new MaterialPolygon(coords, null, material);
    const light = new Light();
    light.ambientColor = [0.0, 0.0, 0.0];
    light.diffuseColor = [1.0, 1.0, 1.0];
    light.specularColor = [1.0, 1.0, 1.0];
   // light.illuminatesPoint = jest.fn().mockReturnValue(true);
    light.position = new Point3D(0, 0, 1);
    light.direction = new Point3D(0, 0, -1);
    light.halfAngle = Math.PI / 4; // 45 degrees
    const color = poly.getColorUnderCurrentLighting([light]);
    expect(color).toBe('#ffffff'); // 1.0 * 1.0 * 255 = 255
  });
















});