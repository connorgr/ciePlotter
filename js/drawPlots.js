function createColorData(colorScale, xAttr, yAttr, numPoints) {
  var colors = Array(numPoints).fill(0)
          .map((d,i) => d3.lab(colorScale(i/(numPoints-1))));

  return colors.map((c,i) => ({
    color: c,
    x: c[xAttr],
    y: c[yAttr]
  }));
}


function drawPlot(container, colorScale, bgScale, xAttr, yAttr, numPoints) {
  var svg = container.append("svg").classed("plot", true);;

  var colorScaleData = createColorData(colorScale, xAttr, yAttr, numPoints),
      bgScaleData = createColorData(bgScale, xAttr, yAttr, numPoints);

  var width = 200,
      height = width,
      margin = { top: 25, right: 25, bottom: 25, left: 25 };

  svg.style("width", width + "px").style("height", height + "px");

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  svg = svg.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");

  var scaleX = d3.scaleLinear().domain([-120, 120]).range([0, height]),
      scaleY = d3.scaleLinear().range([height, 0])
          .domain(yAttr === "l" ? [0, 100] : [-120, 120]);

  var xaxis = d3.axisBottom(scaleX),
      yaxis = d3.axisLeft(scaleY);

  var xAxisY = yAttr === "l" ? scaleY(0) : width/2;
  var xAxisObj = svg.append("g").classed("axisGroup", true)
      .attr("transform", "translate(0,"+xAxisY+")").call(xaxis);
  var yAxisObj = svg.append("g").classed("axisGroup", true)
      .attr("transform", "translate("+(width/2)+",0)").call(yaxis);
  svg.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 0).text("x: "+xAttr+"*");
  svg.append("text")
      .classed("label", true)
      .attr("x", 5).attr("y", 12).text("y: "+yAttr+"*");

  svg.append('g').selectAll("rect")
      .data(bgScaleData)
      .enter()
      .append("rect")
          .attr("height", 10).attr("width", 10)
          .attr("x", d => scaleX(d.x) - 5)
          .attr("y", d => scaleY(d.y) - 5)
          .attr("fill", d => d.color)
          .attr("stroke", "black")
          .attr("stroke-width", 1);

          var lineFn = d3.line().x(d => scaleX(d[xAttr])).y(d => scaleY(d[yAttr]));
          svg.append("path").attr("d", lineFn(colorScale.range()))
              .attr("stroke", "rgba(0,0,0,0.75)").attr("stroke-width", 1).attr("fill", "none");

  svg.selectAll("circle")
      .data(colorScaleData)
      .enter()
      .append("circle")
          .attr("r", 5)
          .attr("cx", d => scaleX(d.x))
          .attr("cy", d => scaleY(d.y))
          .attr("fill", d => d.color)
          .attr("stroke", "black")
          .attr("stroke-width", 1);

  svg.selectAll(".label")
      .style("font-size", "10").style("font-family", "sans-serif");
  svg.selectAll(".axisGroup").selectAll(".tick")
      .each(function(d,i) {
        if(i % 2) d3.select(this).select("text").remove();
      });

  yAxisObj.selectAll("text").each(function(d) {
    if(d3.select(this).text() === "0") d3.select(this).remove();
  });

  if(yAttr !== "l") {
    xAxisObj.selectAll("text").each(function(d) {
      if(d3.select(this).text() === "0") d3.select(this).remove();
    });
  }

  svg.attr("version", 1.1).attr("baseProfile", "full")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("xmlns", "http://www.w3.org/2000/svg");
}


function makeTable(container, colorScale, numPoints) {
  var colorData = createColorData(colorScale, '', '', numPoints).map(d => d.color);
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


function drawPlots(allColors, numPoints, bgRange) {
  bgRange = bgRange || [d3.lab('black'), d3.lab('white')];
  allColors = allColors.map(d => d3.lab(d));

  var domain = Array(allColors.length).fill(allColors.length - 1).map((d,i) => i / d),
      colorScale = d3.scaleLinear(d3.interpolateLab).domain(domain).range(allColors),
      bgScale = d3.scaleLinear(d3.interpolateLab).domain([0,1]).range(bgRange);

  var container = d3.select("body").append("div").style("margin-bottom", "2em");
  drawPlot(container, colorScale, bgScale, 'a', 'b', numPoints);
  drawPlot(container, colorScale, bgScale, 'a', 'l', numPoints);
  drawPlot(container, colorScale, bgScale, 'b', 'l', numPoints);
  makeTable(container, colorScale, numPoints);
  makeTable(container, colorScale, allColors.length);
}
