import { ComplexPoint } from './ComplexPoint';
import { Probability } from './Probability';

describe('ComplexPoint', () => {

    it('Complex Number Clone', () => {
        const z = new ComplexPoint(5, -7);
        let w: ComplexPoint;
        w = z.clone() as ComplexPoint;
        expect(z.equals(w)).toEqual(true);
    });
  
    it('Complex Number e to i theta', () => {
        const theta = Math.PI / 3;
        const z = ComplexPoint.eToITheta(theta);
        expect(z.x === Math.cos(theta));
        expect(z.y === Math.sin(theta));
    });

    it('Complex Number Add', () => {
        const first = new ComplexPoint(-3, 99);
        const second= new ComplexPoint(88, -104);
        const third = first.getSumWith(second);
        expect(third.x === (first.x + second.x));
        expect(third.y === (first.y + second.y));
    });

    it('Complex Number Subtract', () => {
        const first = new ComplexPoint(-5, 999);
        const second= new ComplexPoint(88, -104);
        const third = first.getDifferenceWith(second);
        expect(third.x === (first.x - second.x));
        expect(third.y === (first.y - second.y));
    });

    it('Complex Number Multiply by Scalar', () => {
        const c = new ComplexPoint(-5, 999);
        const scalar = -1234567;
        const result = c.getMultipliedByScalar(scalar);
        expect(result.x === (c.x * scalar));
        expect(result.y === (c.y * scalar));
    });

    
    it('Complex Number Divide by Scalar', () => {
        const c = new ComplexPoint(-5, 999);
        const scalar = -1234567;
        const result = c.getDividedByScalar(scalar);
        expect(result.x === (c.x / scalar));
        expect(result.y === (c.y / scalar));
    });

    it('Complex Numbers multiply', () => {
        const r1 = -9876;
        const i1 = 12345;
        const r2 = 3654;
        const i2 = -654987;
        let c1 = new ComplexPoint(r1,i1);
        let c2 = new ComplexPoint(r2,i2);
        let c3 = c1.getMultipliedByComplexPoint(c2);
        expect(c3.x === r1*r2 - i1*i2);
        expect(c3.y === r1*i2 + r2*i1);        
    });

    it('Complex Numbers squared', () => {
        const r1 = -9876;
        const i1 = 12345;
        let c = new ComplexPoint(r1,i1);
        let c3 = c.getSquared();
        expect(c3.x === r1*r1 - i1*i1);
        expect(c3.y === r1*i1 + r1*i1);        
    });

    it('Complex Number magnitude', () => {
        let c = new ComplexPoint(3,7);
        let r = c.magnitude();
        expect(r == Math.sqrt(3*3 + 7*7));
    }); 

    it('Complex Number normalize', () => {
        const r1 = Probability.getRandomNumberInRange(-10000, 10000);
        const i1 = Probability.getRandomNumberInRange(-10000, 10000);
        const c = new ComplexPoint(r1, i1);
        let normalizedVector = c.getNormalized();
        expect(1 == normalizedVector.magnitude());
    }); 

    it('Complex Number GetAngle #0', () => {
        let c = new ComplexPoint(0,0);
        let angle = c.getAngle();
        expect(angle == 0)
    }); 

    it('Complex Number GetAngle #1', () => {
        let c = new ComplexPoint(0,1);
        let angle = c.getAngle();
        expect(angle == Math.PI / 2)
    }); 

    it('Complex Number GetAngle #2', () => {
        let c = new ComplexPoint(-1,0);
        let angle = c.getAngle();
        expect(angle == Math.PI)
    }); 

    it('Complex Number GetAngle #3', () => {
        let c = new ComplexPoint(0, -1);
        let angle = c.getAngle();
        expect(angle == -Math.PI / 2)
    }); 

    it('Complex Number GetAngle #4', () => {
        let c = new ComplexPoint(1,1);
        let angle = c.getAngle();
        expect(angle == Math.PI / 4)

    }); 

    it('Complex Number GetAngle #5', () => {
        let c = new ComplexPoint(-1,1);
        let angle = c.getAngle();
        expect(angle == 3 * Math.PI / 4)
    }); 

    it('Complex Number GetAngle #6', () => {
        let c = new ComplexPoint(-1,-1);
        let angle = c.getAngle();
        expect(angle == 5 * Math.PI / 4)
    }); 

    it('Complex Number GetAngle #7', () => {
        let c = new ComplexPoint(1,-1);
        let angle = c.getAngle();
        expect(angle == -Math.PI / 4)

    });  

    it('Complex Number Raise To Power #1', () => {
        const r1 = Probability.getRandomNumberInRange(-10000, 10000);
        const i1 = Probability.getRandomNumberInRange(-10000, 10000);
        const c1 = new ComplexPoint(r1, i1);
        const power = 11;
        let expectedResult = c1.clone();
        let i = 1;
        while (i < power)
        {
            expectedResult = expectedResult.getMultipliedByComplexPoint( expectedResult);
            i++;
        }
        const actualResult = c1.raiseToPower(power);
        expect(expectedResult.equals(actualResult));


    });





});