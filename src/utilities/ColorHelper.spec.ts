import { ColorHelper } from './ColorHelper';
import { StringHelper } from './StringHelper';

describe('ColorHelper tests', () => {

  it('ColorHelper.MTLFileLineToHTMLHexadecimalColorString', () => {
      const inputString = 'Ks 0 0.2 1 ';
      const expectedOutput: string = '#0033ff';
      let actualOutput: string = ColorHelper.MTLFileLineToHTMLHexadecimalColorString(inputString);


    //  var lineTokens: Array<string> = inputString.split(/(\s+)/);
     // lineTokens = lineTokens.filter( a => !StringHelper.isUndefinedOrNullOrEmptyOrWhitespace(a));
   //   return ColorHelper.stringArrayToHTMLHexadecimalColorString(lineTokens, 1);





      expect(actualOutput).toEqual(expectedOutput);
  });


});