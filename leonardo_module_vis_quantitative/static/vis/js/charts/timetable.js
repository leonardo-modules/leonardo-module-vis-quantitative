/*
 *  Leonardo charts timetable module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    TimeTable.inherits(Chart);
    function TimeTable() {
        Chart.apply(this, arguments);
        
        var self = this;

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            $(chartSelector).html(data);
// col 1            function(d){return d3.time.format('%d-%b')(new Date(d*1000));});
// col per time series           d3.format('.04f');
        };
        this.init = function(config) {
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.timetable = new TimeTable();
    return leonardo;
}(leonardo || {});
