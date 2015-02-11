/* 
 * drawingTs.manager.ts 
 */
module DrawingTs {
    'use strict'
    export class DrawingManager {
        public shapes: IShape[] = [];
        public currentItem: IShape;
        
        public backgroundColor:Color = new Color('white');
        public bkTransparent: boolean = false;

        private isMouseOn: boolean = false;

        public createEraser(pen: Pen, radial: number): Eraser {
            var eraser = new Eraser(pen, radial);
            eraser.onErase = (c, r) => {
                this.shapes.forEach((shape, _, __) => {
                    shape.erase(c, r);
                });
            };
            return eraser;
        }

        public onPointerDown(ev: CanvasPointerEvent) {
            this.currentItem.contact(ev.position);
            this.isMouseOn = true;
        }

        public onPointerMove(ev: CanvasPointerEvent) {
            if (this.isMouseOn == false) { return; }
            ev.needsPaint = this.currentItem.drag(ev.position);
        }

        public onPointerUp(ev: CanvasPointerEvent) {
            this.isMouseOn = false;
            var obj = this.currentItem.drop(ev.position);
            if (obj != null) {
                this.shapes.push(obj);
            }
        }

        public onPaint(g: Graphics) {
            g.clear(this.bkTransparent,new SolidBrush(this.backgroundColor));
            this.shapes.forEach(shape=> shape.draw(g));
            this.currentItem.draw(g);
        }

        public undo():void {
            this.shapes.pop();
        }
    }

    export interface IShape {
        contact(position: Point): void;
        drag(position: Point): boolean;
        drop(position: Point): IShape;
        draw(g: Graphics): void;
        erase(center: Point, radius: number): void;
    }

    export class Pencil implements IShape {
        constructor(public pen: Pen) { }
        private path: Path = new Path();
        private prev: Point;

        public contact(position: Point): void {
            this.path.moveTo(position);
            this.prev = position;
        }

        public drag(position: Point): boolean {
            if (this.prev == null) return;
            if (this.prev.to(position).norm() <2)
            { return false; }

            this.path.lineTo(position);
            this.prev = position;
            return true;
        }

        public drop(position: Point): IShape {
            var result = this.clone();
            this.path = new Path();
            this.prev = null;
            return result;
        }

        public draw(g: Graphics): void {
            g.drawPath(this.pen, this.path);
        }

        public erase(center: Point, radius: number): void {
            var buf: Path =new Path();
            var head = true;

            this.path.items.forEach((p, i, _) => {
                if (center.to(p.position).norm() <= radius) {
                    head = true;
                } else {
                    if (head == true) {
                        buf.moveTo(p.position);
                        head = false;
                    } else {
                        buf.push(p);
                    }
                }

            }, this);
            this.path = buf;

        }

        private clone(): IShape {
            var instance = new Pencil(this.pen);
            instance.path = this.path.clone();
            return instance;
        }
    }

    export class Eraser implements IShape {
        constructor(public pen: Pen, public radius: number) { }

        public onErase: (center: Point, radius: number) => any;

        public center: Point;

        public contact(position: Point): void {
            this.center = position;
            if (this.onErase != null) {
                this.onErase(this.center, this.radius);
            }
        }

        public drag(position: Point) :boolean{
            this.center = position;
            if (this.onErase != null) {
                this.onErase(this.center, this.radius);
                return true;
            }
            return false;
        }

        public drop(position: Point): IShape {
            this.center = null;
            return null;
        }

        public draw(g: Graphics) {
            if (this.center == null) { return; }
            var bounds = new Rectangle(
                this.center.x - this.radius,
                this.center.y - this.radius,
                this.radius * 2,
                this.radius * 2);
            g.drawElipse(this.pen, bounds);
        }

        public erase(center: Point, radius: number): IShape[] {
            return [];
        }
    }

}
