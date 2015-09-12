
function angular_gauge_area(config) {

  var donut_radius = 0.9;

  var gauge = {w: config.width};
  gauge.h = gauge.w;
  gauge.radius = Math.min(gauge.w, gauge.h) / 2;

  gauge.color = ["#3498db", "transparent"];

  gauge.pie = d3.layout.pie()
        .sort(null);

  gauge.arc = d3.svg.arc()
    .innerRadius(gauge.radius-1)
    .outerRadius(gauge.radius * donut_radius);

  gauge.svg = d3.select(config.placeholder).append("svg")
    .attr("width", gauge.w)
    .attr("height", gauge.h);

  gauge.g = gauge.svg
    .append("g")
    .attr("transform", "translate(" + (gauge.w / 2) + "," + (gauge.h / 2) + ")");

  gauge.path = gauge.g.selectAll("path")
    .data(gauge.pie([config.data, (1-config.data)]))
    .enter().append("path")
    .attr("fill", function(d, i) { return gauge.color[i]; })
    .attr("d", gauge.arc)
    .each(function(d) { this._current = d; });

  gauge.text = gauge.svg.append("text")
    .attr("class", "perc")
    .attr("text-anchor","middle")
    .attr("x", gauge.w/2)
    .attr("y", gauge.h/2)
    .attr("dy", "0.35em")
    .text(d3.round(config.data*100, 2) + " %");

  /*
  d3.select(config.placeholder)
    .append("p")
    .attr("class", "donuts")
    .html("Cohen's U<sub>3</sub>")
  // copy text
  function changeInterpretText() {
    d3.select("span#gauge")
      .text(d3.round(config.data*100,0));
  }
  changeInterpretText();
  */


  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return gauge.arc(i(t));
    };
  }

  function sliderChange(value) {
      var old_gauge = config.data;
      config.data = jStat.normal.cdf(para.cohend, 0, 1);
      
      // update donut charts
      gauge.path.data(gauge.pie([config.data, (1-config.data)]))
          .transition()
          .duration(600)
          .attrTween("d", arcTween);
      // update copy text
      //changeInterpretText();
  };

}