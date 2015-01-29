module DrawingTs {
    'use strict'

    export class EnumBase {
        constructor(private index: number, private name: string) { }
        public ordinal(): number { return this.index; }
        public asString(): string { return this.name; }
    }
    export class FontStyle extends EnumBase {
        static normal = new FontStyle(0, "");
        static bold = new FontStyle(1, "bold");
        static italic = new FontStyle(2, "italic");
        static italicBold = new FontStyle(3, "italic bold");
    }

    export class TextBaseline extends EnumBase {
        static top = new TextBaseline(0, "top");
        static hanging = new TextBaseline(1, "hanging");
        static middle = new TextBaseline(2, "middle");
        static alphabetic = new TextBaseline(3, "alphabetic");
        static ideographic = new TextBaseline(4, "ideographic");
        static bottom = new TextBaseline(5, "bottom");
    }

    export class TextAlign extends EnumBase {
        static start = new TextAlign(0, "start");
        static end = new TextAlign(1, "end");
        static left = new TextAlign(2, "left");
        static right = new TextAlign(3, "right");
        static center = new TextAlign(4, "center");
    }

    export class LineCap extends EnumBase {
        static butt = new LineCap(0, "butt");
        static round = new LineCap(1, "round");
        static square = new LineCap(2, "square");
    }

    export class LineJoin extends EnumBase {
        static bevel = new LineJoin(0, "bevel");
        static round = new LineJoin(1, "round");
        static miter = new LineJoin(2, "miter");
    }

    export class Color {
        constructor(public cssColor: string) { }
        static fromRgb(r: number, g: number, b: number): Color {
            return new Color('rgb(' + r + ',' + g + ',' + b + ')');
        }
        static fromRgba(r: number, g: number, b: number, a: number): Color {
            return new Color('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        }
    }

    export class Font implements IGraphicsObject {
        constructor(public cssFont: string) { }
        static Create(familyName: string, pxSize: number, style: FontStyle = FontStyle.normal): Font {
            return new Font(style.asString() + " " + pxSize + "px " + "'" + familyName + "'");
        }

        public applyTo(g: Graphics) {
            g.rc.font = this.cssFont;
        }
    }

    export interface IGraphicsObject {
        applyTo(g: Graphics);
    }

    export class Pen implements IGraphicsObject {
        constructor(public color: Color, public width: number= 1,
            public lineDash: number[]= [], public lineCap: LineCap= LineCap.butt,
            public lineJoin = LineJoin.bevel, public miterLimit: number = 10.0) { }
        public applyTo(g: Graphics) {
            g.rc.strokeStyle = this.color.cssColor;
            if (g.rc.setLineDash != undefined) {
                g.rc.setLineDash(this.lineDash);
            }
            g.rc.lineWidth = this.width
            g.rc.lineCap = this.lineCap.asString();
            g.rc.lineJoin = this.lineJoin.asString();
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
}