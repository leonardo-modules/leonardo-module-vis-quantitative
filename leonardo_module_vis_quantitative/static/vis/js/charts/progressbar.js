/*
 *  Leonardo quatitative visualization module: Progress bar widget
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    ProgressBar.inherits(Chart);
    function ProgressBar() {
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
    leonardo.charts.progressbar = new ProgressBar();
    return leonardo;
}(leonardo || {});
