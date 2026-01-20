import { ArrayHelper } from './ArrayHelper';

describe('ArrayHelper tests', () => {

  it('ArrayHelper.stringToNumberArray', () => {
      const inputString = 'v    0 1 2  3 4 5';
      const outputArray: Array<number> = ArrayHelper.stringToNumberArray(inputString, /\s+/g);
      expect(outputArray.length).toEqual(6);
      expect(outputArray[0]).toEqual(0);
      expect(outputArray[1]).toEqual(1);
      expect(outputArray[2]).toEqual(2);
      expect(outputArray[3]).toEqual(3);
      expect(outputArray[4]).toEqual(4);
      expect(outputArray[5]).toEqual(5);
  });

  it('ArrayHelper.countElementsThatContain', () => {
    const arrayToAnalyze: Array<string> = ['aa', 'ba', 'ca', 'zz'];
    const count: number = ArrayHelper.countElementsThatContain(arrayToAnalyze, 'a');
    expect(count).toEqual(3);
});

it('ArrayHelper.countElementsThatStartWith', () => {
    const arrayToAnalyze: Array<string> = ['aa', 'ba', 'ca', 'zz'];
    const count: number = ArrayHelper.countElementsThatStartWith(arrayToAnalyze, 'a');
    expect(count).toEqual(1);
});




});