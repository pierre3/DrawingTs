/* 
 * drawingTs.graphicsObjects.ts 
 */
module DrawingTs {
    'use strict'

    export class Color {
        static Black = new Color("blak");
        static Silver = new Color("silver");
        static Gray = new Color("gray");
        static White = new Color("white");
        static Maroon = new Color("maroon");
        static Red = new Color("red");
        static Purple = new Color("purple");
        static Fuchsia = new Color("fuchsia");
        static Green = new Color("green");
        static Lime = new Color("lime");
        static Olive = new Color("olive");
        static Yellow = new Color("yellow");
        static Navy = new Color("navy");
        static Blue = new Color("blue");
        static Teal = new Color("teal");
        static Aqua = new Color("aqua");

        constructor(public cssColor: string) { }
        static fromRgb(r: number, g: number, b: number): Color {
            return new Color('rgb(' + r + ',' + g + ',' + b + ')');
        }
        static fromRgba(r: number, g: number, b: number, a: number): Color {
            return new Color('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        }
    }

    export interface IGraphicsObject {
        applyTo(g: Graphics);
    }

    export class Font implements IGraphicsObject {
        constructor(public cssFont: string) { }
        static Create(familyName: string, pxSize: number, style: FontStyle = FontStyle.Normal): Font {
            return new Font(style.value + " " + pxSize + "px " + "'" + familyName + "'");
        }

        public applyTo(g: Graphics) {
            g.rc.font = this.cssFont;
        }
    }

    export class Pen implements IGraphicsObject {
        constructor(public color: Color, public width: number= 1,
            public lineDash: number[]= [], public lineCap: LineCap= LineCap.Butt,
            public lineJoin = LineJoin.Bevel, public miterLimit: number = 10.0) { }
        public applyTo(g: Graphics) {
            g.rc.strokeStyle = this.color.cssColor;
            if (g.rc.setLineDash != undefined) {
                g.rc.setLineDash(this.lineDash);
            }
            g.rc.lineWidth = this.width
            g.rc.lineCap = this.lineCap.value;
            g.rc.lineJoin = this.lineJoin.value;
            g.rc.miterLimit = this.miterLimit;
        }
        public clone(): Pen {
            return new Pen(new Color(this.color.cssColor),
                this.width, this.lineDash, this.lineCap, this.lineJoin, this.miterLimit);
        }
    }

    export interface IBrush extends IGraphicsObject { }

    export class SolidBrush implements IBrush {
        constructor(public color: Color) { }
        applyTo(g: Graphics) {
            g.rc.fillStyle = this.color.cssColor;
        }
    }

    export class GradientColor {
        constructor(public offset: number, public color: Color) { }
    }

    export class LinearGradientBrush implements IBrush {
        constructor(public pos0: Point, public pos1: Point, public colors: GradientColor[]) {
        }
        public applyTo(g: Graphics) {
            var gradient = g.rc.createLinearGradient(this.pos0.x, this.pos0.y, this.pos1.x, this.pos1.y);
            this.colors.forEach((c, _, __) => gradient.addColorStop(c.offset, c.color.cssColor));
            g.rc.fillStyle = gradient;
        }
    }

    export class RadialGradientBrush implements IBrush {
        constructor(public center0: Point, public r0: number,
            public center1: Point, public r1: number, public colors: GradientColor[]) {
        }
        public applyTo(g: Graphics) {
            var gradient = g.rc.createRadialGradient(this.center0.x, this.center0.y, this.r0,
                this.center1.x, this.center1.y, this.r1);
            this.colors.forEach((c, _, __) => gradient.addColorStop(c.offset, c.color.cssColor));
            g.rc.fillStyle = gradient;
        }
    }

    export class ImageObject {
        private imageElement: HTMLImageElement;
        public drawImageWhenIncomplete: (g: Graphics, rect: Rectangle) => void;
        
        public get bounds(): Rectangle {
            return new Rectangle(0, 0, this.imageElement.width, this.imageElement.height);
        }

        constructor(width?: number, height?: number) {
            this.imageElement = new Image(width, height);
            this.drawImageWhenIncomplete = (g, rect) => {
                g.drawRect(new Pen(Color.Blue), rect);
                g.drawLine(new Pen(Color.Red), rect.Position, new Point(rect.right, rect.bottom));
                g.drawLine(new Pen(Color.Red), new Point(rect.right, rect.top), new Point(rect.left, rect.bottom));
            };
        }

        public load(source: string, onload: (ev: Event) => any) {
            this.imageElement.onload = onload;
            this.imageElement.src = source;
        }

        public draw(g: Graphics, destPos: Point, destSize?: Size, srcPos?: Point, srcSize?: Size) {
            var offsetx = (srcPos == null) ? 0 : srcPos.x;
            var offsety = (srcPos == null) ? 0 : srcPos.y;
            var width = (srcSize == null) ? this.imageElement.width : srcSize.width;
            var height = (srcSize == null) ? this.imageElement.height : srcSize.height;

            var canvasOffsetx = (destPos == null) ? 0 : destPos.x;
            var canvasOffsety = (destPos == null) ? 0 : destPos.y;
            var canvasWidth = (destSize == null) ? width : destSize.width;
            var canvasHeight = (destSize == null) ? height : destSize.height;
            if (this.imageElement.complete) {
                this.drawImage(g, offsetx, offsety, width, height, canvasOffsetx, canvasOffsety, canvasWidth, canvasHeight);
            } else {
            if (canvasWidth === 0) { canvasWidth = 32; }
            if (canvasHeight === 0) { canvasHeight = 32; }
                this.drawImageWhenIncomplete(g,new Rectangle( canvasOffsetx, canvasOffsety, canvasWidth, canvasHeight));
            }
        }

        private drawImage(g: Graphics, offsetx: number, offsety: number, width: number, height: number,
            canvasOffsetx: number, canvasOffsety: number, canvasWidth: number, canvasHeight: number) {
            g.rc.drawImage(this.imageElement, offsetx, offsety, width, height, canvasOffsetx, canvasOffsety, canvasWidth, canvasHeight);
        }
    }

}