import { Vector } from "./Vector";

export interface IPerspectiveTransform
{
    tranform(input: Vector ): Vector ;
}