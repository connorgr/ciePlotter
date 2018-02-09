function drawPlots(allColors) {
  allColors = allColors.map(d => d3.lab(d));

  // subsample colors
  var delta = 10,
      colors = [],
      itr = allColors.length < 8 ? 1 : Math.floor(allColors.length/8);

  var domain = Array(allColors.length).fill(allColors.length - 1).map((d,i) => i / d),
      colorScale = d3.scaleLinear(d3.interpolateLab).domain(domain).range(allColors);
  colors = Array(8).fill(0).map((d,i) => d3.lab(colorScale(i/7)));


  var container = d3.select("body").append("div").style("margin-bottom", "2em"),
      svgClasses = ["plot_ab", "plot_la", "plot_lb"];
      plots = container.selectAll("svg")
          .data(svgClasses).enter().append("svg")
          .classed("plot", true);

  plots.each(function(d) { d3.select(this).classed(d, true); });

  var width = 200,
      height = width,
      fullWidth = width,
      margin = { top: 25, right: 25, bottom: 25, left: 25 };

  plots.style("width", width + "px").style("height", height + "px");

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  plots.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

  // x and y refer to when a and b are either on the x or y axis s
  var scale_l = d3.scaleLinear().domain([0, 100]).range([height, 0]),
      scale_ab_x = d3.scaleLinear().domain([-100, 100]).range([0, height]),
      scale_ab_y = d3.scaleLinear().domain([-100, 100]).range([height, 0]);

  var plot_ab = container.select(".plot_ab").select("g"),
      plot_la = container.select(".plot_la").select("g"),
      plot_lb = container.select(".plot_lb").select("g");

  var xaxis_ab = d3.axisBottom(scale_ab_x),
      yaxis_ab = d3.axisLeft(scale_ab_y),
      yaxis_l = d3.axisLeft(scale_l);

  var lineFn_ab = d3.line().x(d => scale_ab_x(d.a)).y(d => scale_ab_y(d.b)),
      lineFn_la = d3.line().x(d => scale_ab_x(d.a)).y(d => scale_l(d.l)),
      lineFn_lb = d3.line().x(d => scale_ab_x(d.b)).y(d => scale_l(d.l));

  plot_ab.append("g").classed("axisGroup", true).attr("transform", "translate(0,"+(height/2)+")").call(xaxis_ab);
  plot_ab.append("g").classed("axisGroup", true).attr("transform", "translate("+(width/2)+",0)").call(yaxis_ab);
  plot_ab.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 0).text("x: a*");
  plot_ab.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 12).text("y: b*");
  plot_ab.append("path").attr("d", lineFn_ab(allColors))
      .attr("stroke", "rgba(0,0,0,0.75)").attr("stroke-width", 1).attr("fill", "none");
  plot_ab.selectAll("circle")
      .data(colors)
      .enter()
      .append("circle")
          .attr("r", 5)
          .attr("cx", d => scale_ab_x(d.a))
          .attr("cy", d => scale_ab_y(d.b))
          .attr("fill", d => d);

  plot_la.append("g").classed("axisGroup", true).attr("transform", "translate(0,"+height+")").call(xaxis_ab);
  plot_la.append("g").classed("axisGroup", true).attr("transform", "translate(0,0)").call(yaxis_l);
  plot_la.append("line")
      .attr("x1", width/2).attr("x2", width/2)
      .attr("y1", 0).attr("y2", height)
      .style("stroke-width", 1)
      .style("stroke", "#ddd");
  plot_la.append("rect")
      .attr("y", scale_l(0) - 7).attr("x", scale_ab_x(0) - 7)
      .attr("width", 14).attr("height", 14).attr("fill", "black")
      .attr("stroke", "black").attr("stroke-width", 1);
  plot_la.append("rect")
      .attr("y", scale_l(100) - 7).attr("x", scale_ab_x(0) - 7)
      .attr("width", 14).attr("height", 14).attr("fill", "white")
      .attr("stroke", "black").attr("stroke-width", 1);
  plot_la.append("path").attr("d", lineFn_la(allColors))
      .attr("stroke", "rgba(0,0,0,0.75)").attr("stroke-width", 1).attr("fill", "none");
  plot_la.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 0).text("x: a*");
  plot_la.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 12).text("y: l*");
  plot_la.selectAll("circle")
      .data(colors)
      .enter()
      .append("circle")
          .attr("r", 5)
          .attr("cx", d => scale_ab_x(d.a))
          .attr("cy", d => scale_l(d.l))
          .attr("fill", d => d);

  plot_lb.append("g").classed("axisGroup", true).attr("transform", "translate(0,"+height+")").call(xaxis_ab);
  plot_lb.append("g").classed("axisGroup", true).attr("transform", "translate(0,0)").call(yaxis_l);
  plot_lb.append("line")
      .attr("x1", width/2).attr("x2", width/2)
      .attr("y1", 0).attr("y2", height)
      .style("stroke-width", 1)
      .style("stroke", "#ddd");
  plot_lb.append("path").attr("d", lineFn_lb(allColors))
      .attr("stroke", "rgba(0,0,0,0.75)").attr("stroke-width", 1).attr("fill", "none");
  plot_lb.append("rect")
      .attr("y", scale_l(0) - 7).attr("x", scale_ab_x(0) - 7)
      .attr("width", 14).attr("height", 14).attr("fill", "black")
      .attr("stroke", "black").attr("stroke-width", 1);
  plot_lb.append("rect")
      .attr("y", scale_l(100) - 7).attr("x", scale_ab_x(0) - 7)
      .attr("width", 14).attr("height", 14).attr("fill", "white")
      .attr("stroke", "black").attr("stroke-width", 1);
  plot_lb.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 0).text("x: b*");
  plot_lb.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 12).text("y: l*");
  plot_lb.selectAll("circle")
      .data(colors)
      .enter()
      .append("circle")
          .attr("r", 5)
          .attr("cx", d => scale_ab_x(d.b))
          .attr("cy", d => scale_l(d.l))
          .attr("fill", d => d);

  plots.selectAll(".label")
      .style("font-size", "10").style("font-family", "sans-serif");

  plots.selectAll("circle").style("stroke", "black").style("stroke-width", 1);

  plots.selectAll(".axisGroup").selectAll(".tick")
      .each(function(d,i) {
        if(i % 2) d3.select(this).select("text").remove();
      });

  plots.attr("version", 1.1).attr("baseProfile", "full")
      .attr("width", fullWidth).attr("height", fullWidth)
      .attr("xmlns", "http://www.w3.org/2000/svg");

  makeTable(colors);
  makeTable(allColors);

  function makeTable(colorData) {
    var tbl = container.append("table").attr("height", 200).attr("width", 400),
        thd = tbl.append("thead")
        tbd = tbl.append("tbody"),
        rows = tbd.selectAll("tr").data(colorData).enter().append("tr");

    tbl.style("display", "inline-block");
    tbd.style("max-height", 200).style("overflow-y", "scroll").style("display", "block");

    thd.append("td").text("");
    thd.append("td").text("l*");
    thd.append("td").text("a*");
    thd.append("td").text("b*");
    thd.append("td").text("R");
    thd.append("td").text("G");
    thd.append("td").text("B");
    thd.append("td").text("rgb");

    function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      return Math.round(number * factor) / factor;
    }
    rows.each(function(d) {
      var r = d3.select(this);
      r.append("td").attr("width", 10).style("background-color", d);
      r.append("td").text(precisionRound(d.l, 2));
      r.append("td").text(precisionRound(d.a, 2));
      r.append("td").text(precisionRound(d.b, 2));
      var rgb = d3.rgb(d);
      r.append("td").text(Math.round(rgb.r));
      r.append("td").text(Math.round(rgb.g));
      r.append("td").text(Math.round(rgb.b));
      r.append("td").text(d + "");
    });
  }
}
