import { Pixel } from './Pixel';
import { Matrix } from "../math/Matrix";
/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
console.log('worker received message: ' + data);
});

const stemMatrix = new Matrix([[0, 0],[0, 0.16]]);
const smallLeafletMatrix = new Matrix([[0.85, 0.04],[-0.04, 0.85]]);
smallLeafletMatrix.transpose(); //transpose for left handed point multiplication
const smallLeafletOffsetPixel = new Pixel(0, 1.6);
const largeLeftLeafletMatrix = new Matrix([[0.2, -0.23],[0.26, 0.22]]);
largeLeftLeafletMatrix.transpose(); //transpose for left handed point multiplication
const largeLeftLeafletOffsetPixel = new Pixel(0, 1.6);
const largeRightLeafletMatrix = new Matrix([[-0.15, 0.28],[0.26, 0.24]]);
largeRightLeafletMatrix.transpose(); //transpose for left handed point multiplication
const largeRightLeafletOffsetPixel = new Pixel(0, 0.44);

let randomValue: number = 0;
let currentPixel = new Pixel(0, 0);
currentPixel.color = 'green';
let i:number = 0;
while (i < 60000 )
{
    if (randomValue < 0.01) 
    {
        currentPixel.transformLeftOfMatrix(stemMatrix);
        //stemMatrix.transformPixelOnRight(currentPixel);
        currentPixel.color = 'brown';
    }
    else if (randomValue < 0.86)
    {
        currentPixel.transformLeftOfMatrix(smallLeafletMatrix);
        currentPixel.add(smallLeafletOffsetPixel);
        currentPixel.color = '#00FF80';
    }
    else if (randomValue < 0.93)
    {
        currentPixel.transformLeftOfMatrix(largeLeftLeafletMatrix);
        currentPixel.add(largeLeftLeafletOffsetPixel);
        currentPixel.color = '#00FF60';
    }
    else 
    {
        currentPixel.transformLeftOfMatrix(largeRightLeafletMatrix);
        currentPixel.add(largeRightLeafletOffsetPixel);
        currentPixel.color = '#00FF40';
    }
    i++;
    randomValue = Math.random();
    
    postMessage(JSON.stringify(currentPixel));
}

