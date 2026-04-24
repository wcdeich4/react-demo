import * as fs from 'fs';
import * as path from 'path';
import { Material } from './Material';
import { ArrayHelper } from '../../utilities/ArrayHelper';

describe('Material tests', () => {
  it('should read the file content as a string', () => {
    // Construct the file path relative to the current test file
    const filePath = path.join(__dirname, '../../../public/test.mtl');
    // Read the file synchronously with 'utf-8' encoding
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    // Assert the content
    expect(fileContent.includes('test')).toBe(true);
  });

  it('Load mtl file test 1', async () => {
    const filePath = path.join(__dirname, '../../../public/test.mtl');
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    const material = new Material();
    
    await material.load(fileContent).then(() => {
      expect(material.textureImageElement.width).toBe(26);
      expect(material.textureImageElement.height).toBe(36);
    }).catch((error) => {
      console.error("Error loading material: ", error);
    });
    expect(material.name).toBe("test");
    expect(material.illuminationModel).toBe(4);
    const expectedDiffuseColor = [0.6, 0.6, 0.6];



console.log("material.diffuseColor ======= ", material.diffuseColor);

    expect(ArrayHelper.ArraysContainSameNumbers(expectedDiffuseColor, material.diffuseColor, .001)).toEqual(true);

    const expectedAmbientColor = [0.2, 0.2, 0.2];
    expect(ArrayHelper.ArraysContainSameNumbers(expectedAmbientColor, material.ambientColor, .001)).toEqual(true);

    const expectedSpecularColor = [0.2, 0.2, 0.2];

console.log("material.specularColor ======= ", material.specularColor);
    expect(ArrayHelper.ArraysContainSameNumbers(expectedSpecularColor, material.specularColor, .001)).toEqual(true);

    const expectedEmissiveColor = [0, 1, 0];
    expect(ArrayHelper.ArraysContainSameNumbers(expectedEmissiveColor, material.emissiveColor, .001)).toEqual(true);



  });

});
