define(["jquery"], function ($) {
    (function ($) {
        $.fn.dragger = function (opt) {

            var originalZ = null,
                thisDrag = this,
                isEnabled = true,
                dragger, $el, $parents;

            function sortConstraint(x) {
                if (x != null) {
                    x.sort();
                }
            }

            function toggleChildEvents(isActive) {

                $this = $(thisDrag);
                var onOff = isActive ? "on" : "off";

                $drag = (opt.handle === "") ?
                    $this.toggleClass('draggable', isActive) :
                    $this.toggleClass('active-handle', isActive).parent().toggleClass('draggable', isActive);

                if (originalZ == null) { originalZ = $drag.css('z-index'); }

                $parents = $drag.css('z-index', isActive ? 1001 : originalZ).parents();
                $parents[onOff]("mousemove", mouseMove);

                $el[onOff]("mouseup", mouseUp);
                $el.css('cursor', isActive || opt.keepCursorOnEnd ? opt.cursor : "default");
            }

            function mouseEnd() {

                $drag.css('z-index', originalZ);
                toggleChildEvents(false);

                if (isEnabled) {
                    var movedLeft = (opt.pos.current.left - opt.pos.start.left) < 0;

                    if (opt.handle === "") {
                        $(this).removeClass('draggable');
                    } else {
                        $(this).removeClass('active-handle').parent().removeClass('draggable');
                    }

                    if (opt.autoEnd) {
                        dragger.start(false);
                    }

                    opt.onEndMove({ movedLeft: movedLeft })
                }

            }

            function mouseDown(e) {

                if (isEnabled) {
                    toggleChildEvents(true);
                    opt.pos.current = $drag.offset();
                    opt.pos.start = opt.pos.current;
                    opt.pos.click = { y: e.pageY, x: e.pageX };
                }
                e.preventDefault();     // disable selection 
            }

            function mouseMove(e) {

                opt.pos.current = {
                    top: (opt.axis == "x" ? opt.pos.start.top : opt.pos.start.top + e.pageY - opt.pos.click.y),
                    left: (opt.axis == "y" ? opt.pos.start.left : opt.pos.start.left + e.pageX - opt.pos.click.x)
                };

                var endMove = (opt.xMaxMove != null && Math.abs(opt.pos.current.left - opt.pos.start.left) > opt.xMaxMove);

                if (opt.xConstrain != null) {
                    var xDiff = opt.pos.current.left - opt.pos.reference.left;
                    if (xDiff < opt.xConstrain[0]) {
                        opt.pos.current.left = opt.pos.reference.left + opt.xConstrain[0];
                        endMove = opt.xConstrain[0] - xDiff > 10;
                    } else if (xDiff > opt.xConstrain[1]) {
                        opt.pos.current.left = opt.pos.reference.left + +opt.xConstrain[1];
                        endMove = xDiff - opt.xConstrain[1] > 10;
                    }
                }

                endMove = (endMove || opt.yMaxMove != null && Math.abs(opt.pos.current.top - opt.pos.start.top) > opt.yMaxMove);

                if (opt.yConstrain != null) {
                    var yDiff = opt.pos.current.top - opt.pos.reference.top;
                    if (yDiff < opt.yConstrain[0]) {
                        opt.pos.current.top = opt.pos.reference.top + opt.yConstrain[0];
                        endMove = opt.yConstrain[0] - yDiff > 10;
                    } else if (yDiff > opt.yConstrain[1]) {
                        opt.pos.current.top = opt.pos.reference.top + +opt.yConstrain[1];
                        endMove = yDiff -opt.yConstrain[1] > 10;
                    }
                }

                $d = $('.draggable');
                if (endMove) { mouseEnd(); } else {
                    $d.offset(opt.pos.current);
                }
            }

            function mouseUp(e) {

                if (opt.onClick != null) {
                    var d = Math.sqrt(Math.pow(opt.pos.current.left - opt.pos.start.left, 2) + Math.pow(opt.pos.current.top - opt.pos.start.top, 2));
                    if (d < 4) {
                        isEnabled = opt.onClick();
                        return;
                    }
                }
                $(this).removeClass('draggable').css('z-index', originalZ);
                mouseEnd();
            }

            dragger = {

                start: function (start, newPos) {

                    if (opt.pos == null) {
                        var cc = $el.offset();
                        opt.pos = { start: cc, current: cc, reference: cc };
                    }

                    if (typeof newPos != "undefined") {
                        opt.pos = $.extend(opt.pos, newPos);
                    }

                    $el[start ? "on" : "off"]("mousedown", mouseDown);
                    if (!start) {
                        toggleChildEvents(false);
                    }
                },
                setEnabled: function (enabled) {
                    isEnabled = enabled;
                    if (isEnabled) {
                        opt.pos.current = $drag.offset();
                    } else {
                        toggleChildEvents(isEnabled);
                    }
                },
                option: function (option, value) {
                    if (typeof value != 'undefined') {
                        opt[option] = value;
                    }
                    return opt[option];
                },
                reset: function () {
                    $el.css("left", opt.pos.reference.left).css("top", opt.pos.reference.top);
                }

            }

            opt = $.extend({
                handle: "",
                cursor: "move",
                axis: null,
                autoStart: true,
                autoEnd: false,
                xMaxMove: null,
                keepCursorOnEnd: false,
                yMaxMove: null,
                xConstrain: null,
                yConstrain: null,
                onClick: null,
                onEndMove: function () { }
            }, opt);

            sortConstraint(opt.xConstrain);
            sortConstraint(opt.yConstrain);

            $el = (opt.handle === "") ? $el = this : this.find(opt.handle);

            $el.draggerExec = dragger;
            if (opt.autoStart) { dragger.start(true); }
            return $el

        }
    })(jQuery);
});