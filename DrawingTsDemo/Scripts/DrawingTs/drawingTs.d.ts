declare module DrawingTs {
    class Point {
        public x: number;
        public y: number;
        constructor(x: number, y: number);
        public to(p: Point): Vector;
        public scale(n: number): Point;
    }
    class Vector extends Point {
        constructor(x: number, y: number);
        public norm(): number;
        public add(v: Vector): Vector;
        public subtract(v: Vector): Vector;
        public multiple(n: number): Vector;
        public dotProduct(v: Vector): number;
        public crossProduct(v: Vector): Vector;
    }
    class Rectangle {
        public x: number;
        public y: number;
        public w: number;
        public h: number;
        constructor(x: number, y: number, w: number, h: number);
        public left : number;
        public right : number;
        public top : number;
        public bottom : number;
        public Position : Point;
        public Size : Size;
    }
    class Size {
        public width: number;
        public height: number;
        constructor(width: number, height: number);
    }
}
declare module DrawingTs {
    class Canvas {
        private htmlCanvas;
        private _bufferWidth;
        private _bufferHeight;
        private _zoomX;
        private _zoomY;
        public graphics: Graphics;
        public bufferWidth : number;
        public bufferHeight : number;
        public zoomX : number;
        public zoomY : number;
        public onPaint: (g: Graphics) => any;
        constructor(id: string);
        public setZoom(displayWidth: number, displayHeight: number): void;
        public onPointerDown : (ev: CanvasPointerEvent) => any;
        public onPointerMove : (ev: CanvasPointerEvent) => any;
        public onPointerUp : (ev: CanvasPointerEvent) => any;
        private createPointerEvent(ev);
        private createPointerEventTouch(ev);
        private createPointerEventTouchEnd(ev);
        public paint(): void;
        public getDataURL(type?: string): string;
    }
    class CanvasPointerEvent {
        public canvas: Canvas;
        public position: Point;
        public source: UIEvent;
        public isMultiTouch: boolean;
        public needsPaint: boolean;
        constructor(canvas: Canvas, position: Point, source: UIEvent, isMultiTouch?: boolean, needsPaint?: boolean);
    }
}
declare module DrawingTs {
    class Graphics {
        public rc: CanvasRenderingContext2D;
        constructor(rc: CanvasRenderingContext2D);
        public clear(bkTransparent: boolean, fillBrush?: IBrush): void;
        public drawLine(pen: Pen, p0: Point, p1: Point): void;
        public drawPolyLine(pen: Pen, points: Point[]): void;
        public drawPath(pen: Pen, path: Path): void;
        public fillPath(brush: IBrush, path: Path): void;
        public drawElipse(pen: Pen, rect: Rectangle): void;
        public fillElipse(brush: IBrush, rect: Rectangle): void;
        public drawRect(pen: Pen, rect: Rectangle): void;
        public fillRect(brush: IBrush, rect: Rectangle): void;
        public drawStringOutline(text: string, font: Font, pen: Pen, x: number, y: number, align?: TextAlign, baseline?: TextBaseline): number;
        public drawString(text: string, font: Font, brush: IBrush, x: number, y: number, align?: TextAlign, baseline?: TextBaseline): number;
        public drawImage(image: ImageObject, destPos: Point, destSize?: Size, srcPos?: Point, srcSize?: Size): void;
        private figureElipse(tool, rect, action);
    }
}
declare module DrawingTs {
    class Color {
        public cssColor: string;
        static Black: Color;
        static Silver: Color;
        static Gray: Color;
        static White: Color;
        static Maroon: Color;
        static Red: Color;
        static Purple: Color;
        static Fuchsia: Color;
        static Green: Color;
        static Lime: Color;
        static Olive: Color;
        static Yellow: Color;
        static Navy: Color;
        static Blue: Color;
        static Teal: Color;
        static Aqua: Color;
        constructor(cssColor: string);
        static fromRgb(r: number, g: number, b: number): Color;
        static fromRgba(r: number, g: number, b: number, a: number): Color;
    }
    interface IGraphicsObject {
        applyTo(g: Graphics): any;
    }
    class Font implements IGraphicsObject {
        public cssFont: string;
        constructor(cssFont: string);
        static Create(familyName: string, pxSize: number, style?: FontStyle): Font;
        public applyTo(g: Graphics): void;
    }
    class Pen implements IGraphicsObject {
        public color: Color;
        public width: number;
        public lineDash: number[];
        public lineCap: LineCap;
        public lineJoin: LineJoin;
        public miterLimit: number;
        constructor(color: Color, width?: number, lineDash?: number[], lineCap?: LineCap, lineJoin?: LineJoin, miterLimit?: number);
        public applyTo(g: Graphics): void;
        public clone(): Pen;
    }
    interface IBrush extends IGraphicsObject {
    }
    class SolidBrush implements IBrush {
        public color: Color;
        constructor(color: Color);
        public applyTo(g: Graphics): void;
    }
    class GradientColor {
        public offset: number;
        public color: Color;
        constructor(offset: number, color: Color);
    }
    class LinearGradientBrush implements IBrush {
        public pos0: Point;
        public pos1: Point;
        public colors: GradientColor[];
        constructor(pos0: Point, pos1: Point, colors: GradientColor[]);
        public applyTo(g: Graphics): void;
    }
    class RadialGradientBrush implements IBrush {
        public center0: Point;
        public r0: number;
        public center1: Point;
        public r1: number;
        public colors: GradientColor[];
        constructor(center0: Point, r0: number, center1: Point, r1: number, colors: GradientColor[]);
        public applyTo(g: Graphics): void;
    }
    class ImageObject {
        private imageElement;
        public drawImageWhenIncomplete: (g: Graphics, rect: Rectangle) => void;
        public bounds : Rectangle;
        constructor(width?: number, height?: number);
        public load(source: string, onload: (ev: Event) => any): void;
        public draw(g: Graphics, destPos: Point, destSize?: Size, srcPos?: Point, srcSize?: Size): void;
        private drawImage(g, offsetx, offsety, width, height, canvasOffsetx, canvasOffsety, canvasWidth, canvasHeight);
    }
}
declare module DrawingTs {
    interface IPathData {
        position: Point;
        draw(g: Graphics): any;
    }
    class MoveToPathData implements IPathData {
        public position: Point;
        constructor(position: Point);
        public draw(g: Graphics): void;
    }
    class LineToPathData implements IPathData {
        public position: Point;
        constructor(position: Point);
        public draw(g: Graphics): void;
    }
    class BezierCurveToPathData implements IPathData {
        public ctrlPoint0: Point;
        public ctrlPoint1: Point;
        public position: Point;
        constructor(ctrlPoint0: Point, ctrlPoint1: Point, position: Point);
        public draw(g: Graphics): void;
    }
    class QuadraticCurveToPathData implements IPathData {
        private ctrlPoint;
        public position: Point;
        constructor(ctrlPoint: Point, position: Point);
        public draw(g: Graphics): void;
    }
    class ArcToPathData implements IPathData {
        public ctrlPoint: Point;
        public position: Point;
        public radius: number;
        constructor(ctrlPoint: Point, position: Point, radius: number);
        public draw(g: Graphics): void;
    }
    class ClosePathData implements IPathData {
        public position: Point;
        public draw(g: Graphics): void;
    }
    class Path {
        public items: IPathData[];
        public length : number;
        public moveTo(position: Point): Path;
        public lineTo(position: Point): Path;
        public bezierCurveTo(curve0: Point, curve1: Point, position: Point): Path;
        public quadraticCurveTo(ctrlPoint: Point, position: Point): Path;
        public arcTo(ctrlPoint: Point, position: Point, radius: number): Path;
        public closePath(): Path;
        public draw(g: Graphics): void;
        public push(pathData: IPathData): void;
        public clone(): Path;
    }
}
declare module DrawingTs {
    class DrawingManager {
        public shapes: IShape[];
        public currentItem: IShape;
        public backgroundColor: Color;
        public bkTransparent: boolean;
        private isMouseOn;
        public createEraser(pen: Pen, radial: number): Eraser;
        public onPointerDown(ev: CanvasPointerEvent): void;
        public onPointerMove(ev: CanvasPointerEvent): void;
        public onPointerUp(ev: CanvasPointerEvent): void;
        public onPaint(g: Graphics): void;
        public undo(): void;
    }
    interface IShape {
        contact(position: Point): void;
        drag(position: Point): boolean;
        drop(position: Point): IShape;
        draw(g: Graphics): void;
        erase(center: Point, radius: number): void;
    }
    class Pencil implements IShape {
        public pen: Pen;
        constructor(pen: Pen);
        private path;
        private prev;
        public contact(position: Point): void;
        public drag(position: Point): boolean;
        public drop(position: Point): IShape;
        public draw(g: Graphics): void;
        public erase(center: Point, radius: number): void;
        private clone();
    }
    class Eraser implements IShape {
        public pen: Pen;
        public radius: number;
        constructor(pen: Pen, radius: number);
        public onErase: (center: Point, radius: number) => any;
        public center: Point;
        public contact(position: Point): void;
        public drag(position: Point): boolean;
        public drop(position: Point): IShape;
        public draw(g: Graphics): void;
        public erase(center: Point, radius: number): IShape[];
    }
}
declare module DrawingTs {
    class EnumBase<TValue> {
        private _index;
        private _value;
        constructor(_index: number, _value: TValue);
        public index : number;
        public value : TValue;
    }
    class FontStyle extends EnumBase<string> {
        static Normal: FontStyle;
        static Bold: FontStyle;
        static Italic: FontStyle;
        static ItalicBold: FontStyle;
    }
    class TextBaseline extends EnumBase<string> {
        static Top: TextBaseline;
        static Hanging: TextBaseline;
        static Middle: TextBaseline;
        static Alphabetic: TextBaseline;
        static Ideographic: TextBaseline;
        static Bottom: TextBaseline;
    }
    class TextAlign extends EnumBase<string> {
        static Start: TextAlign;
        static End: TextAlign;
        static Left: TextAlign;
        static Right: TextAlign;
        static Center: TextAlign;
    }
    class LineCap extends EnumBase<string> {
        static Butt: LineCap;
        static Round: LineCap;
        static Square: LineCap;
    }
    class LineJoin extends EnumBase<string> {
        static Bevel: LineJoin;
        static Round: LineJoin;
        static Miter: LineJoin;
    }
}
