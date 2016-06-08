/*
 *  Leonardo charts timetable module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    TimeTable.inherits(Chart);
    function TimeTable() {
        Chart.apply(this, arguments);
        
        var self = this;

        this.format_x_axis = function(d) {
            return d3.time.format('%d-%b')(new Date(d*1000));
        }

        this.format_y_axis = function(d) {
            return d
        }

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            $(chartSelector).prepend("<p>Data:" + JSON.stringify(data[0].values)+"</p><hr>");
        };

        this.init = function(config) {
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.initChart("timetable",new TimeTable());
    return leonardo;
}(leonardo || {});
