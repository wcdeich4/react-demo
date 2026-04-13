import { ColorHelper } from './ColorHelper';
import { StringHelper } from './StringHelper';

describe('ColorHelper tests', () => {

  it('numberToHexString should return 00 for 0', () => {
    expect(ColorHelper.numberToHexString(0)).toBe('00');
  });

  it('numberToHexString should convert 1 to ff', () => {
    expect(ColorHelper.numberToHexString(1)).toBe('ff');
  });

  it('numberToHexString should convert 255 to ff', () => {
    expect(ColorHelper.numberToHexString(255)).toBe('ff');
  });

  it('numberToHexString should convert 0.5 to 80', () => {
    expect(ColorHelper.numberToHexString(0.5)).toBe('80');
  });

  // it('ColorHelper.MTLFileLineToHTMLHexadecimalColorString', () => {
  //     const inputString = 'Ks 0 0.2 1 ';
  //     const expectedOutput: string = '#0033ff';
  //     let actualOutput: string = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(inputString);


  //   //  var lineTokens: Array<string> = inputString.split(/(\s+)/);
  //    // lineTokens = lineTokens.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
  //  //   return ColorHelper.stringArrayToHTMLHexadecimalColorString(lineTokens, 1);





  //     expect(actualOutput).toEqual(expectedOutput);
  // });


});