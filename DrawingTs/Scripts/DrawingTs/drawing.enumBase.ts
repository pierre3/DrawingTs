/*
 * drawingTs.enumBase.ts
 */
module DrawingTs {
    export class EnumBase<TValue>{
        constructor(private _index: number, private _value: TValue) { }
        public get index(): number { return this._index; }
        public get value(): TValue { return this._value; }
    }

    export class FontStyle extends EnumBase<string> {
        static Normal = new FontStyle(0, "");
        static Bold = new FontStyle(1, "bold");
        static Italic = new FontStyle(2, "italic");
        static ItalicBold = new FontStyle(3, "italic bold");
    }

    export class TextBaseline extends EnumBase<string> {
        static Top = new TextBaseline(0, "top");
        static Hanging = new TextBaseline(1, "hanging");
        static Middle = new TextBaseline(2, "middle");
        static Alphabetic = new TextBaseline(3, "alphabetic");
        static Ideographic = new TextBaseline(4, "ideographic");
        static Bottom = new TextBaseline(5, "bottom");
    }

    export class TextAlign extends EnumBase<string> {
        static Start = new TextAlign(0, "start");
        static End = new TextAlign(1, "end");
        static Left = new TextAlign(2, "left");
        static Right = new TextAlign(3, "right");
        static Center = new TextAlign(4, "center");
    }

    export class LineCap extends EnumBase<string> {
        static Butt = new LineCap(0, "butt");
        static Round = new LineCap(1, "round");
        static Square = new LineCap(2, "square");
    }

    export class LineJoin extends EnumBase<string> {
        static Bevel = new LineJoin(0, "bevel");
        static Round = new LineJoin(1, "round");
        static Miter = new LineJoin(2, "miter");
    }
} 