/*
 *  Leonardo quatitative visualization module: Tex number widget
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    TextNumber.inherits(Chart);
    function TextNumber() {
        Chart.apply(this, arguments);
        var self = this;
        var decimal_places = 2;
        var decimal_factor = decimal_places === 0 ? 1 : Math.pow(10, decimal_places);
        var isFloat = function isFloat(n){
            return n != "" && !isNaN(n) && Math.round(n) != n;
        };
        this.initialConfig.pushOrReplaceData="replace";

        this.render = function(chartSelector) {
            var $chart=$(chartSelector+" div.number");
                chartValue=parseFloat($chart.html());
            if(isNaN(chartValue) || chartValue==-1){
                  $chart.html(self.getDataValue(chartSelector));
                  horizon.utils.loadAngular($chart);
            }else{
                  $chart.prop('number', chartValue).animateNumber(
                    {number: self.getDataValue(chartSelector)},
                    'normal'
                  );
            }
        };
        this.getDataValue = function(chartSelector){
            if(self.instances[chartSelector].data){
                var data=self.instances[chartSelector].data;
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
        this.init = function(config) {
            $(config.chartSelector).html('<div data-fittext class="number w100p h100p"></div>');
            $(config.chartSelector).addClass("w100p h100p");
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.initChart("textnumber",new TextNumber());
    return leonardo;
}(leonardo || {});
