import { Point2D } from './Point2D';
import { ICloneable } from './ICloneable';

/**
 * Complex Number class.  x is used for the real number and y is used for the imaginary part to support casting to Point2D
 */
export class ComplexPoint extends Point2D implements ICloneable<ComplexPoint>
{
  /**
   * ComplexPoint constructor. Note: If you do not know the initial values desired, you can create use new ComplexPoint(0,0)
   * @constructor
   * @param {number} a - real component
   * @param {number} b - imaginary component
   */
  constructor(a: number, b: number)
  {
    super(a, b);
  }

  /**
   * e raised to i theta is a fundamental formula for how to specify a complex number; 
   * so much so we should have an alternate constructor for this formula, but TypeScript 
   * does not allow overload constructors, so this static factory method was created. 
   * Factory methods are usually in a separate file, but it is not work a separate file 
   * for a single static factory method.
   * @param theta the angle in radians
   * @returns ComplexPoint
   */
  public static eToITheta(theta: number): ComplexPoint
  {
    return new ComplexPoint(Math.cos(theta), Math.sin(theta));
  }

  /**
   * implement ICloneable
   * @returns new ComplexPoint with the same values as this one.
   */
  public clone(): ComplexPoint
  {
    return new ComplexPoint(this.x, this.y);
  }

  /**
   * Get a new ComplexPoint object equal to the sum of this complex number and other complex number without modifying this complex number.
   * @param other {ComplexPoint} other complex number to add to this complex number
   * @returns {ComplexPoint} new coplex number equal to the sum of this complex number and other complex number
   */
  public getSumWith(other: ComplexPoint): ComplexPoint
  {
    let result = this.clone();
    result.add(other);
    return result;
  }

    /**
   * Get a new complex number object equal to the difference of this complex number and other complex number without modifying this complex number.
   * @param other {ComplexPoint} complex number to subtract from this complex number
   * @returns {ComplexPoint} new coplex number equal to the difference of this complex number and other complex number
   */
  public getDifferenceWith(other: ComplexPoint): ComplexPoint
  {
    let result = this.clone();
    result.subtract(other);
    return result;
  }

  /**
   * Get a new complex number object equal to this complex number multiplied by scalar without modifying this complex number.
   * @param scalar {number} to mulitpy by
   * @returns {ComplexPoint} equal to this complex number multiplied by scalar
   */
  public getMultipliedByScalar(scalar: number): ComplexPoint
  {
    let result = this.clone();
    result.multiplyByScalar(scalar);
    return result;
  }

  /**
   * Get a new complex number object equal to this complex number divided by scalar without modifying this complex number.
   * @param scalar {number} to divide by
   * @returns {ComplexPoint} equal to this complex number divided by scalar
   */
  public getDividedByScalar(scalar: number): ComplexPoint
  {
    let result = this.clone();
    result.divideByScalar(scalar);
    return result;
  }

  /***
   * Mulitply this complex number by another complex number, and store the result in this complex number object. Warning, changes the values of this complex number object.
   * @param other {ComplexPoint} the other complex number to mulitply this complex number by
   */
  public multiplyByComplexPoint(other: ComplexPoint): void
  {
    //can't update this.x yet because the original this.x is also in the formula for this.y
    const newx = this.x * other.x - this.y * other.y;
    this.y = this.x * other.y + other.x * this.y;
    this.x =  newx;
  }

  /**
   * Get a new complex number equal to this complex number multiplied by other complex number without this complex number object, nor other complex number oblect.
   * @param other {ComplexPoint} the other complex number to mulitply this complex number by
   * @returns {ComplexPoint} equal to this complex number multiplied by other complex number
   */
  public getMultipliedByComplexPoint(other: ComplexPoint): ComplexPoint
  {
    let result = this.clone();
    result.multiplyByComplexPoint(other);
    return result;
  }

  /***
   * Square this complex number. Becasue there are so many formulas that specifically involve squaring, a function that raises to the 2nd power specifically is very useful. 
   */
  public square(): void
  {
    //can't update this.x yet because the original this.x is also in the formula for this.y
    const newx = this.x * this.x - this.y * this.y;
    this.y = this.x * this.y + this.x * this.y;
    this.x = newx;
  }

  /**
   * Get a new ComplexPoint object equal to this ComplexPoint object without changing this ComplexPoint object.
   * @returns {ComplexPoint} equal to this complex number squared.
   */
  public getSquared(): ComplexPoint
  {
    let result = this.clone();
    result.square();
    return result;
  }

  /**
   * Get magnitude / radius length of this complex number on the complex plane squared.  A bit of a hack, but more efficient
   * @returns {number} magnitude
   */
  public magnitudeSquared(): number
  {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get magnitude / radius length of this complex number on the complex plane
   * @returns {number} magnitude
   */
  public magnitude(): number
  {
    return Math.sqrt(this.magnitudeSquared());
  }

  /**
   * Get a new complex number which is equal to this complex number normalized, without modifying this ComplexPoint object.
   * @returns {ComplexPoint} with radius 1
   */
  public getNormalized(): ComplexPoint
  {
    let result = this.clone();
    result.normalize();
    return result;
  }

  /**
   * Get angle with positive real axis for this complex number on the complex plane
   * @returns {number} angle in radians
   */
  public getAngle(): number
  {
    let theta = 0;
    if (this.x == 0 || this.y == 0)
    {
      if (this.x == 0)
      {
        if (this.y > 0)
        {
            theta = Math.PI / 2;
        }
        else
        {
            theta = 3 * Math.PI / 2;
        }
      }
      else
      {
        theta = Math.atan(this.y / this.x);
        if (this.x < 0 && this.y > 0)
        {
            theta += Math.PI / 2;
        }
        else if (this.x < 0 && this.y < 0)
        {
            theta += Math.PI ;
        }
      }
    }
    return theta;
  }

  /**
 * raise this complex number to a power (modifies this complex number object)
 * @param {number} power exponent to raise this complex nuber to
 */
  public raiseToPower(power: number): void
  {
    let theta = power * this.getAngle() ;
    let radius = power * this.magnitude();
    this.x = radius * Math.cos(theta);
    this.y = radius * Math.sin(theta);
  }

  /**
  * Get a new ComplexPoint object equal to this ComplexPoint raised to a power, without modifying this ComplexPoint object.
  * @param power {number} exponent to raise this complex number to
  * @returns {ComplexPoint} new complex number equal to this ComplexPoint raised to a power
  */
  public getRaisedToPower(power: number): ComplexPoint
  {
    let result = this.clone();
    result.raiseToPower(power);
    return result;
  }

}
