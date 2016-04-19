/*
 *  Leonardo quatitative visualization module: Progress bar widget
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    ProgressBar.inherits(Chart);
    function ProgressBar() {
        Chart.apply(this, arguments);
        var self = this;
        this.initialConfig.pushOrReplaceData="replace";

        this.render = function(chartSelector) {
            var data = self.instances[chartSelector].data;
            $(chartSelector).html("<h1>" + data[0].value+"</h1>");
        };

        this.init = function(config) {
            chart = new RadialProgressChart('.progress', {
                diameter: 200,
                series: [
                  {
                    labelStart: '\uF105',
                    value: 0,
                    color: {
                      linearGradient: { x1: '0%', y1: '100%', x2: '50%', y2: '0%', spreadMethod: 'pad' },
                      stops: [
                        {offset: '0%', 'stop-color': '#ffff00', 'stop-opacity': 1},
                        {offset: '100%', 'stop-color': '#ff0000', 'stop-opacity': 1}
                      ]}
                  }
                ],

            self.render(config.chartSelector);
        };
    };
    leonardo.charts.progressbar = new ProgressBar();
    return leonardo;
}(leonardo || {});
