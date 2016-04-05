/*
 *  Leonardo charts nvd3.js barchart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    leonardo.charts.barchart = new function() {
        var _chart = this;
        _chart.instances = {};
        _chart.initialConfig = {
            chartSelector: "",
            containerSelector: "",
            url:"",
            requestData:{},
            updateInterval: 2000,
            stacked: true,
            sliceData:true,
        };
        this.getData = function(chartSelector) {
            return $.ajax({
                type: 'POST',
                data: _chart.instances[chartSelector].config.requestData,
                url: _chart.instances[chartSelector].config.url,
                datatype: 'json'
            });
        };
        this.updateData = function(chartSelector,pushData) {
            return $.ajax({
                type: 'POST',
                data: $.extend({},_chart.instances[chartSelector].config.requestData,{method: "get_update_data"}),
                url: _chart.instances[chartSelector].config.url,
                datatype: 'json',
                success: function(res) {
                    if(pushData){
                      _chart.pushData(chartSelector,res);
                    }else{
                      _chart.instances[chartSelector].data=res;
                    }
                    _chart.renderBarchart(chartSelector);
                }
            });
        };
        this.pushData = function(chartSelector,newData){
          $.each(_chart.data,function(index,datum){
            if(datum.hasOwnProperty("key")){
              var founded=false;
              $.each(newData,function(index2,newDatum){
                if(datum.key === newDatum.key){
                  Array.prototype.push.apply(datum.values, newDatum.values);
                  if(_chart.config.sliceData){
                    datum.values=datum.values.slice(newDatum.values.length);
                  }
                  founded=true;
                }
              });
              if(!founded){
                _chart.data = _chart.data.splice(newData);
              }
            }else{
              console.log("Pushed data "+index+" not have key!");
            }
          });
        };
        this.setBarchart3Height = function(chartSelector) {
            var containerHeight = $(_chart.instances[chartSelector].config.containerSelector).height(),
                svgHeight = containerHeight < 150 ? 150 : containerHeight;
            $(chartSelector).height(svgHeight);
        };

        this.renderBarchart = function(chartSelector) {
            d3.select(chartSelector).datum(_chart.instances[chartSelector].data).call(_chart.instances[chartSelector].chart);
        };
        this.initBarchart = function(config) {
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
                _chart.renderBarchart(config.chartSelector);
                nv.utils.windowResize(function() {
                    chart.update()
                });
                return chart;
            });

            _chart.setBarchart3Height(config.chartSelector);
            $(window).resize(_chart.setBarchart3Height.bind(null,config.chartSelector));
        };
        this.createBarchart = function(config) {
            config = $.extend({},_chart.initialConfig,config);
            _chart.instances[config.chartSelector] = {config:config};
            _chart.getData(config.chartSelector).done(function(res) {
                _chart.instances[config.chartSelector].data=res;
                _chart.initBarchart(config);
            });
            setInterval(_chart.updateData.bind(null,config.chartSelector,true), config.updateInterval);
        };
    };
    return leonardo;
}(leonardo || {});
