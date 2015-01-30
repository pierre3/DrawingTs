var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DrawingTs;
(function (DrawingTs) {
    'use strict';

    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.to = function (p) {
            return new Vector(p.x - this.x, p.y - this.y);
        };

        Point.prototype.scale = function (n) {
            return new Point(this.x * n, this.y * n);
        };
        return Point;
    })();
    DrawingTs.Point = Point;

    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(x, y) {
            _super.call(this, x, y);
        }
        Vector.prototype.norm = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        Vector.prototype.add = function (v) {
            return new Vector(this.x + v.x, this.y + v.y);
        };

        Vector.prototype.subtract = function (v) {
            return new Vector(this.x - v.x, this.y - v.y);
        };

        Vector.prototype.multiple = function (n) {
            return new Vector(n * this.x, n * this.y);
        };

        Vector.prototype.dotProduct = function (v) {
            return this.x * v.x + this.y * v.y;
        };

        Vector.prototype.crossProduct = function (v) {
            return new Vector(this.x * v.y - v.x * this.y, this.y * v.x - v.y * this.x);
        };
        return Vector;
    })(Point);
    DrawingTs.Vector = Vector;

    var Rectangle = (function () {
        function Rectangle(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        Object.defineProperty(Rectangle.prototype, "left", {
            get: function () {
                return this.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return this.x + this.w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "top", {
            get: function () {
                return this.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return this.y + this.h;
            },
            enumerable: true,
            configurable: true
        });
        return Rectangle;
    })();
    DrawingTs.Rectangle = Rectangle;
})(DrawingTs || (DrawingTs = {}));
var DrawingTs;
(function (DrawingTs) {
    'use strict';

    /**
    * Canvas
    */
    var Canvas = (function () {
        function Canvas(id) {
            this._zoomX = 1.0;
            this._zoomY = 1.0;
            this.htmlCanvas = document.getElementById(id);
            if (this.htmlCanvas == null) {
                throw DOMException.NOT_FOUND_ERR;
            }
            this.graphics = new DrawingTs.Graphics(this.htmlCanvas.getContext("2d"));

            this._bufferWidth = this.htmlCanvas.width;
            this._bufferHeight = this.htmlCanvas.height;
        }
        Object.defineProperty(Canvas.prototype, "bufferWidth", {
            get: function () {
                return this._bufferWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "bufferHeight", {
            get: function () {
                return this._bufferHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "zoomX", {
            get: function () {
                return this._zoomX;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Canvas.prototype, "zoomY", {
            get: function () {
                return this._zoomY;
            },
            enumerable: true,
            configurable: true
        });

        Canvas.prototype.setZoom = function (displayWidth, displayHeight) {
            this._zoomX = this._bufferWidth / displayWidth;
            this._zoomY = this._bufferHeight / displayHeight;
        };

        Object.defineProperty(Canvas.prototype, "onPointerDown", {
            set: function (handler) {
                var _this = this;
                if (handler == null) {
                    return;
                }

                if ('onpointerdown' in this.htmlCanvas) {
                    this.htmlCanvas.onpointerdown = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                } else if ('ontouchstart' in this.htmlCanvas) {
                    this.htmlCanvas.addEventListener('touchstart', function (ev) {
                        return handler(_this.createPointerEventTouch(ev));
                    });
                } else {
                    this.htmlCanvas.onmousedown = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Canvas.prototype, "onPointerMove", {
            set: function (handler) {
                var _this = this;
                if (handler == null) {
                    return;
                }

                if ('onpointermove' in this.htmlCanvas) {
                    this.htmlCanvas.onpointermove = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                } else if ('ontouchmove' in this.htmlCanvas) {
                    this.htmlCanvas.addEventListener('touchmove', function (ev) {
                        return handler(_this.createPointerEventTouch(ev));
                    });
                } else {
                    this.htmlCanvas.onmousemove = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Canvas.prototype, "onPointerUp", {
            set: function (handler) {
                var _this = this;
                if (handler == null) {
                    return;
                }

                if ('onpointerup' in this.htmlCanvas) {
                    this.htmlCanvas.onpointerup = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                } else if ('ontouchend' in this.htmlCanvas) {
                    this.htmlCanvas.addEventListener('touchend', function (ev) {
                        return handler(_this.createPointerEventTouchEnd(ev));
                    }, true);
                } else {
                    this.htmlCanvas.onmouseup = function (ev) {
                        return handler(_this.createPointerEvent(ev));
                    };
                }
            },
            enumerable: true,
            configurable: true
        });

        Canvas.prototype.createPointerEvent = function (ev) {
            var pos = new DrawingTs.Point(ev.offsetX * this._zoomX, ev.offsetY * this._zoomY);
            return new CanvasPointerEvent(this, pos, ev);
        };

        Canvas.prototype.createPointerEventTouch = function (ev) {
            var isMultiTouch = ev.targetTouches.length > 1;
            var pos = new DrawingTs.Point(this._zoomX * (ev.touches[0].pageX - this.htmlCanvas.offsetLeft), this._zoomY * (ev.touches[0].pageY - this.htmlCanvas.offsetTop));
            return new CanvasPointerEvent(this, pos, ev, isMultiTouch);
        };

        Canvas.prototype.createPointerEventTouchEnd = function (ev) {
            return new CanvasPointerEvent(this, new DrawingTs.Point(0, 0), ev);
        };

        Canvas.prototype.paint = function () {
            if (this.onPaint != null) {
                this.onPaint(this.graphics);
            }
        };

        Canvas.prototype.getDataURL = function (type) {
            return this.htmlCanvas.toDataURL(type);
        };
        return Canvas;
    })();
    DrawingTs.Canvas = Canvas;

    var CanvasPointerEvent = (function () {
        function CanvasPointerEvent(canvas, position, source, isMultiTouch, needsPaint) {
            if (typeof isMultiTouch === "undefined") { isMultiTouch = false; }
            if (typeof needsPaint === "undefined") { needsPaint = false; }
            this.canvas = canvas;
            this.position = position;
            this.source = source;
            this.isMultiTouch = isMultiTouch;
            this.needsPaint = needsPaint;
        }
        return CanvasPointerEvent;
    })();
    DrawingTs.CanvasPointerEvent = CanvasPointerEvent;

    ;

    ;

    ;
})(DrawingTs || (DrawingTs = {}));
var DrawingTs;
(function (DrawingTs) {
    'use strict';

    var Graphics = (function () {
        function Graphics(rc) {
            this.rc = rc;
        }
        Graphics.prototype.clear = function (bkTransparent, fillBrush) {
            if (bkTransparent) {
                this.rc.clearRect(0, 0, this.rc.canvas.width, this.rc.canvas.height);
            } else {
                this.fillRect(fillBrush, new DrawingTs.Rectangle(0, 0, this.rc.canvas.width, this.rc.canvas.height));
            }
        };

        Graphics.prototype.drawLine = function (pen, p0, p1) {
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.moveTo(p0.x, p0.y);
            this.rc.lineTo(p1.x, p1.y);
            this.rc.stroke();
            this.rc.closePath();
        };

        Graphics.prototype.drawPolyLine = function (pen, points) {
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
        };

        Graphics.prototype.drawPath = function (pen, path) {
            if (path == null || path.length < 2) {
                return;
            }
            this.rc.beginPath();
            pen.applyTo(this);
            path.draw(this);

            this.rc.stroke();
            this.rc.closePath();
        };

        Graphics.prototype.fillPath = function (brush, path) {
            if (path == null || path.length < 2) {
                return;
            }
            this.rc.beginPath();
            brush.applyTo(this);
            path.draw(this);

            this.rc.fill();
            this.rc.closePath();
        };

        Graphics.prototype.drawElipse = function (pen, rect) {
            this.figureElipse(pen, rect, function (g) {
                return g.rc.stroke();
            });
        };

        Graphics.prototype.fillElipse = function (brush, rect) {
            this.figureElipse(brush, rect, function (g) {
                return g.rc.fill();
            });
        };

        Graphics.prototype.drawRect = function (pen, rect) {
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.strokeRect(rect.x, rect.y, rect.w, rect.h);
            this.rc.closePath();
        };

        Graphics.prototype.fillRect = function (brush, rect) {
            this.rc.beginPath();
            brush.applyTo(this);
            this.rc.fillRect(rect.x, rect.y, rect.w, rect.h);
            this.rc.closePath();
        };

        Graphics.prototype.drawStringOutline = function (text, font, pen, x, y, align, baseline) {
            if (typeof align === "undefined") { align = DrawingTs.TextAlign.start; }
            if (typeof baseline === "undefined") { baseline = DrawingTs.TextBaseline.alphabetic; }
            this.rc.beginPath();
            pen.applyTo(this);
            this.rc.textAlign = align.asString();
            this.rc.textBaseline = baseline.asString();
            this.rc.font = font.cssFont;
            this.rc.strokeText(text, x, y);
            this.rc.closePath();
            return this.rc.measureText(text).width;
        };

        Graphics.prototype.drawString = function (text, font, brush, x, y, align, baseline) {
            if (typeof align === "undefined") { align = DrawingTs.TextAlign.start; }
            if (typeof baseline === "undefined") { baseline = DrawingTs.TextBaseline.alphabetic; }
            this.rc.beginPath();
            brush.applyTo(this);
            this.rc.textAlign = align.asString();
            this.rc.textBaseline = baseline.asString();
            this.rc.font = font.cssFont;
            this.rc.fillText(text, x, y);
            this.rc.closePath();
            return this.rc.measureText(text).width;
        };

        Graphics.prototype.figureElipse = function (tool, rect, action) {
            var radius, scaleX, scaleY;
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
            this.rc.scale(1 / scaleX, 1 / scaleY);
            this.rc.translate(-centerX, -centerY);
            tool.applyTo(this);
            action(this);

            this.rc.closePath();
        };
        return Graphics;
    })();
    DrawingTs.Graphics = Graphics;
})(DrawingTs || (DrawingTs = {}));
var DrawingTs;
(function (DrawingTs) {
    'use strict';

    var EnumBase = (function () {
        function EnumBase(index, name) {
            this.index = index;
            this.name = name;
        }
        EnumBase.prototype.ordinal = function () {
            return this.index;
        };
        EnumBase.prototype.asString = function () {
            return this.name;
        };
        return EnumBase;
    })();
    DrawingTs.EnumBase = EnumBase;
    var FontStyle = (function (_super) {
        __extends(FontStyle, _super);
        function FontStyle() {
            _super.apply(this, arguments);
        }
        FontStyle.normal = new FontStyle(0, "");
        FontStyle.bold = new FontStyle(1, "bold");
        FontStyle.italic = new FontStyle(2, "italic");
        FontStyle.italicBold = new FontStyle(3, "italic bold");
        return FontStyle;
    })(EnumBase);
    DrawingTs.FontStyle = FontStyle;

    var TextBaseline = (function (_super) {
        __extends(TextBaseline, _super);
        function TextBaseline() {
            _super.apply(this, arguments);
        }
        TextBaseline.top = new TextBaseline(0, "top");
        TextBaseline.hanging = new TextBaseline(1, "hanging");
        TextBaseline.middle = new TextBaseline(2, "middle");
        TextBaseline.alphabetic = new TextBaseline(3, "alphabetic");
        TextBaseline.ideographic = new TextBaseline(4, "ideographic");
        TextBaseline.bottom = new TextBaseline(5, "bottom");
        return TextBaseline;
    })(EnumBase);
    DrawingTs.TextBaseline = TextBaseline;

    var TextAlign = (function (_super) {
        __extends(TextAlign, _super);
        function TextAlign() {
            _super.apply(this, arguments);
        }
        TextAlign.start = new TextAlign(0, "start");
        TextAlign.end = new TextAlign(1, "end");
        TextAlign.left = new TextAlign(2, "left");
        TextAlign.right = new TextAlign(3, "right");
        TextAlign.center = new TextAlign(4, "center");
        return TextAlign;
    })(EnumBase);
    DrawingTs.TextAlign = TextAlign;

    var LineCap = (function (_super) {
        __extends(LineCap, _super);
        function LineCap() {
            _super.apply(this, arguments);
        }
        LineCap.butt = new LineCap(0, "butt");
        LineCap.round = new LineCap(1, "round");
        LineCap.square = new LineCap(2, "square");
        return LineCap;
    })(EnumBase);
    DrawingTs.LineCap = LineCap;

    var LineJoin = (function (_super) {
        __extends(LineJoin, _super);
        function LineJoin() {
            _super.apply(this, arguments);
        }
        LineJoin.bevel = new LineJoin(0, "bevel");
        LineJoin.round = new LineJoin(1, "round");
        LineJoin.miter = new LineJoin(2, "miter");
        return LineJoin;
    })(EnumBase);
    DrawingTs.LineJoin = LineJoin;

    var Color = (function () {
        function Color(cssColor) {
            this.cssColor = cssColor;
        }
        Color.fromRgb = function (r, g, b) {
            return new Color('rgb(' + r + ',' + g + ',' + b + ')');
        };
        Color.fromRgba = function (r, g, b, a) {
            return new Color('rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
        };
        return Color;
    })();
    DrawingTs.Color = Color;

    var Font = (function () {
        function Font(cssFont) {
            this.cssFont = cssFont;
        }
        Font.Create = function (familyName, pxSize, style) {
            if (typeof style === "undefined") { style = FontStyle.normal; }
            return new Font(style.asString() + " " + pxSize + "px " + "'" + familyName + "'");
        };

        Font.prototype.applyTo = function (g) {
            g.rc.font = this.cssFont;
        };
        return Font;
    })();
    DrawingTs.Font = Font;

    var Pen = (function () {
        function Pen(color, width, lineDash, lineCap, lineJoin, miterLimit) {
            if (typeof width === "undefined") { width = 1; }
            if (typeof lineDash === "undefined") { lineDash = []; }
            if (typeof lineCap === "undefined") { lineCap = LineCap.butt; }
            if (typeof lineJoin === "undefined") { lineJoin = LineJoin.bevel; }
            if (typeof miterLimit === "undefined") { miterLimit = 10.0; }
            this.color = color;
            this.width = width;
            this.lineDash = lineDash;
            this.lineCap = lineCap;
            this.lineJoin = lineJoin;
            this.miterLimit = miterLimit;
        }
        Pen.prototype.applyTo = function (g) {
            g.rc.strokeStyle = this.color.cssColor;
            if (g.rc.setLineDash != undefined) {
                g.rc.setLineDash(this.lineDash);
            }
            g.rc.lineWidth = this.width;
            g.rc.lineCap = this.lineCap.asString();
            g.rc.lineJoin = this.lineJoin.asString();
            g.rc.miterLimit = this.miterLimit;
        };
        Pen.prototype.clone = function () {
            return new Pen(new Color(this.color.cssColor), this.width, this.lineDash, this.lineCap, this.lineJoin, this.miterLimit);
        };
        return Pen;
    })();
    DrawingTs.Pen = Pen;

    var SolidBrush = (function () {
        function SolidBrush(color) {
            this.color = color;
        }
        SolidBrush.prototype.applyTo = function (g) {
            g.rc.fillStyle = this.color.cssColor;
        };
        return SolidBrush;
    })();
    DrawingTs.SolidBrush = SolidBrush;

    var GradientColor = (function () {
        function GradientColor(offset, color) {
            this.offset = offset;
            this.color = color;
        }
        return GradientColor;
    })();
    DrawingTs.GradientColor = GradientColor;

    var LinearGradientBrush = (function () {
        function LinearGradientBrush(pos0, pos1, colors) {
            this.pos0 = pos0;
            this.pos1 = pos1;
            this.colors = colors;
        }
        LinearGradientBrush.prototype.applyTo = function (g) {
            var gradient = g.rc.createLinearGradient(this.pos0.x, this.pos0.y, this.pos1.x, this.pos1.y);
            this.colors.forEach(function (c, _, __) {
                return gradient.addColorStop(c.offset, c.color.cssColor);
            });
            g.rc.fillStyle = gradient;
        };
        return LinearGradientBrush;
    })();
    DrawingTs.LinearGradientBrush = LinearGradientBrush;

    var RadialGradientBrush = (function () {
        function RadialGradientBrush(center0, r0, center1, r1, colors) {
            this.center0 = center0;
            this.r0 = r0;
            this.center1 = center1;
            this.r1 = r1;
            this.colors = colors;
        }
        RadialGradientBrush.prototype.applyTo = function (g) {
            var gradient = g.rc.createRadialGradient(this.center0.x, this.center0.y, this.r0, this.center1.x, this.center1.y, this.r1);
            this.colors.forEach(function (c, _, __) {
                return gradient.addColorStop(c.offset, c.color.cssColor);
            });
            g.rc.fillStyle = gradient;
        };
        return RadialGradientBrush;
    })();
    DrawingTs.RadialGradientBrush = RadialGradientBrush;
})(DrawingTs || (DrawingTs = {}));
var DrawingTs;
(function (DrawingTs) {
    'use strict';

    var MoveToPathData = (function () {
        function MoveToPathData(position) {
            this.position = position;
        }
        MoveToPathData.prototype.draw = function (g) {
            g.rc.moveTo(this.position.x, this.position.y);
        };
        return MoveToPathData;
    })();
    DrawingTs.MoveToPathData = MoveToPathData;

    var LineToPathData = (function () {
        function LineToPathData(position) {
            this.position = position;
        }
        LineToPathData.prototype.draw = function (g) {
            g.rc.lineTo(this.position.x, this.position.y);
        };
        return LineToPathData;
    })();
    DrawingTs.LineToPathData = LineToPathData;

    var BezierCurveToPathData = (function () {
        function BezierCurveToPathData(ctrlPoint0, ctrlPoint1, position) {
            this.ctrlPoint0 = ctrlPoint0;
            this.ctrlPoint1 = ctrlPoint1;
            this.position = position;
        }
        BezierCurveToPathData.prototype.draw = function (g) {
            g.rc.bezierCurveTo(this.ctrlPoint0.x, this.ctrlPoint0.y, this.ctrlPoint1.x, this.ctrlPoint1.y, this.position.x, this.position.y);
        };
        return BezierCurveToPathData;
    })();
    DrawingTs.BezierCurveToPathData = BezierCurveToPathData;

    var QuadraticCurveToPathData = (function () {
        function QuadraticCurveToPathData(ctrlPoint, position) {
            this.ctrlPoint = ctrlPoint;
            this.position = position;
        }
        QuadraticCurveToPathData.prototype.draw = function (g) {
            g.rc.quadraticCurveTo(this.ctrlPoint.x, this.ctrlPoint.y, this.position.x, this.position.y);
        };
        return QuadraticCurveToPathData;
    })();
    DrawingTs.QuadraticCurveToPathData = QuadraticCurveToPathData;

    var ArcToPathData = (function () {
        function ArcToPathData(ctrlPoint, position, radius) {
            this.ctrlPoint = ctrlPoint;
            this.position = position;
            this.radius = radius;
        }
        ArcToPathData.prototype.draw = function (g) {
            g.rc.arcTo(this.ctrlPoint.x, this.ctrlPoint.y, this.position.x, this.position.y, this.radius);
        };
        return ArcToPathData;
    })();
    DrawingTs.ArcToPathData = ArcToPathData;

    var ClosePathData = (function () {
        function ClosePathData() {
            this.position = null;
        }
        ClosePathData.prototype.draw = function (g) {
            g.rc.closePath();
        };
        return ClosePathData;
    })();
    DrawingTs.ClosePathData = ClosePathData;

    var Path = (function () {
        function Path() {
            this.items = [];
        }
        Object.defineProperty(Path.prototype, "length", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });

        Path.prototype.moveTo = function (position) {
            this.items.push(new MoveToPathData(position));
            return this;
        };

        Path.prototype.lineTo = function (position) {
            this.items.push(new LineToPathData(position));
            return this;
        };

        Path.prototype.bezierCurveTo = function (curve0, curve1, position) {
            this.items.push(new BezierCurveToPathData(curve0, curve1, position));
            return this;
        };

        Path.prototype.quadraticCurveTo = function (ctrlPoint, position) {
            this.items.push(new QuadraticCurveToPathData(ctrlPoint, position));
            return this;
        };

        Path.prototype.arcTo = function (ctrlPoint, position, radius) {
            this.items.push(new ArcToPathData(ctrlPoint, position, radius));
            return this;
        };
        Path.prototype.closePath = function () {
            this.items.push(new ClosePathData());
            return this;
        };

        Path.prototype.draw = function (g) {
            this.items.forEach(function (p, i, _) {
                p.draw(g);
            });
        };

        Path.prototype.push = function (pathData) {
            this.items.push(pathData);
        };

        Path.prototype.clone = function () {
            var obj = new Path();
            obj.items = this.items.slice();
            return obj;
        };
        return Path;
    })();
    DrawingTs.Path = Path;
})(DrawingTs || (DrawingTs = {}));
var DrawingTs;
(function (DrawingTs) {
    'use strict';
    var DrawingManager = (function () {
        function DrawingManager() {
            this.shapes = [];
            this.backgroundColor = new DrawingTs.Color('white');
            this.bkTransparent = false;
            this.isMouseOn = false;
        }
        DrawingManager.prototype.createEraser = function (pen, radial) {
            var _this = this;
            var eraser = new Eraser(pen, radial);
            eraser.onErase = function (c, r) {
                _this.shapes.forEach(function (shape, _, __) {
                    shape.erase(c, r);
                });
            };
            return eraser;
        };

        DrawingManager.prototype.onPointerDown = function (ev) {
            this.currentItem.contact(ev.position);
            this.isMouseOn = true;
        };

        DrawingManager.prototype.onPointerMove = function (ev) {
            if (this.isMouseOn == false) {
                return;
            }
            ev.needsPaint = this.currentItem.drag(ev.position);
        };

        DrawingManager.prototype.onPointerUp = function (ev) {
            this.isMouseOn = false;
            var obj = this.currentItem.drop(ev.position);
            if (obj != null) {
                this.shapes.push(obj);
            }
        };

        DrawingManager.prototype.onPaint = function (g) {
            g.clear(this.bkTransparent, new DrawingTs.SolidBrush(this.backgroundColor));
            this.shapes.forEach(function (shape) {
                return shape.draw(g);
            });
            this.currentItem.draw(g);
        };

        DrawingManager.prototype.undo = function () {
            this.shapes.pop();
        };
        return DrawingManager;
    })();
    DrawingTs.DrawingManager = DrawingManager;

    var Pencil = (function () {
        function Pencil(pen) {
            this.pen = pen;
            this.path = new DrawingTs.Path();
        }
        Pencil.prototype.contact = function (position) {
            this.path.moveTo(position);
            this.prev = position;
        };

        Pencil.prototype.drag = function (position) {
            if (this.prev == null)
                return;
            if (this.prev.to(position).norm() < 2) {
                return false;
            }

            this.path.lineTo(position);
            this.prev = position;
            return true;
        };

        Pencil.prototype.drop = function (position) {
            var result = this.clone();
            this.path = new DrawingTs.Path();
            this.prev = null;
            return result;
        };

        Pencil.prototype.draw = function (g) {
            g.drawPath(this.pen, this.path);
        };

        Pencil.prototype.erase = function (center, radius) {
            var buf = new DrawingTs.Path();
            var head = true;

            this.path.items.forEach(function (p, i, _) {
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
        };

        Pencil.prototype.clone = function () {
            var instance = new Pencil(this.pen);
            instance.path = this.path.clone();
            return instance;
        };
        return Pencil;
    })();
    DrawingTs.Pencil = Pencil;

    var Eraser = (function () {
        function Eraser(pen, radius) {
            this.pen = pen;
            this.radius = radius;
        }
        Eraser.prototype.contact = function (position) {
            this.center = position;
            if (this.onErase != null) {
                this.onErase(this.center, this.radius);
            }
        };

        Eraser.prototype.drag = function (position) {
            this.center = position;
            if (this.onErase != null) {
                this.onErase(this.center, this.radius);
                return true;
            }
            return false;
        };

        Eraser.prototype.drop = function (position) {
            this.center = null;
            return null;
        };

        Eraser.prototype.draw = function (g) {
            if (this.center == null) {
                return;
            }
            var bounds = new DrawingTs.Rectangle(this.center.x - this.radius, this.center.y - this.radius, this.radius * 2, this.radius * 2);
            g.drawElipse(this.pen, bounds);
        };

        Eraser.prototype.erase = function (center, radius) {
            return [];
        };
        return Eraser;
    })();
    DrawingTs.Eraser = Eraser;
})(DrawingTs || (DrawingTs = {}));
//# sourceMappingURL=drawingTs.js.map
