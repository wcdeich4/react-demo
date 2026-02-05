import { Point3D } from "./Point3D";

export interface IPerspectiveTransform
{
    tranform(input: Point3D ): Point3D ;
}