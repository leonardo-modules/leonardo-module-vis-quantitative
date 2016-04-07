/*
 *  Leonardo charts nvd3.js barchart module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Gauge.inherits(Chart);
    function Gauge() {
        Chart.apply(this, arguments);
        var _chart = this;
        this.initialConfig.min=0;
        this.initialConfig.max=100,
        this.initialConfig.minorTicks= 5;
        
        this.render = function(chartSelector) {
            var data=this.getDataValue(chartSelector);
            if(data){
                _chart.instances[chartSelector].chart.redraw(data);
            }
        };
        this.init = function(config) {
            var range = config.max - config.min,
                data = this.getDataValue(config.chartSelector);
            config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
            config.redZones = [{ from: config.min + range*0.9, to: config.max }];
            config.placeholder = config.chartSelector;
            config.width=$(config.containerSelector).width();
            config.size=config.width;
            if(data){
                config.data=data;
                _chart.instances[config.chartSelector].chart = new angular_gauge_pointer(config);
                _chart.instances[config.chartSelector].chart.render();
                _chart.render(config.chartSelector);
                $(window).resize(_chart.render.bind(this,config.chartSelector));
            }
        };
        this.getDataValue = function(chartSelector){
            if(_chart.instances[chartSelector].data){
                var data=_chart.instances[chartSelector].data;
                if(data instanceof Array && data.length ===1 && data[0].hasOwnProperty('value')){
                    return data[0].value;
                }else if(typeof data === 'object' && data.hasOwnProperty('value')){
                    return data.value;
                }else{
                    console.log("Invalid data given!");
                }
            }else{
                console.log("Invalid data given!");
            }
        };
    };
    leonardo.charts.gauge = new Gauge();
    return leonardo;
}(leonardo || {});
