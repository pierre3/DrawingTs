/* 
 * drawingTs.graphicsPath.ts 
 */
module DrawingTs {
    'use strict'
   
    export interface IPathData {
        position: Point;
        draw(g: Graphics);
    }

    export class MoveToPathData implements IPathData {
        constructor(public position: Point) { }
        public draw(g: Graphics) {
            g.rc.moveTo(this.position.x, this.position.y);
        }
    }

    export class LineToPathData implements IPathData {
        constructor(public position: Point) { }
        public draw(g: Graphics) {
            g.rc.lineTo(this.position.x, this.position.y);
        }
    }

    export class BezierCurveToPathData implements IPathData {
        constructor(public ctrlPoint0: Point, public ctrlPoint1: Point, public position: Point) { }
        public draw(g: Graphics) {
            g.rc.bezierCurveTo(this.ctrlPoint0.x, this.ctrlPoint0.y,
                this.ctrlPoint1.x, this.ctrlPoint1.y,
                this.position.x, this.position.y);
        }
    }

    export class QuadraticCurveToPathData implements IPathData {
        constructor(private ctrlPoint: Point, public position: Point) { }
        public draw(g: Graphics) {
            g.rc.quadraticCurveTo(this.ctrlPoint.x, this.ctrlPoint.y,
                this.position.x, this.position.y);
        }
    }

    export class ArcToPathData implements IPathData {
        constructor(public ctrlPoint: Point, public position: Point,public radius:number) {
        }
        public draw(g: Graphics) {
            g.rc.arcTo(this.ctrlPoint.x, this.ctrlPoint.y,
                this.position.x, this.position.y, this.radius);
        }
    }

    export class ClosePathData implements IPathData {
        public position: Point = null;
        public draw(g: Graphics) {
            g.rc.closePath();
        }
    }

    export class Path {
        public items: IPathData[] = [];

        public get length(): number {
            return this.items.length;
        }

        public moveTo(position: Point): Path {
            this.items.push(new MoveToPathData(position));
            return this;
        }

        public lineTo(position: Point): Path {
            this.items.push(new LineToPathData(position));
            return this;
        }

        public bezierCurveTo(curve0: Point, curve1: Point, position: Point): Path {
            this.items.push(new BezierCurveToPathData(curve0, curve1, position));
            return this;
        }

        public quadraticCurveTo(ctrlPoint: Point, position: Point): Path {
            this.items.push(new QuadraticCurveToPathData(ctrlPoint, position));
            return this;
        }

        public arcTo(ctrlPoint: Point, position: Point, radius: number):Path {
            this.items.push(new ArcToPathData(ctrlPoint, position, radius));
            return this;
        }
        public closePath(): Path {
            this.items.push(new ClosePathData());
            return this;
        }

        public draw(g: Graphics) {
            this.items.forEach((p, i, _) => {
                p.draw(g);
            });
        }

        public push(pathData: IPathData) {
            this.items.push(pathData);
        }

        public clone(): Path {
            var obj = new Path();
            obj.items = this.items.slice();
            return obj;
        }

    }

}