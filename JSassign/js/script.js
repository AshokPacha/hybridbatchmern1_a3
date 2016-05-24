
var width = 1100,
      height = 700,
      padding = 250;
  //Create the SVG Viewport selection
  var svgContainer = d3.select("body").append("svg")
               .attr("width", width)
               .attr("height", height);

var x;
var y;
var xAxis;
var svg;
var yAxis;
var color;
var margin = {top: 20, right: 140, bottom: 150, left: 40},
    width =  1024 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// setting layout for chart -- hieght -width margin etc..
function setLayout() {
	
	var d3_category10 = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];

   x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

   y = d3.scale.linear()
      .range([height, 0]);
   color = d3.scale.ordinal()
          .range(d3_category10);

   xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
    // .ticks(10, "%");

     svg = d3.select("#charts").append("svg")
      .attr("width", width + margin.left + margin.right+20)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" +80 + "," + margin.top + ")");
}
  
  
  function lifeExpectencyStakedBar() {

    document.getElementById("charts").innerHTML = "";
     setLayout();

    // Define 'div' for tooltips
  var div = d3.select("body")
  .append("div")  // declare the tooltip div
  .attr("class", "tooltip")              // apply the 'tooltip' class
  .style("opacity", 0);                  // set the opacity to nil
	  
d3.json("lifeExpectancy1.json", function(error, data) {
  if (error) throw error;
  
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
  
  data.forEach(function(d) {
    var y0 = 0;
      d.gender = color.domain().map(function(gname) { return {gname: gname, y0: y0, y1: y0 += +d[gname]}; });
      d.total = d.gender[d.gender.length - 1].y1;
	  console.log(d.gender);
	  console.log(d.total);
    });

    data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })+40]);
	
	
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -80).attr("x",-150)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Life Expectancy");
	  
  var year = svg.selectAll(".Year")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; });
	  
  year.selectAll("rect")
      .data(function(d) { return d.gender; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.gname); });
	  
 var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);
      legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});
  }