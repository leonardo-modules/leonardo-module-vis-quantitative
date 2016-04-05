/*
 *  Leonardo charts nvd3.js barchart module 
 */
var leonardo = function(leo) {
    leo.charts = leo.charts || {};

    leo.charts.barchart = new (function() {
        var _chart = this;
        _chart.config = {
            chartSelector: "",
            containerSelector: "",
            url:"",
            updateInterval: 2000,
            stacked: true
        };
        this.getData = function() {
            return $.ajax({
                type: 'POST',
                url: _chart.config.url,
                datatype: 'json'
            });
        };
        this.updateData = function(pushData) {
            return $.ajax({
                type: 'POST',
                data:{method: "get_update_data"},
                url: _chart.config.url,
                datatype: 'json',
                success: function(res) {
                    if(pushData){
                      _chart.pushData(res);
                    }else{
                      _chart.data=res;
                    }
                    _chart.renderBarchart();
                }
            });
        };
        this.pushData = function(newData){
          $.each(_chart.data,function(index,datum){
            if(datum.hasOwnProperty("key")){
              var founded=false;
              $.each(newData,function(index2,newDatum){
                if(datum.key === newDatum.key){
                  Array.prototype.push.apply(datum.values, newDatum.values);
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
        this.setBarchart3Height = function() {
            var containerHeight = $(_chart.config.containerSelector).height(),
                svgHeight = containerHeight < 150 ? 150 : containerHeight;
            $(_chart.config.chartSelector).height(svgHeight);
        };

        this.renderBarchart = function() {
            d3.select(_chart.config.chartSelector).datum(_chart.data).call(_chart.chartInstance);
        };
        this.initBarchart = function() {
            nv.addGraph(function() {
                var chart = nv.models.multiBarChart()
                    .reduceXTicks(true)
                    .rotateLabels(0)
                    .showControls(false)
                    .groupSpacing(0.1);

                if (_chart.config.stacked) {
                    chart.stacked(true);
                }
                chart.xAxis
                    .tickFormat(function(d) {
                        return d3.time.format('%d-%b')(new Date(d * 1000));
                    });

                chart.yAxis
                    .tickFormat(d3.format('.0'));

                _chart.chartInstance = chart;
                _chart.renderBarchart();
                nv.utils.windowResize(function() {
                    chart.update()
                });
                return chart;
            });

            _chart.setBarchart3Height();
            $(window).resize(_chart.setBarchart3Height);
        };
        this.createBarchart = function(config) {
            $.extend(_chart.config, config);
            _chart.getData().done(function(res) {
                _chart.data = res;
                _chart.initBarchart();
            });
            setInterval(_chart.updateData.bind(null,true), config.updateInterval);
        };
    })();
    return leo;
}(leonardo || {});