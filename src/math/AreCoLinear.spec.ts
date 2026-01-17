import { AreCoLinear } from './AreCoLinear';

describe('AreCoLinear', () => {

    it('AreCoLinear.twoDimensional false', () => {
        const isColinear = AreCoLinear.twoDimensional(0, 0, 2, 2.1, 5, 5);
        expect(isColinear).toEqual(false);
    });

    it('AreCoLinear.twoDimensional true', () => {
        const isColinear = AreCoLinear.twoDimensional(0, 0, 2, 2, 5, 5);
        expect(isColinear).toEqual(true);
    });

});