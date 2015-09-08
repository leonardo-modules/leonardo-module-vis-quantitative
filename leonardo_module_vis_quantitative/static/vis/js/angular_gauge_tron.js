
// donut charts
if(parseInt(d3.select('body').style('width'), 10) < 992) {
	var donut_resize = 0.8;
} else {
	var donut_resize = 0.5;
}
var donut_radius = 0.9;
// u3
var u3 = {w: parseInt(d3.select('div#u3').style('width'), 10)*donut_resize};
	u3.h = u3.w;
    u3.radius = Math.min(u3.w, u3.h) / 2;

	u3.color = ["#3498db", "#FFF"];

	u3.pie = d3.layout.pie()
    			.sort(null);

    u3.arc = d3.svg.arc()
			    .innerRadius(u3.radius-1)
			    .outerRadius(u3.radius *donut_radius);

    u3.svg = d3.select("div#u3").append("svg")
    			.attr("id", "u3-container")
			    .attr("width", u3.w)
			    .attr("height", u3.h);

    u3.g = u3.svg   
    .append("g")
    .attr("transform", "translate(" + (u3.w / 2) + "," + (u3.h / 2) + ")");

   u3.path = u3.g.selectAll("path")
    .data(u3.pie([para.u3, (1-para.u3)]))
   .enter().append("path")
    .attr("fill", function(d, i) { return u3.color[i]; })
    .attr("d", u3.arc)
    .each(function(d) { this._current = d; });

    u3.text = u3.svg.append("text")
    			.attr("class", "perc")
    			.attr("text-anchor","middle")
    			.attr("x", u3.w/2)
    			.attr("y", u3.h/2)
    			.attr("dy", "0.35em")
       			.text(d3.round(para.u3*100, 2) + " %");
    d3.select('div#u3')
    	.append("p")
    	.attr("class", "donuts")
    	.html("Cohen's U<sub>3</sub>")    			

// copy text
function changeInterpretText() {
	d3.select("span#u3")
		.text(d3.round(para.u3*100,0));

}

changeInterpretText();	

function updateEStext(old_u3, old_perc, old_CL, old_NNT) {
	
	// update u3 text
	u3.text
		.transition()
		.duration(500)
		.tween("text", function() {
		  var i = d3.interpolate(old_u3, para.u3);
		  return function(t) {
		    this.textContent = d3.round(i(t)*100, 2) + " %";
		  }});

}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return u3.arc(i(t));
    };
}

function sliderChange(value) {
	  var old_u3 = para.u3;
	  para.u3 = jStat.normal.cdf(para.cohend, 0, 1);	
	  
		// update donut charts
		u3.path.data(u3.pie([para.u3, (1-para.u3)]))
				.transition()
				.duration(600)
				.attrTween("d", arcTween);
		// update copy text
		changeInterpretText();								
	};	


// resize
$(window).on("resize", resize);

function resize() {
	var aspect = 0.4;
	var margin = {top: 40, right: 20, bottom: 30, left: 20},
 	w = parseInt(d3.select('#viz').style('width'), 10);
	w = w - margin.left - margin.right;
	h = aspect*w-margin.top - margin.left;
	
	// Scales
	xScale.range([0,w]);
	yScale.range([0,h]);
	
	// Axis
	xAx.attr("transform", "translate(0," + h + ")")
		.call(xAxis);  
	
	// do the actual resize...
	svg.attr("width", w + margin.left + margin.right)
		.attr("height", h + margin.top + margin.bottom);
		
		
}
