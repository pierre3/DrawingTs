/* 
 * drawingTs.canvas.ts 
 */
module DrawingTs {
    'use strict'
    export class Canvas {

        private htmlCanvas: HTMLCanvasElement;

        private _bufferWidth: number;
        private _bufferHeight: number;
        private _zoomX: number = 1.0;
        private _zoomY: number = 1.0;

        public graphics: Graphics;

        public get bufferWidth(): number { return this._bufferWidth;}
        public get bufferHeight(): number { return this._bufferHeight; }
        public get zoomX(): number { return this._zoomX; }
        public get zoomY(): number { return this._zoomY; }

        public onPaint: (g: Graphics) => any;

        constructor(id: string) {
            this.htmlCanvas = <HTMLCanvasElement>document.getElementById(id);
            if (this.htmlCanvas == null) {
                throw DOMException.NOT_FOUND_ERR;
            }
            this.graphics = new Graphics(this.htmlCanvas.getContext("2d"));

            this._bufferWidth = this.htmlCanvas.width;
            this._bufferHeight = this.htmlCanvas.height;
        }

        public setZoom(displayWidth: number, displayHeight: number)
        {
            this._zoomX = this._bufferWidth / displayWidth;
            this._zoomY = this._bufferHeight / displayHeight;
        }

        public set onPointerDown(handler: (ev: CanvasPointerEvent) => any) {
            if (handler == null) { return; }

            if ('onpointerdown' in this.htmlCanvas) {
                this.htmlCanvas.onpointerdown = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            } else if ('ontouchstart' in this.htmlCanvas) {
                this.htmlCanvas.addEventListener('touchstart', (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouch(ev));
                });

            } else {
                this.htmlCanvas.onmousedown = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            }
        }

        public set onPointerMove(handler: (ev: CanvasPointerEvent) => any){
            if (handler == null) { return; }

            if ('onpointermove' in this.htmlCanvas) {
                this.htmlCanvas.onpointermove = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            } else if ('ontouchmove' in this.htmlCanvas) {
                this.htmlCanvas.addEventListener('touchmove', (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouch(ev));
                });

            } else {
                this.htmlCanvas.onmousemove = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            }
        }

        public set onPointerUp(handler: (ev: CanvasPointerEvent) => any) {
            if (handler == null) { return; }

            if ('onpointerup' in this.htmlCanvas) {
                this.htmlCanvas.onpointerup = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            } else if ('ontouchend' in this.htmlCanvas) {
                this.htmlCanvas.addEventListener('touchend', (ev: TouchEvent) => {
                    return handler(this.createPointerEventTouchEnd(ev));
                }, true);
            } else {
                this.htmlCanvas.onmouseup = ev=> {
                    return handler(this.createPointerEvent(ev));
                };
            }
        }

        private createPointerEvent(ev: MouseEvent) {
            var pos = new Point(ev.offsetX * this._zoomX, ev.offsetY * this._zoomY);
            return new CanvasPointerEvent(this, pos, ev);
        }

        private createPointerEventTouch(ev: TouchEvent) {
            var isMultiTouch: boolean = ev.targetTouches.length > 1;
            var pos = new Point(
                this._zoomX * (ev.touches[0].pageX - this.htmlCanvas.offsetLeft),
                this._zoomY * (ev.touches[0].pageY - this.htmlCanvas.offsetTop));
            return new CanvasPointerEvent(this, pos, ev, isMultiTouch);
        }

        private createPointerEventTouchEnd(ev: TouchEvent) {
            return new CanvasPointerEvent(this, new Point(0, 0), ev);
        }

        public paint(): void {
            if (this.onPaint != null) {
                this.onPaint(this.graphics);
            }
        }

        public getDataURL(type?: string): string {
            return this.htmlCanvas.toDataURL(type);
        }

    }

    export class CanvasPointerEvent {
        constructor(public canvas: Canvas,
            public position: Point,
            public source: UIEvent,
            public isMultiTouch: boolean= false,
            public needsPaint: boolean= false) { }
    }

    interface Touch {
        identifier: number;
        target: EventTarget;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
    };

    interface TouchList {
        length: number;
        item(index: number): Touch;
        identifiedTouch(identifier: number): Touch;
    };

    interface TouchEvent extends UIEvent {
        touches: TouchList;
        targetTouches: TouchList;
        changedTouches: TouchList;
        altKey: boolean;
        metaKey: boolean;
        ctrlKey: boolean;
        shiftKey: boolean;
    };

    declare var TouchEvent: {
        prototype: TouchEvent;
        new (): TouchEvent;
    }
}