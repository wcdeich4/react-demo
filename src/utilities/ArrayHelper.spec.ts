import { ArrayHelper } from './ArrayHelper';

describe('ArrayHelper tests', () =>
{

    it('ArrayHelper.countElementsThatStartWith', () =>
    {
        const arrayToAnalyze: Array<string> = ['aa', 'ba', 'ca', 'zz'];
        const count: number = ArrayHelper.countElementsThatStartWith(arrayToAnalyze, 'a');
        expect(count).toEqual(1);
    });

    it('ArrayHelper.ArraysContainSameNumbers', () =>
    {
        const a1: Array<number> = [1, 2, 3];
        const a2: Array<number> = [5, 2, 3];
        expect(ArrayHelper.ArraysContainSameNumbers(a1, a2, .001)).toEqual(false);
    });

    it('ArrayHelper.stringArrayToNumberArray', () =>
    {
        const stringArray: Array<string> = ['Kd', '0.6', '0.6', '0.6'];
        const expected: Array<number> = [0.6, 0.6, 0.6];
        const actual: Array<number> = ArrayHelper.stringArrayToNumberArray(stringArray, 1);
        expect(ArrayHelper.ArraysContainSameNumbers(expected, actual, .001)).toEqual(true);
    });


});