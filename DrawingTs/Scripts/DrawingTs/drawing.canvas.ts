/* 
 * drawingTs.canvas.ts 
 */
module DrawingTs {
    'use strict'

    export class CanvasPointerEvent {
        constructor(public canvas: Canvas,
            public position: Point,
            public source: UIEvent,
            public isMultiTouch: boolean= false,
            public needsPaint: boolean= false) { }
    }

    export class Canvas {
        private _htmlCanvas: HTMLCanvasElement;
        private _bufferWidth: number;
        private _bufferHeight: number;
        private _zoomX: number = 1.0;
        private _zoomY: number = 1.0;

        public graphics: Graphics;
        public onPaint: (g: Graphics) => any;

        public get bufferWidth(): number { return this._bufferWidth; }
        public get bufferHeight(): number { return this._bufferHeight; }
        public get zoomX(): number { return this._zoomX; }
        public get zoomY(): number { return this._zoomY; }
        public get htmlCanvas(): HTMLCanvasElement { return this._htmlCanvas; }

        public set onPointerDown(handler: (ev: CanvasPointerEvent) => any) {
            if (handler == null) { return; }

            if ("onpointerdown" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("pointerdown", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            } else if ("ontouchstart" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("touchstart", (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouch(ev));
                });

            } else {
                this._htmlCanvas.addEventListener("mousedown", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            }
        }

        public set onPointerMove(handler: (ev: CanvasPointerEvent) => any) {
            if (handler == null) { return; }

            if ("onpointermove" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("pointermove", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            } else if ("ontouchmove" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("touchmove", (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouch(ev));
                });

            } else {
                this._htmlCanvas.addEventListener("mousemove", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            }
        }
        public set onPointerUp(handler: (ev: CanvasPointerEvent) => any) {
            if (handler == null) { return; }

            if ("onpointerup" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("pointerup", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            } else if ("ontouchend" in this._htmlCanvas) {
                this._htmlCanvas.addEventListener("touchend", (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouchEnd(ev));
                });
            } else {
                this._htmlCanvas.addEventListener("mouseup", ev=> {
                    return handler(this.createPointerEvent(ev));
                });
            }
        }
        
        constructor(id: string) {
            this._htmlCanvas = <HTMLCanvasElement>document.getElementById(id);
            if (this._htmlCanvas == null) {
                throw DOMException.NOT_FOUND_ERR;
            }
            this.graphics = new Graphics(this._htmlCanvas.getContext("2d"));

            this._bufferWidth = this._htmlCanvas.width;
            this._bufferHeight = this._htmlCanvas.height;
        }

        public setDisplaySize(displayWidth: number, displayHeight: number) {
            this._htmlCanvas.style.width = displayWidth.toString() + "px";
            this._htmlCanvas.style.height = displayHeight.toString() + "px";
            this._zoomX = this._bufferWidth / displayWidth;
            this._zoomY = this._bufferHeight / displayHeight;
        }

        public zoom(percentZoom: number) {
            var zoom = percentZoom / 100;
            this.setDisplaySize(this.bufferWidth * zoom, this.bufferHeight * zoom);
        }

        public paint(): void {
            if (this.onPaint != null) {
                this.onPaint(this.graphics);
            }
        }

        public getDataURL(type?: string): string {
            return this._htmlCanvas.toDataURL(type);
        }

        public adjustWidth(baseWidth: number, shrinkOnly:boolean = false) {
            var dispW = shrinkOnly? Math.min(this.bufferWidth, baseWidth) : baseWidth;
            var dispH = this.bufferHeight * dispW / this.bufferWidth;
            this.setDisplaySize(dispW, dispH);
        }

        public adjustHeight(baseHeight: number, shrinkOnly: boolean = false) {
            var dispH = shrinkOnly ? Math.min(this.bufferHeight, baseHeight) : baseHeight;
            var dispW = this.bufferWidth * dispH / this.bufferHeight;
            this.setDisplaySize(dispW, dispH);
        }

        private createPointerEvent(ev: MouseEvent): CanvasPointerEvent {
            var pos = new Point(ev.offsetX * this._zoomX, ev.offsetY * this._zoomY);
            return new CanvasPointerEvent(this, pos, ev);
        }

        private createPointerEventTouch(ev: TouchEvent):CanvasPointerEvent {
            var isMultiTouch: boolean = ev.targetTouches.length > 1;
            var pos = new Point(
                this._zoomX * (ev.touches[0].pageX - this._htmlCanvas.offsetLeft),
                this._zoomY * (ev.touches[0].pageY - this._htmlCanvas.offsetTop));
            return new CanvasPointerEvent(this, pos, ev, isMultiTouch);
        }

        private createPointerEventTouchEnd(ev: TouchEvent) {
            return new CanvasPointerEvent(this, new Point(0, 0), ev);
        }
    }

    

   
}