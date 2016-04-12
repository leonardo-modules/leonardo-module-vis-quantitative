/*
 *  Leonardo charts nvd3.js donutchart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Donutchart.inherits(Chart);
    function Donutchart() {
        Chart.apply(this, arguments);
        var self = this;

        this.render = function(chartSelector) {
            d3.select(chartSelector).datum(this.getChart(chartSelector).data).transition().duration(350).call(this.getChart(chartSelector).chart);
        };
        this.init = function(config) {
            var chart_width = $(config.containerSelector).width();
            $(config.chartSelector).height(chart_width);
              nv.addGraph(function() {
                var chart = nv.models.pieChart()
                  .x(function(d) { return d.label })
                  .y(function(d) { return d.value })
                  .labelType("value") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                  .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                  .donutRatio(0.35)  
                  .height(chart_width)
                  .showLabels(true);
                self.instances[config.chartSelector].chart = chart;
                self.render(config.chartSelector);
                return chart;
              });
        };
    };
    leonardo.charts.donutchart = new Donutchart();
    return leonardo;
}(leonardo || {});