/// <reference path="drawingts/drawingts.d.ts" />

module Shapes
{
    'use strict'

    import Canvas = DrawingTs.Canvas;
    var canvas01: Canvas;

    window.onresize = (ev: UIEvent) => {
        resizeCanvas();
    };

    window.onload = (ev: Event) => {
        canvas01 = new Canvas("rCanvas");
        canvas01.onPaint = (g: DrawingTs.Graphics) => {
            g.drawRect(new DrawingTs.Pen(DrawingTs.Color.Red), new DrawingTs.Rectangle(10, 10, 100, 50));
        };
        canvas01.onPointerDown = (e: DrawingTs.CanvasPointerEvent) => {
            
        };
        resizeCanvas();

    };

    function resizeCanvas()
    {
        var element = document.getElementById("canvasContainer");
        canvas01.adjustWidth(element.clientWidth, false);
        canvas01.paint();
    }
}