module DrawingTs {
    'use strict'

    export class Graphics {
        constructor(public rc: CanvasRenderingContext2D) { }

        public clear(bkTransparent: boolean, fillBrush?: IBrush): void {
            if (bkTransparent) {
                this.rc.clearRect(0, 0, this.rc.canvas.width, this.rc.canvas.height);
            } else {
                this.fillRect(fillBrush, new Rectangle(0, 0, this.rc.canvas.width, this.rc.canvas.height));
            }
        }

        public drawLine(pen: Pen, p0: Point, p1: Point): void {
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.moveTo(p0.x, p0.y);
            this.rc.lineTo(p1.x, p1.y);
            this.rc.stroke();
            this.rc.closePath();
        }

        public drawPolyLine(pen: Pen, points: Point[]): void {
            if (points == null || points.length < 2) {
                return;
            }
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.moveTo(points[0].x, points[0].y);
            for (var i = 1; i < points.length; i++) {
                this.rc.lineTo(points[i].x, points[i].y);
            }
            this.rc.stroke();
            this.rc.closePath();
        }

        public drawPath(pen: Pen, path: Path): void {
            if (path == null || path.length < 2) {
                return;
            }
            this.rc.beginPath();
            pen.applyTo(this);
            path.draw(this);

            this.rc.stroke();
            this.rc.closePath();
        }

        public fillPath(brush: IBrush, path: Path): void {
            if (path == null || path.length < 2) {
                return;
            }
            this.rc.beginPath();
            brush.applyTo(this);
            path.draw(this);

            this.rc.fill();
            this.rc.closePath();
        }

        public drawElipse(pen: Pen, rect: Rectangle): void {
            this.figureElipse(pen, rect, g=> g.rc.stroke());
        }

        public fillElipse(brush: IBrush, rect: Rectangle): void {
            this.figureElipse(brush, rect, g=> g.rc.fill());
        }

        public drawRect(pen: Pen, rect: Rectangle): void {
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.strokeRect(rect.x, rect.y, rect.w, rect.h);
            this.rc.closePath();
        }

        public fillRect(brush: IBrush, rect: Rectangle): void {
            this.rc.beginPath();
            brush.applyTo(this);
            this.rc.fillRect(rect.x, rect.y, rect.w, rect.h);
            this.rc.closePath();
        }

        public drawStringOutline(text: string, font: Font, pen: Pen, x: number, y: number,
            align: TextAlign= TextAlign.start,
            baseline: TextBaseline = TextBaseline.alphabetic): number {

            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.textAlign = align.asString();
            this.rc.textBaseline = baseline.asString();
            this.rc.font = font.cssFont;
            this.rc.strokeText(text, x, y);
            this.rc.closePath();
            return this.rc.measureText(text).width;
        }

        public drawString(text: string, font: Font, brush: IBrush, x: number, y: number,
            align: TextAlign= TextAlign.start,
            baseline: TextBaseline = TextBaseline.alphabetic): number {

            this.rc.beginPath();
            brush.applyTo(this);
            this.rc.textAlign = align.asString();
            this.rc.textBaseline = baseline.asString();
            this.rc.font = font.cssFont;
            this.rc.fillText(text, x, y);
            this.rc.closePath();
            return this.rc.measureText(text).width;
        }

        private figureElipse(tool: IGraphicsObject, rect: Rectangle, action: (g: Graphics) => void): void {
            var radius: number, scaleX: number, scaleY: number;
            if (rect.w > rect.h) {
                radius = rect.w / 2;
                scaleX = 1;
                scaleY = rect.h / rect.w;
            } else {
                radius = rect.h / 2;
                scaleX = rect.w / rect.h;
                scaleY = 1;
            }
            var centerX = rect.x + rect.w / 2;
            var centerY = rect.y + rect.h / 2;
            this.rc.beginPath();
            this.rc.translate(centerX, centerY);
            this.rc.scale(scaleX, scaleY);
            this.rc.arc(0, 0, radius, 0, Math.PI * 2);
            this.rc.scale(1/scaleX, 1/scaleY);
            this.rc.translate(-centerX, -centerY);
            tool.applyTo(this);
            action(this);
            
            this.rc.closePath();
        }
    }
}