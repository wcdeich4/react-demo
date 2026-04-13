export class GlobalSingleton
{
    private static instance: GlobalSingleton = new GlobalSingleton();
    //TODO: add map or properties
    private constructor() {}

    public static getInstance(): GlobalSingleton
    {
        return this.instance;
    }
}