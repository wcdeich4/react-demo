import * as fs from 'fs';
import * as path from 'path';
import { Mesh } from './Mesh';

describe('Mesh tests', () => {
  it('should read the file content as a string', () => {
    // Construct the file path relative to the current test file
    const filePath = path.join(__dirname, '../../../public/quad.obj');
    // Read the file synchronously with 'utf-8' encoding
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    // Assert the content
    expect(fileContent.includes('ModelMaker 2.0')).toBe(true);
  });

  it('Load obj file test 1', () => {
    const filePath = path.join(__dirname, '../../../public/quad.obj');
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');

    const mesh = new Mesh();
    mesh.loadOBJFile(fileContent);
    expect(mesh.groupName).toBe("Square01");
    expect(mesh.materialName).toBe("test.mtl");
    expect(mesh.vertexArray.length).toBe(4);
    expect(mesh.vertexArray[0].z).toEqual(0);
    expect(mesh.vertexArray[0].y).toEqual(-0.5);
    expect(mesh.vertexArray[0].x).toEqual(0.5);

    expect(mesh.vertexArray[1].z).toEqual(0);
    expect(mesh.vertexArray[1].y).toEqual(0.5);
    expect(mesh.vertexArray[1].x).toEqual(0.5);

    expect(mesh.vertexArray[2].z).toEqual(0);
    expect(mesh.vertexArray[2].y).toEqual(0.5);
    expect(mesh.vertexArray[2].x).toEqual(-0.5);

    expect(mesh.vertexArray[3].z).toEqual(0);
    expect(mesh.vertexArray[3].y).toEqual(-0.5);
    expect(mesh.vertexArray[3].x).toEqual(-0.5);  

    //TODO: test all the other vertex points, texture coordinates, normal vectors, and polygon faces are correct
    
    expect(mesh.textureCoordinateArray.length).toBe(4);

    expect(mesh.textureCoordinateArray[0].x).toEqual(1);
    expect(mesh.textureCoordinateArray[0].y).toEqual(0);

    expect(mesh.textureCoordinateArray[1].x).toEqual(1);
    expect(mesh.textureCoordinateArray[1].y).toEqual(1);

    expect(mesh.textureCoordinateArray[2].x).toEqual(0);
    expect(mesh.textureCoordinateArray[2].y).toEqual(1);

    expect(mesh.textureCoordinateArray[3].x).toEqual(0);
    expect(mesh.textureCoordinateArray[3].y).toEqual(0);

    expect(mesh.normalArray.length).toBe(1);
    expect(mesh.normalArray[0].x).toEqual(0);
    expect(mesh.normalArray[0].y).toEqual(0);
    expect(mesh.normalArray[0].z).toEqual(1);



    expect(mesh.polygonArray.length).toBe(1);

    expect(mesh.boundingBox.xMax).toBe(0.5);
    expect(mesh.boundingBox.xMin).toBe(-0.5);
    expect(mesh.boundingBox.yMax).toBe(0.5);
    expect(mesh.boundingBox.yMin).toBe(-0.5);
    expect(mesh.boundingBox.zMax).toBe(0);
    expect(mesh.boundingBox.zMin).toBe(0);



  });

});
