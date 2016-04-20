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
        this.initialConfig.strokeWidth=30;
        this.initialConfig.strokeGap=5;

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            console.log(data);
            self.instances[chartSelector].chart.update(data);
        };

        this.init = function(config) {
            var width = $(config.containerSelector).width();
            var metrics = config.series.length;
            var diameter = width - 2 * (config.strokeWidth * metrics + config.strokeGap * (metrics-1));
            var series = config.series;
            self.instances[config.chartSelector].chart = new RadialProgressChart(config.chartSelector, {
                diameter: diameter,
                series: series,
                shadow: {
                  width: 0
                },
                stroke: {
                    width: config.strokeWidth,
                    gap: config.strokeGap
                }
            });
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.progressbar = new ProgressBar();
    return leonardo;
}(leonardo || {});
