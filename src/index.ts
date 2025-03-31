import { AssistsX } from "../types/AssistsX";

export function greet(name: string): string {
    const assistsX = AssistsX.getInstance();
    return `Hello, ${name}!`;
}