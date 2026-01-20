import { IndexTriplet } from './IndexTriplet';

describe('IndexTriplet Tests', () => 
{
    it('Load data string test 1', () =>
    {
      const inputDataLine: string = 'f 1/2/3 4/5/6 7/8/9';
      const indexTriplet: IndexTriplet = new IndexTriplet();
      const actualOutput = indexTriplet.setFromOBJFileLine(inputDataLine);
      const expectedOutput = '4/5/6 7/8/9 ';
      expect(actualOutput).toEqual(expectedOutput);
      expect(indexTriplet.vertexIndex).toEqual(1);
      expect(indexTriplet.textureCoordinateIndex).toEqual(2);
      expect(indexTriplet.normalIndex).toEqual(3);
    });

    it('Load data string test 2', () =>
    {
      const inputDataLine: string = '4/5/6 7/8/9';
      const indexTriplet: IndexTriplet = new IndexTriplet();
      const actualOutput = indexTriplet.setFromOBJFileLine(inputDataLine);
      const expectedOutput = '7/8/9 ';
      expect(actualOutput).toEqual(expectedOutput);
      expect(indexTriplet.vertexIndex).toEqual(4);
      expect(indexTriplet.textureCoordinateIndex).toEqual(5);
      expect(indexTriplet.normalIndex).toEqual(6);
    });

    it('Load data string test 3', () =>
    {
      const inputDataLine: string = '7/8/9';
      const indexTriplet: IndexTriplet = new IndexTriplet();
      const actualOutput = indexTriplet.setFromOBJFileLine(inputDataLine);
      const expectedOutput = '';
      expect(actualOutput).toEqual(expectedOutput);
      expect(indexTriplet.vertexIndex).toEqual(7);
      expect(indexTriplet.textureCoordinateIndex).toEqual(8);
      expect(indexTriplet.normalIndex).toEqual(9);
    });

});
