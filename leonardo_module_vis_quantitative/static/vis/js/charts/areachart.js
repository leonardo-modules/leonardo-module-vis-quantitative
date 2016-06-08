/*
 *  Leonardo charts nvd3.js areachart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Areachart.inherits(Chart);
    function Areachart() {
        Chart.apply(this, arguments);
        this.initialConfig.stacked=true;
        
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
                var chart = nv.models.stackedAreaChart()
                  .showLegend(true)      
                  .showYAxis(true)       
                  .showXAxis(true)
                  .interpolate(config.interpolation)
                  .showControls(false)       //Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
                  .clipEdge(true);
  
                chart.xAxis
                    .tickFormat(function(d) {
                        return d3.time.format(config.timeFormat)(new Date(d * 1000));
                    });

                chart.yAxis
                    .tickFormat(d3.format(config.valueFormat));

                chart.style(config.style);
                
                self.instances[config.chartSelector].chart = chart;
                self.render(config.chartSelector);
                //Update the chart when window resizes.
                nv.utils.windowResize(function() { chart.update() });
                return chart;
             });
            self.setChartHeight(config.chartSelector);
            $(window).resize(self.setChartHeight.bind(this,config.chartSelector));
        };
    };
    leonardo.charts.initChart("areachart",new Areachart());
    return leonardo;
}(leonardo || {});
