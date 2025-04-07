export declare class Bounds {
    readonly left: number;
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    constructor(left: number, top: number, right: number, bottom: number);
    static from(data: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    }): Bounds;
    static fromJSON(json: string): Bounds;
    toJSON(): {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    clone(): Bounds;
}
