/*
 *  Leonardo quatitative visualization module: Tex number widget
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    TextNumber.inherits(Chart);
    function TextNumber() {
        Chart.apply(this, arguments);
        var self = this;
        this.initialConfig.pushOrReplaceData="replace";

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            $(chartSelector).html("<h1>" + data[0].value+"</h1>");
        };

        this.init = function(config) {
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.textnumber = new TextNumber();
    return leonardo;
}(leonardo || {});
