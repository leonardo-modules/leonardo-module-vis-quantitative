/*
 *  Leonardo charts nvd3.js barchart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Barchart.inherits(Chart);
    function Barchart() {
        Chart.apply(this, arguments);
        this.initialConfig.display="stack";
        
        var self = this;
        this.setChartHeight = function(chartSelector) {
            var containerHeight = $(self.instances[chartSelector].config.containerSelector).height(),
                svgHeight = containerHeight < 150 ? 150 : containerHeight;
            $(chartSelector).height(svgHeight);
        };

        this.render = function(chartSelector) {
            d3.select(chartSelector).datum(this.getChart(chartSelector).data).call(this.getChart(chartSelector).chart);
        };
        this.init = function(config) {
            nv.addGraph(function() {
                var chart = nv.models.multiBarChart()
                    .reduceXTicks(true)
                    .rotateLabels(0)
                    .showControls(false)
                    .groupSpacing(0.1);
                if (config.display == "stack") {
                    chart.stacked(true);
                }
                chart.xAxis
                    .tickFormat(function(d) {
                        return d3.time.format(config.timeFormat)(new Date(d * 1000));
                    });
                chart.yAxis
                    .tickFormat(d3.format(config.valueFormat));

                self.instances[config.chartSelector].chart = chart;
                self.render(config.chartSelector);
                nv.utils.windowResize(function() {
                    chart.update()
                });
                return chart;
            });

            self.setChartHeight(config.chartSelector);
            $(window).resize(self.setChartHeight.bind(this,config.chartSelector));
        };
    };
    leonardo.charts.initChart("barchart", new Barchart());
    return leonardo;
}(leonardo || {});
