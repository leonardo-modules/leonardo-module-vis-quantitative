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
        this.initialConfig.strokeWidth=20;
        this.initialConfig.strokeGap=-2;
        this.initialConfig.shadow={width:1};
        this.initialConfig.display= 'radial';

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            console.log(data);
            console.log(self.instances[chartSelector].chart);
            self.instances[chartSelector].chart.update(data);
        };

        this.init = function(config) {
            var width = $(config.containerSelector).width();
            if(config.series){
                var metrics = config.series.length;
            }
            // var stroke_width = (width/2 - config.strokeGap * (metrics-1)) / (metrics+2)
            var diameter = (width - 2 * (config.strokeWidth * metrics + config.strokeGap * (metrics-1))) - 10;
            console.log(config);
            self.instances[config.chartSelector].chart = new RadialProgressChart(config.chartSelector, {
                diameter: diameter,
                series: config.series,
                stroke: {
                    width: config.strokeWidth,
                    gap: config.strokeGap
                }
            });
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.initChart("progressbar", new ProgressBar());
    return leonardo;
}(leonardo || {});
