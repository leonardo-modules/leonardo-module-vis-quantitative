/*
 *  Leonardo charts angular gauge module 
 */
var leonardo = function(leonardo) {
    leonardo.charts = leonardo.charts || {};

    Gauge.inherits(Chart);
    function Gauge() {
        Chart.apply(this, arguments);
        var self = this;
        this.initialConfig.min=0;
        this.initialConfig.max=100,
        this.initialConfig.minorTicks= 5;
        //enforce replacing data
        this.initialConfig.pushOrReplaceData="replace";
        
        this.render = function(chartSelector) {
            var data=this.getDataValue(chartSelector);
            if(data || data === 0){
                self.instances[chartSelector].chart.redraw(data);
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
            if(config.scale && parseFloat(config.scale) >=0){
                config.size=config.size*parseFloat(config.scale);
            }
            if(data || data === 0){
                config.data=data;
                self.instances[config.chartSelector].chart = new angular_gauge_pointer(config);
                self.instances[config.chartSelector].chart.render();
                self.render(config.chartSelector);
                $(window).resize(self.render.bind(this,config.chartSelector));
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
    };
    leonardo.charts.initChart("gauge",new Gauge());

    function angular_gauge_pointer(config){
            this.placeholderName = config.placeholder;
            
            var self = this; // for internal d3 functions
            
            this.configure = function(config)
            {
                this.config = config;
                //this.config.size = this.config.size * 0.9;
                this.config.radius = this.config.size * 0.97 / 2;
                this.config.cx = this.config.size / 2;
                this.config.cy = this.config.size / 2;
                this.config.min = undefined != config.min ? config.min : 0; 
                this.config.max = undefined != config.max ? config.max : 100; 
                this.config.range = this.config.max - this.config.min;
                this.config.majorTicks = config.majorTicks || 5;
                this.config.minorTicks = config.minorTicks || 2;
                this.config.greenColor  = config.greenColor || "#109618";
                this.config.yellowColor = config.yellowColor || "#FF9900";
                this.config.redColor    = config.redColor || "#DC3912";
                
                this.config.transitionDuration = config.transitionDuration || 500;
            }

            this.render = function()
            {
                this.body = d3.select(this.placeholderName)
                                    .append("svg:svg")
                                    .attr("class", "gauge")
                                    .attr("width", this.config.size)
                                    .attr("height", this.config.size);
                
                this.body.append("svg:circle")
                            .attr("cx", this.config.cx)
                            .attr("cy", this.config.cy)
                            .attr("r", this.config.radius)
                            .style("fill", "#ccc")
                            .style("stroke", "#000")
                            .style("stroke-width", "0.5px");
                            
                this.body.append("svg:circle")
                            .attr("cx", this.config.cx)
                            .attr("cy", this.config.cy)
                            .attr("r", 0.9 * this.config.radius)
                            .style("fill", "#fff")
                            .style("stroke", "#e0e0e0")
                            .style("stroke-width", "2px");
                            
                for (var index in this.config.greenZones)
                {
                    this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
                }
                
                for (var index in this.config.yellowZones)
                {
                    this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
                }
                
                for (var index in this.config.redZones)
                {
                    this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
                }
                
                if (undefined != this.config.label)
                {
                    var fontSize = Math.round(this.config.size / 9);
                    this.body.append("svg:text")
                                .attr("x", this.config.cx)
                                .attr("y", this.config.cy / 2 + fontSize / 2)
                                .attr("dy", fontSize / 2)
                                .attr("text-anchor", "middle")
                                .text(this.config.label)
                                .style("font-size", fontSize + "px")
                                .style("fill", "#333")
                                .style("stroke-width", "0px");
                }
                
                var fontSize = Math.round(this.config.size / 16);
                var majorDelta = this.config.range / (this.config.majorTicks - 1);
                for (var major = this.config.min; major <= this.config.max; major += majorDelta)
                {
                    var minorDelta = majorDelta / this.config.minorTicks;
                    for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
                    {
                        var point1 = this.valueToPoint(minor, 0.75);
                        var point2 = this.valueToPoint(minor, 0.85);
                        
                        this.body.append("svg:line")
                                    .attr("x1", point1.x)
                                    .attr("y1", point1.y)
                                    .attr("x2", point2.x)
                                    .attr("y2", point2.y)
                                    .style("stroke", "#666")
                                    .style("stroke-width", "1px");
                    }
                    
                    var point1 = this.valueToPoint(major, 0.7);
                    var point2 = this.valueToPoint(major, 0.85);    
                    
                    this.body.append("svg:line")
                                .attr("x1", point1.x)
                                .attr("y1", point1.y)
                                .attr("x2", point2.x)
                                .attr("y2", point2.y)
                                .style("stroke", "#333")
                                .style("stroke-width", "2px");
                    
                    if (major == this.config.min || major == this.config.max)
                    {
                        var point = this.valueToPoint(major, 0.63);
                        
                        this.body.append("svg:text")
                                    .attr("x", point.x)
                                    .attr("y", point.y)
                                    .attr("dy", fontSize / 3)
                                    .attr("text-anchor", major == this.config.min ? "start" : "end")
                                    .text(major)
                                    .style("font-size", fontSize + "px")
                                    .style("fill", "#333")
                                    .style("stroke-width", "0px");
                    }
                }
                
                var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
                
                var midValue = (this.config.min + this.config.max) / 2;
                
                var pointerPath = this.buildPointerPath(midValue);
                
                var pointerLine = d3.svg.line()
                                            .x(function(d) { return d.x })
                                            .y(function(d) { return d.y })
                                            .interpolate("basis");
                
                pointerContainer.selectAll("path")
                                    .data([pointerPath])
                                    .enter()
                                        .append("svg:path")
                                            .attr("d", pointerLine)
                                            .style("fill", "#dc3912")
                                            .style("stroke", "#c63310")
                                            .style("fill-opacity", 0.7)
                            
                pointerContainer.append("svg:circle")
                                    .attr("cx", this.config.cx)
                                    .attr("cy", this.config.cy)
                                    .attr("r", 0.12 * this.config.radius)
                                    .style("fill", "#4684EE")
                                    .style("stroke", "#666")
                                    .style("opacity", 1);
                
                var fontSize = Math.round(this.config.size / 10);
                pointerContainer.selectAll("text")
                                    .data([midValue])
                                    .enter()
                                        .append("svg:text")
                                            .attr("x", this.config.cx)
                                            .attr("y", this.config.size - this.config.cy / 4 - fontSize)
                                            .attr("dy", fontSize / 2)
                                            .attr("text-anchor", "middle")
                                            .style("font-size", fontSize + "px")
                                            .style("fill", "#000")
                                            .style("stroke-width", "0px");
                
                this.redraw(this.config.min, 0);
            }
            
            this.buildPointerPath = function(value)
            {
                var delta = this.config.range / 13;
                
                var head = valueToPoint(value, 0.85);
                var head1 = valueToPoint(value - delta, 0.12);
                var head2 = valueToPoint(value + delta, 0.12);
                
                var tailValue = value - (this.config.range * (1/(270/360)) / 2);
                var tail = valueToPoint(tailValue, 0.28);
                var tail1 = valueToPoint(tailValue - delta, 0.12);
                var tail2 = valueToPoint(tailValue + delta, 0.12);
                
                return [head, head1, tail2, tail, tail1, head2, head];
                
                function valueToPoint(value, factor)
                {
                    var point = self.valueToPoint(value, factor);
                    point.x -= self.config.cx;
                    point.y -= self.config.cy;
                    return point;
                }
            }
            
            this.drawBand = function(start, end, color)
            {
                if (0 >= end - start) return;
                
                this.body.append("svg:path")
                            .style("fill", color)
                            .attr("d", d3.svg.arc()
                                .startAngle(this.valueToRadians(start))
                                .endAngle(this.valueToRadians(end))
                                .innerRadius(0.65 * this.config.radius)
                                .outerRadius(0.85 * this.config.radius))
                            .attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
            }
            
            this.redraw = function(value, transitionDuration)
            {
                var pointerContainer = this.body.select(".pointerContainer");
                
                pointerContainer.selectAll("text").text(Math.round(value));
                
                var pointer = pointerContainer.selectAll("path");
                pointer.transition()
                            .duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
                            //.delay(0)
                            //.ease("linear")
                            //.attr("transform", function(d) 
                            .attrTween("transform", function()
                            {
                                var pointerValue = value;
                                if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
                                else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
                                var targetRotation = (self.valueToDegrees(pointerValue) - 90);
                                var currentRotation = self._currentRotation || targetRotation;
                                self._currentRotation = targetRotation;
                                
                                return function(step) 
                                {
                                    var rotation = currentRotation + (targetRotation-currentRotation)*step;
                                    return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
                                }
                            });
            }
            
            this.valueToDegrees = function(value)
            {
                // thanks @closealert
                //return value / this.config.range * 270 - 45;
                return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
            }
            
            this.valueToRadians = function(value)
            {
                return this.valueToDegrees(value) * Math.PI / 180;
            }
            
            this.valueToPoint = function(value, factor)
            {
                return {    x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
                            y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))      };
            }
            
            // initialization
            this.configure(config);
        }
    return leonardo;
}(leonardo || {});
