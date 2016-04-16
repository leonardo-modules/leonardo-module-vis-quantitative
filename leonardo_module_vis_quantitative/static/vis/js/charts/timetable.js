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
            //$(chartSelector).html(data);
            console.log(data);
            console.log(chartSelector);
            final_data = {};
//            for datum in data.values {
//                final_data[data.values[datum.x]] = {
//                    'value': self.format_x_axis(datum.x)
//                    'date': self.format_x_axis(datum.x)
//                }
//            }
        };

        this.init = function(config) {
            self.render(config.chartSelector);
        };
    };
    leonardo.charts.timetable = new TimeTable();
    return leonardo;
}(leonardo || {});
