import { Material } from "./mesh/Material";

export class GlobalSingleton
{
    private static instance: GlobalSingleton = new GlobalSingleton();
    //TODO: add map or properties
    private constructor() {
        this.materialNameObjectMap = new Map<string, Material>();
    }

    public materialNameObjectMap: Map<string, Material>;

    public static getInstance(): GlobalSingleton
    {
        return this.instance;
    }
}