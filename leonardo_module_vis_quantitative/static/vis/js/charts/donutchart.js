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
            var data = this.getChart(chartSelector).data;
            d3.select(chartSelector)
              .datum(data)
              .transition()
              .duration(350)
              .call(this.getChart(chartSelector).chart);
        };

        this.init = function(config) {
            var chart_width = $(config.containerSelector).width();
            $(config.chartSelector).height(chart_width);
            nv.addGraph(function() {
                var chart = nv.models.pieChart()
                  .x(function(d) { return d.label })
                  .y(function(d) { return d.value })
//Configure what type of data to show in the label. Can be "key", "value" or "percent"
                  .labelType("value")
                  .height(chart_width)
                  .padAngle(.05)
                  .cornerRadius(5)
                  .showLabels(true);
                if(config.donut_ratio > 0){
                  chart.donut(true)
                    .donutRatio(config.donut_ratio/100)  
                }
                if(config.display == "half_circle_top"){
                  chart.pie
                    .startAngle(function(d) { return d.startAngle/2 - Math.PI/2 })
                    .endAngle(function(d) { return d.endAngle/2 - Math.PI/2 });
                }
                self.instances[config.chartSelector].chart = chart;
                self.render(config.chartSelector);
                return chart;
            });
        };
    };
    leonardo.charts.initChart("donutchart",new Donutchart());
    return leonardo;
}(leonardo || {});
