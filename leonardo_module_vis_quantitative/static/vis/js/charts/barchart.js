/*
 *  Leonardo charts nvd3.js barchart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Barchart.inherits(Chart);
    function Barchart() {
        Chart.apply(this, arguments);
        this.initialConfig.stacked=true;
        var _chart = this;
        this.setBarchart3Height = function(chartSelector) {
            var containerHeight = $(_chart.instances[chartSelector].config.containerSelector).height(),
                svgHeight = containerHeight < 150 ? 150 : containerHeight;
            $(chartSelector).height(svgHeight);
        };

        this.render = function(chartSelector) {
            d3.select(chartSelector).datum(_chart.instances[chartSelector].data).call(_chart.instances[chartSelector].chart);
        };
        this.init = function(config) {
            nv.addGraph(function() {
                var chart = nv.models.multiBarChart()
                    .reduceXTicks(true)
                    .rotateLabels(0)
                    .showControls(false)
                    .groupSpacing(0.1);
                if (config.stacked) {
                    chart.stacked(true);
                }
                chart.xAxis
                    .tickFormat(function(d) {
                        return d3.time.format('%d-%b')(new Date(d * 1000));
                    });
                chart.yAxis
                    .tickFormat(d3.format('.0'));
                _chart.instances[config.chartSelector].chart = chart;
                _chart.render(config.chartSelector);
                nv.utils.windowResize(function() {
                    chart.update()
                });
                return chart;
            });

            _chart.setBarchart3Height(config.chartSelector);
            $(window).resize(_chart.setBarchart3Height.bind(this,config.chartSelector));
        };
        this.create = function(config) {
            config = $.extend({},_chart.initialConfig,config);
            _chart.instances[config.chartSelector] = {config:config};
            _chart.getData(config.chartSelector).done(function(res) {
                _chart.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
                _chart.init(config);
                setInterval(function(){
                    _chart.updateData(config.chartSelector).done(function(res) {
                        if(config.pushOrReplaceData == "push"){
                          _chart.pushData(config.chartSelector,(config.dataKey)?res[config.dataKey]:res);
                        }else{
                          _chart.instances[config.chartSelector].data=(config.dataKey)?res[config.dataKey]:res;
                        }
                        _chart.render(config.chartSelector);
                    });
                }, config.updateInterval);
            });

        };
    };
    leonardo.charts.barchart = new Barchart();
    return leonardo;
}(leonardo || {});
