export type IIntegralApproximationResult =
{
    beginInterval: number;
    endInterval: number;
    numberOfSubintervals: number;
    LeftRectangleSum: number; //Riemann Sums using left endpoints
    RightRectangleSum: number; //Riemann Sums using right endpoints
    MidpointRectangleSum: number; //Riemann Sums using midpoints
    TrapezoidalSum: number; //Trapezoidal Rule Sum
    SimpsonSum: number; //Simpson's Rule Sum
};