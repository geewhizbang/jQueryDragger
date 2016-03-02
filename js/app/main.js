define(["jquery", "jquery.dragger"], function ($) {

    $(function () {
        var $drag = $('#dragElement').dragger();
        
        $('body').ready(function () {
            $("#controls").find("input").on("change", function (e) {
                var el = e.currentTarget;
                var $el = $(el);
                var prop = (el.checked ? JSON.parse(el.value) : null);                                
                
                if (el.id.indexOf('constrain' > -1)) {
                    var refPosition = $drag.draggerExec.option("pos").reference;
                    var fc = el.id.substr(0, 1);
                    var posType = fc == "x" ? "left" : "top"
                    $min = $("#" + fc + "Max");
                    $max = $("#" + fc + "Min");
                    if (el.checked) {
                        $drag.draggerExec.reset();
                        $min.css(posType, refPosition[posType] + prop[0]);
                        $max.css(posType, refPosition[posType] + prop[1] + $drag[fc=="x" ? "width" : "height"]());
                    }
                    $min.toggle(el.checked);
                    $max.toggle(el.checked);
                }                

                $drag.draggerExec.option(el.id, prop);

            })
        })

    });
});
