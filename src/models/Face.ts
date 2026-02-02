import { Coordinate } from "./Coordinate";

export class Face{
  //TODO: add material & lighting
  public coordinates: Coordinate[];
  constructor(coords?: Coordinate[]){
    if(coords){
      this.coordinates = coords;
    }
  }
}