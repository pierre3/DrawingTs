/// <reference path="scripts/drawingts/drawingts.d.ts" />

module drawingDemo {
    'use strict'
    //
    //Using DrawingTs classes
    //
    import Canvas = DrawingTs.Canvas;
    import Color = DrawingTs.Color;
    import Point = DrawingTs.Point;
    import Rectangle = DrawingTs.Rectangle;
    import Pen = DrawingTs.Pen;
    import SolidBrush = DrawingTs.SolidBrush;
    import GradientColor = DrawingTs.GradientColor;
    import LinearGradientBrush = DrawingTs.LinearGradientBrush;
    import RadialGradientBrush = DrawingTs.RadialGradientBrush;
    import Font = DrawingTs.Font;
    import Path = DrawingTs.Path;
    import ImageObject = DrawingTs.ImageObject;
    import Size = DrawingTs.Size;
    //
    // window load event handler
    //
    window.onload = (ev: Event) => {
        var message: string = "";
        var isDragging: boolean = false;
        var position: Point;
        //
        // Initialize a canvas object.
        //        
        var canvas = new Canvas("canvas1");
        //
        // paint event handler
        //
        canvas.onPaint = (g: DrawingTs.Graphics): any => {
            g.clear(true);
            g.drawString(message,
                Font.Create("sans-serif", 18),
                new SolidBrush(new Color("blue")),
                4, 18);
            g.drawLine(new Pen(new Color("black"), 2, [3, 3]),
                new Point(20, 50),
                new Point(380, 50));
            if (position != null) {
                g.drawElipse(new Pen(new Color("red")),
                    new Rectangle(position.x - 10, position.y - 10, 20, 20));
            }
        };
        //
        // pointer event handlers
        //
        canvas.onPointerDown = (ev: DrawingTs.CanvasPointerEvent) => {
            message = "PointerDown (" + ev.position.x + ", " + ev.position.y + ")"
            isDragging = true;
            position = ev.position;
            canvas.paint();
        };
        canvas.onPointerMove = (ev: DrawingTs.CanvasPointerEvent) => {
            ev.source.preventDefault();
            message = "PointerMove (" + ev.position.x + ", " + ev.position.y + ")";
            if (isDragging) {
                position = ev.position;
            }
            canvas.paint();
        };
        canvas.onPointerUp = (ev: DrawingTs.CanvasPointerEvent) => {
            message = "PointerUp (" + ev.position.x + ", " + ev.position.y + ")"
            isDragging = false;
            canvas.paint();
        };
        //
        // Raise a paint event.
        //
        canvas.paint();
        //
        // drawLine, drawPolyline
        //
        var canvas2 = new Canvas("canvas2");
        canvas2.onPaint = (g: DrawingTs.Graphics) => {
            g.drawLine(
                new Pen(new Color("red")),
                new Point(10, 20),
                new Point(300, 20));

            //Set custom pen styles.
            var lineColor = Color.fromRgba(0, 0, 255, 0.5);
            var lineWidth = 5;
            var lineDash = [10, 10];
            var lineCap = DrawingTs.LineCap.Round;
            g.drawLine(
                new Pen(lineColor, lineWidth, lineDash, lineCap),
                new Point(10, 60),
                new Point(300, 60));

            var points = [
                new Point(10, 100),
                new Point(20, 100),
                new Point(20, 120),
                new Point(40, 120),
                new Point(40, 100),
                new Point(60, 120),
                new Point(80, 100),
                new Point(300, 100),
            ];
            g.drawPolyLine(new Pen(new Color("green")), points);

        };
        canvas2.paint();
        //
        // drawRect
        //
        var canvas3 = new Canvas("canvas3");
        canvas3.onPaint = (g: DrawingTs.Graphics) => {
            g.drawRect(
                new Pen(Color.fromRgb(127, 40, 64), 2),
                new Rectangle(10, 10, 60, 60));

            var penWidth = 5;
            var lineDash = [5, 10];
            var lineCap = DrawingTs.LineCap.Butt;
            var lineJoin = DrawingTs.LineJoin.Round;
            g.drawRect(
                new Pen(Color.fromRgb(33, 98, 127), penWidth, lineDash, lineCap, lineJoin),
                new Rectangle(100, 100, 100, 60));
        };
        canvas3.paint();
        //
        // fillRect
        //
        var canvas4 = new Canvas("canvas4");
        canvas4.onPaint = (g: DrawingTs.Graphics) => {
            g.fillRect(
                new SolidBrush(new Color("darkblue")),
                new Rectangle(10, 10, 80, 80));

            var lgBrush = new LinearGradientBrush(
                new Point(10, 100),
                new Point(70, 160),
                [
                    new GradientColor(0, Color.fromRgb(255, 0, 0)),
                    new GradientColor(0.5, Color.fromRgb(255, 255, 0)),
                    new GradientColor(1, Color.fromRgb(255, 255, 255))
                ]);

            g.fillRect(lgBrush,
                new Rectangle(10, 100, 60, 60));

            var rgBrush = new RadialGradientBrush(
                new Point(130, 130), 10,
                new Point(130, 130), 50,
                [
                    new GradientColor(0, Color.fromRgb(255, 0, 0)),
                    new GradientColor(1, Color.fromRgb(0, 0, 255))
                ]);
            g.fillRect(rgBrush,
                new Rectangle(100, 100, 60, 60));

        };
        canvas4.paint();
        //        
        // drawElipse
        //
        var canvas5 = new Canvas("canvas5");
        canvas5.onPaint = (g: DrawingTs.Graphics) => {
            g.drawElipse(
                new Pen(new Color("brown"), 2),
                new Rectangle(10, 10, 80, 80));

            var penWidth = 3;
            var lineDash = [3, 3, 6, 3, 3];
            g.drawElipse(
                new Pen(Color.fromRgb(33, 98, 127), penWidth, lineDash),
                new Rectangle(120, 60, 50, 100));
        };
        canvas5.paint();
        //        
        // fillElipse
        //
        var canvas6 = new Canvas("canvas6");
        canvas6.onPaint = (g: DrawingTs.Graphics) => {
            g.fillElipse(
                new SolidBrush(new Color("magenta")),
                new Rectangle(10, 10, 200, 80));

            var lgBrush = new LinearGradientBrush(
                new Point(10, 110),
                new Point(70, 170),
                [
                    new GradientColor(0, Color.fromRgb(0, 0, 0)),
                    new GradientColor(0.5, Color.fromRgb(127, 127, 0)),
                    new GradientColor(1, Color.fromRgb(255, 0, 0))
                ]);
            g.fillElipse(lgBrush,
                new Rectangle(10, 110, 60, 60));

            var rgBrush = new RadialGradientBrush(
                new Point(180, 140), 20,
                new Point(180, 140), 60,
                [
                    new GradientColor(0, Color.fromRgb(255, 0, 0)),
                    new GradientColor(0.5, Color.fromRgb(127, 255, 127)),
                    new GradientColor(1, Color.fromRgb(0, 0, 255))
                ]);
            g.fillElipse(rgBrush,
                new Rectangle(120, 110, 120, 60));
        };
        canvas6.paint();
        //        
        // drawPath
        //
        var canvas7 = new Canvas("canvas7");
        canvas7.onPaint = (g: DrawingTs.Graphics) => {
            var path = new Path()
                .moveTo(new Point(10, 90))
                .lineTo(new Point(50, 90))
                .quadraticCurveTo(new Point(100, 150), new Point(150, 90))
                .bezierCurveTo(new Point(180, 140), new Point(200, 10), new Point(250, 90))
                .arcTo(new Point(200, 130), new Point(300, 170), 60)
                .lineTo(new Point(360, 90));

            g.drawPath(new Pen(new Color("navy"), 4), path);
        };
        canvas7.paint();
        //        
        // fillPath
        //
        var canvas8 = new Canvas("canvas8");
        canvas8.onPaint = (g: DrawingTs.Graphics) => {
            var path = new Path()
                .moveTo(new Point(200, 60))
                .bezierCurveTo(new Point(100, 10), new Point(100, 90), new Point(200, 160))
                .moveTo(new Point(200, 60))
                .bezierCurveTo(new Point(300, 10), new Point(300, 90), new Point(200, 160));

            g.fillPath(new SolidBrush(new Color("#FF69B4")), path);
        };
        canvas8.paint();
        //        
        // drawText
        //
        var canvas9 = new Canvas("canvas9");
        canvas9.onPaint = (g: DrawingTs.Graphics) => {
            g.drawLine(new Pen(new Color("gray")), new Point(200, 0), new Point(200, 180));

            var font = Font.Create("Mayrio, sans-serif", 20, DrawingTs.FontStyle.Italic);
            var brush = new SolidBrush(new Color("blue"));
            g.drawString("TextAlign-left",
                font,
                brush,
                200, 4,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Top);
            g.drawString("TextAlign-center",
                font,
                brush,
                200, 24,
                DrawingTs.TextAlign.Center,
                DrawingTs.TextBaseline.Top);
            g.drawString("TextAlign-right",
                font,
                brush,
                200, 44,
                DrawingTs.TextAlign.Right,
                DrawingTs.TextBaseline.Top);

            g.drawLine(new Pen(new Color("gray")), new Point(0, 110), new Point(400, 110));

            var lgBrush = new LinearGradientBrush(new Point(0, 0), new Point(400, 180),
                [
                    new GradientColor(0, Color.fromRgb(0, 0, 255)),
                    new GradientColor(1, Color.fromRgb(255, 0, 0))
                ]);
            var width = g.drawString("Top ",
                font,
                lgBrush,
                4, 110,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Top);
            width += g.drawString("Hanging ",
                font,
                lgBrush,
                width + 4, 110,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Hanging);
            width += g.drawString("Middle ",
                font,
                lgBrush,
                width + 4, 110,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Middle);
            width += g.drawString("Alphabetic ",
                font,
                lgBrush,
                width + 4, 110,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Alphabetic);
            width += g.drawString("Bottom ",
                font,
                lgBrush,
                width + 4, 110,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Bottom);

        };
        canvas9.paint();
        //        
        // drawStringOutline
        //
        var canvas10 = new Canvas("canvas10");
        canvas10.onPaint = (g: DrawingTs.Graphics) => {
            g.drawLine(new Pen(new Color("gray")), new Point(200, 0), new Point(200, 180));

            var font = Font.Create("monospace", 40, DrawingTs.FontStyle.Bold);
            var pen = new Pen(Color.fromRgb(40, 40, 40));

            g.drawStringOutline("LEFT",
                font,
                pen,
                200, 0,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Top);

            g.drawStringOutline("CENTER",
                font,
                pen,
                200, 40,
                DrawingTs.TextAlign.Center,
                DrawingTs.TextBaseline.Top);

            g.drawStringOutline("RIGHT",
                font,
                pen,
                200, 80,
                DrawingTs.TextAlign.Right,
                DrawingTs.TextBaseline.Top);

            g.drawLine(new Pen(new Color("gray")), new Point(0, 140), new Point(400, 140));

            var pen2 = new Pen(Color.fromRgb(40, 80, 180), 1, [1, 1]);
            var width = g.drawStringOutline("T ",
                font,
                pen2,
                4, 140,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Top);
            width += g.drawStringOutline("H ",
                font,
                pen2,
                width + 4, 140,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Hanging);
            width += g.drawStringOutline("M ",
                font,
                pen2,
                width + 4, 140,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Middle);
            width += g.drawStringOutline("A ",
                font,
                pen2,
                width + 4, 140,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Alphabetic);
            width += g.drawStringOutline("B ",
                font,
                pen2,
                width + 4, 140,
                DrawingTs.TextAlign.Left,
                DrawingTs.TextBaseline.Bottom);
        };
        canvas10.paint();

        var canvas11 = new Canvas("canvas11");
        var image = new DrawingTs.ImageObject(150, 150);
        image.load("Content/logo-piquest.png", (ev) => { canvas11.paint(); });
        canvas11.onPaint = (g: DrawingTs.Graphics) => {
            g.drawImage(image, new Point(10, 10));
            g.drawImage(image, new Point(170, 10), new Size(60, 120));
            g.drawImage(image, new Point(240, 10), new Size(60, 60), new Point(50, 50), new Size(100, 100));
        };
        canvas11.paint();
    };
}