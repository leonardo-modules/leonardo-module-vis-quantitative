/*
 *  Leonardo charts TextNumber module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    TextNumber.inherits(Chart);
    function TextNumber() {
        Chart.apply(this, arguments);
        
        var self = this;

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            $(chartSelector).html("<p>Data:" + JSON.stringify(data[0].values)+"</p>");
        };

        this.init = function(config) {
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.textnumber = new TextNumber();
    return leonardo;
}(leonardo || {});
