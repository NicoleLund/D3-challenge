// Define SVG Area with help from
// https://www.d3-graph-gallery.com/graph/custom_responsive.html
// ==============================
var svgWidth = parseInt(d3.select("#scatter").style('width'),10);
console.log("svgWidth: " + svgWidth);
var svgHeight = 0.75*parseInt(d3.select("#scatter").style('width'),10);

var margin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
};

// Define Chart Area
// ==============================
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper and group
// ==============================
var svg = d3.select("#scatter")
  .classed("chart", true)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data with headers:
// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,
// healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh
// ==============================
d3.csv("data/data.csv").then(function(acsData) {
    // console.log(acsData);

    // Cast data as numbers 
    // ==============================
    acsData.forEach(function(data) {
      data.id = +data.id;

      // x Axis Data
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;

      // y Axis Data (Average Values)
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;

      // y Axis Data (Low Values)
      data.healthcareLow = +data.healthcareLow;
      data.obesityLow = +data.obesityLow;
      data.smokesLow = +data.smokesLow;

      // y Axis Data (High Values)
      data.healthcareHigh = +data.healthcareHigh;
      data.obesityHigh = +data.obesityHigh;
      data.smokesHigh = +data.smokesHigh;

      // Margin of Error Data
      data.povertyMoe = +data.povertyMoe;
      data.ageMoe = +data.ageMoe;
      data.incomeMoe = +data.incomeMoe;
    });

    // Create scale functions
    // ==============================
    var xPovertyScale = d3.scaleLinear()
        .domain(d3.extent(acsData, d => d.poverty))
        .range([0, width]);
        
    var yHealthcareScale = d3.scaleLinear()
        .domain(d3.extent(acsData, d => d.healthcare))
        .range([height, 0]);

    // Create axis functions
    // ==============================
    var xPovertyHealthcareAxis = d3.axisBottom(xPovertyScale);
    var yHealthcareAxis = d3.axisLeft(yHealthcareScale);

    // Append Axes to the chart
    // ==============================
      chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xPovertyHealthcareAxis);

    chartGroup.append("g")
      .call(yHealthcareAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(acsData)
      .enter()
      .append("circle")
      .attr("class","stateCircle")
      .attr("cx", d => xPovertyScale(d.poverty))
      .attr("cy", d => yHealthcareScale(d.healthcare))
      .attr("r", "15");

    // Create Circle Labels
    // ==============================
    console.log(acsData);
    var labelsGroup = chartGroup.selectAll("text")
    .data(acsData)
    // .enter().append("text")     // This only displays the text and line 116 console.log for acsData objects >= 22 (Michigan). 
    .join("text")               // This only displays the text for acsData objects >= 22 (Michigan). Line 116 console.log shows all objects.
    .attr("class","stateText")
    .attr("x", d => xPovertyScale(d.poverty))
    .attr("y", d => yHealthcareScale(d.healthcare))
    .attr("dy", 5)
    .text(function(d) {
        console.log(d.abbr);
        return d.abbr;
    });

    // Add Tool Tip Feature
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([20, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    chartGroup.call(toolTip);

    circlesGroup
      .on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

    labelsGroup
      .on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

    // Add axes labels
    // ==============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 60})`)
      .attr("class", "aText")
      .text("In Poverty (%)");

  }).catch(function(error) {
    console.log(error);
  });
