import {
    Point,
    Bounds
} from "pixi.js"

function lerpPoint(start: Point, end: Point, time: number): Point {
    return new Point(
        start.x + ((end.x - start.x) * time),
        start.y + ((end.y - start.y) * time)
    )
}

function pointDistance(start: Point, end: Point): number {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}

function boundsOverlap(a: Bounds, b: Bounds): boolean {
    const aW: number = a.maxX - a.minX;
    const aH: number = a.maxY - a.minY;

    const bW: number = b.maxX - b.minX;
    const bH: number = b.maxY - b.minY;

    console.log(a.minX, a.maxX, a.minY, a.maxY);

    const collision: boolean = a.minX < b.maxX && a.maxX > b.minX
        && a.minY < b.maxY && a.maxY > b.minY;

    return collision;
}

export { 
    lerpPoint,
    pointDistance,
    boundsOverlap
}