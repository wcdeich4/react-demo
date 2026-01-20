import { Vector } from '../math/Vector';
import { Matrix } from "../math/Matrix";
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
console.log('worker received message: ' + data);
});

const stemMatrix = new Matrix([[0, 0],[0, 0.16]]);
const smallLeafletMatrix = new Matrix([[0.85, 0.04],[-0.04, 0.85]]);
const smallLeafletOffsetVector = new Vector([0, 1.6]);
const largeLeftLeafletMatrix = new Matrix([[0.2, -0.26],[0.23, 0.22]]);
const largeLeftLeafletOffsetVector = new Vector([0, 1.6]);
const largeRightLeafletMatrix = new Matrix([[-0.15, 0.28],[0.26, 0.24]]);
const largeRightLeafletOffsetVector = new Vector([0, 0.44]);

let randomValue: number = 0;
let currentPoint = new Vector([0, 0]);
let i:number = 0;
while (i < 60000 )
{
    if (randomValue < 0.01) 
    {
        currentPoint = stemMatrix.multiplyByVectorOnRight(currentPoint);
    }
    else if (randomValue < 0.86)
    {
        currentPoint = smallLeafletMatrix.multiplyByVectorOnRight(currentPoint);
        currentPoint.add(smallLeafletOffsetVector);
    }
    else if (randomValue < 0.93)
    {
        currentPoint = largeLeftLeafletMatrix.multiplyByVectorOnRight(currentPoint);
        currentPoint.add(largeLeftLeafletOffsetVector);
    }
    else 
    {
        currentPoint = largeRightLeafletMatrix.multiplyByVectorOnRight(currentPoint);
        currentPoint.add(largeRightLeafletOffsetVector);
    }
    i++;
    randomValue = Math.random();
    
    postMessage(JSON.stringify(currentPoint));
}

