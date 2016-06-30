/*
 *  Leonardo charts isotype module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Isotype.inherits(Chart);
    function Isotype() {
        Chart.apply(this, arguments);
        var self = this;
        this.initialConfig.pushOrReplaceData="replace";

        this.render = function(chartSelector) {
            var data = self.getDataValue(chartSelector);
            d3.selectAll("use").attr("class",function(d,i){
               if (d < data) {
                   return "iconSelected";
               }    else    {
                   return "iconPlain";
               }
            });
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
            //create svg element
            size=$(config.containerSelector).width();
            var chart=d3.select(config.chartSelector)
                .append("svg")
                .attr("viewBox","0 0 100 100")
                .attr("width", size)
                .attr("height", size)
                .attr("preserveAspectRatio", "xMinYMin meet");

            //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar

            if(config.hasOwnProperty("iconUrl")){
                chart.append("defs")
                    .append("g")
                        .attr("id","iconCustom")
                    .append("image")
                        .attr("xlink:href",config.iconUrl)
                        .attr("width","8")
                        .attr("height","8")
            }else{
                chart.append("defs")
                    .append("g")
                        .attr("id","iconCustom")
                    .append("path")
                        .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");
            }

            //define color filter

            chart.selectAll("defs")
                .append("filter")
                    .attr("id","colorMask")
                .append("feColorMatrix")
                    .attr("type","matrix")
                    .attr("values","1 0 0.5 0.5 0.5, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 1 0")
                
            //specify the number of columns and rows for pictogram layout
            var numCols = 10;
            var numRows = 10;

            //padding for the grid
            var xPadding = 0;
            var yPadding = 0;

            //horizontal and vertical spacing between the icons
            var hBuffer = 10;
            var wBuffer = 10;

            //generate a d3 range for the total number of required elements
            var myIndex=d3.range(numCols*numRows);

            //create group element and create an svg <use> element for each icon
            chart.append("g")
                .attr("id","pictoLayer")
                .selectAll("use")
                .data(myIndex)
                .enter()
                .append("use")
                    .attr("xlink:href","#iconCustom")
                    .attr("id",function(d) {
                        return "icon"+d;
                    })
                    .attr("x",function(d) {
                        var remainder=d % numCols;//calculates the x position (column number) using modulus
                        return xPadding+(remainder*wBuffer);//apply the buffer and return value
                    })
                      .attr("y",function(d) {
                            var whole=Math.floor(d/numCols)//calculates the y position (row number)
                        return yPadding+(whole*hBuffer);//apply the buffer and return the value
                    })
                    .attr("width",1000)
                    .attr("height",1000)
                    .classed("iconPlain",true);

            self.instances[config.chartSelector].chart = chart;
            self.render(config.chartSelector);

            //apply filter to selected icons

            chart.selectAll("use.iconSelected")
                .attr("filter","url(#colorMask)")
        };
    };
    leonardo.charts.initChart("isotype", new Isotype());
    return leonardo;
}(leonardo || {});
