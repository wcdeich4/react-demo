export abstract class EquatableWithTolerance
{
    public static Tolerance: number = 0.00005; //0.00000001;
    public abstract equals(obj: any): boolean;
}