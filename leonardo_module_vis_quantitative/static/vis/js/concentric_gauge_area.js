function concentric_gauge_area(config) {

  var width = config.width,
      height = config.height,
      radius = Math.min(width, height) / 1.9,
      spacing = .1;

  var formatSecond = d3.time.format("%S s"),
      formatMinute = d3.time.format("%M m"),
      formatHour = d3.time.format("%H h"),
      formatDay = d3.time.format("%a"),
      formatDate = d3.time.format("%d d"),
      formatMonth = d3.time.format("%b");

  var color = d3.scale.linear()
      .range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
      .interpolate(interpolateHsl);

  var arc = d3.svg.arc()
      .startAngle(0)
      .endAngle(function(d) { return d.value * 2 * Math.PI; })
      .innerRadius(function(d) { return d.index * radius; })
      .outerRadius(function(d) { return (d.index + spacing * 2) * radius; });

  var svg = d3.select(config.placeholder).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var field = svg.selectAll("g")
      .data(fields)
    .enter().append("g");

  field.append("path");

  field.append("text");

  d3.transition().duration(500).each(tick);

  d3.select(self.frameElement).style("height", height + "px");

  function tick() {
    field = field
        .each(function(d) { this._value = d.value; })
        .data(fields)
        .each(function(d) { d.previousValue = this._value; });

    field.select("path")
      .transition()
  //      .duration(2500)
  //      .ease("elastic")
        .attrTween("d", arcTween)
        .style("fill", function(d) { return color(d.value); });

    field.select("text")
        .attr("dy", function(d) { return d.value < .5 ? "-.5em" : "1em"; })
        .text(function(d) { return d.text; })
      .transition()
//        .duration(2500)
        //.ease("elastic")
        .attr("transform", function(d) {
          return "rotate(" + 360 * d.value + ")"
              + "translate(0," + -(d.index + spacing) * radius + ")"
              + "rotate(" + (d.value < .5 ? -90 : 90) + ")"
        });

    setTimeout(tick, 5000 - Date.now() % 1000);
  }

  function arcTween(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) { d.value = i(t); return arc(d); };
  }

  function fields() {
    random1 = Math.round(Math.random() * 100) / 100;
    random2 = Math.round(Math.random() * 100) / 100;
    random3 = Math.round(Math.random() * 100) / 100;
    return [
      {index: .1, text: random1, value: random1},
      {index: .4, text: random2, value: random2},
      {index: .7, text: random3, value: random3},
    ];
  }

  // Avoid shortest-path interpolation.
  function interpolateHsl(a, b) {
    var i = d3.interpolateString(a, b);
    return function(t) {
      return d3.hsl(i(t));
    };
  }
}