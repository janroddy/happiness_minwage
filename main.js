console.log("YeS")

//Width and height
var margin = {top: 30, right: 40, bottom: 30, left: 50},
	w = 850 - margin.left - margin.right,
	h = 550 - margin.top - margin.bottom;

//Define map projection
var projection = d3.geoAlbersUsa()
	.translate([w/2-50, h/2 + 10])
	.scale([800]);

//Define path generator
var path = d3.geoPath()
	.projection(projection);

//define threshold scale				 		
var color = d3.scaleThreshold()
	.domain([40, 45, 50, 55, 60])
	.range(d3.schemePurples[6])

//Create SVG elementx
var svg = d3.select("#container1")
	.append("svg")
	.attr("width", w + margin.left + margin.right)
	.attr("height", h + margin.top + margin.bottom)
	.attr("width", w)
	.attr("height", h);

svg.append("text")
	.attr("x", (w/2))             
	.attr("y", (margin.top - 5))
	.attr("text-anchor", "middle")  
	.style("font-size", "24px") 
	.style("font-family", "Palatino") 
	.style("font-weight", "bold")  
	.text("State Happiness");	

//legend
var legend = d3.legendColor()
	//	.labelFormat(d3.format(".0f"))
	.shapeWidth(15)
	//.cells(5)
	.labels(["< 40", "40-45", " 45-50", "50-55", "55-60", "> 60"])
	.title("Happiness Score")
	// .titleWidth(100)
	.orient("vertical")
	.scale(color)


svg.append("g")
  .attr("class", "legend")
  .call(legend)
  .attr("transform", "translate(650, 130)");  


//tooltip for area1 
var tooltip1 = d3.select("#container1").append("div") 
    .attr("class", "tooltip1")       
    .style("opacity", 0);

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  tooltip1
    .style("opacity", 1)
}

var mousemove = function(d) {
  tooltip1
    .style("left", (d3.mouse(this)[0]) + 50 + "px")
    .style("top", (d3.mouse(this)[1]) + 50+ "px")
    .html( 
    	("<b>" + d.properties.name + "</b>" + "-" + "<br/>" 
      +"Total Happiness Score: " + d.properties.totalScore  + "<br/>"
      +"Happiness Ranking: " + d.properties.overall + "<br/>"
      +"Minimum Wage: $" + d.properties.minimumWage + "<br/>"
      +"Economic Inequality: " + d.properties.gini + "<br/>"
  		)
    )
}	

var mouseleave = function(d) {
  tooltip1
    .style("opacity", 0)
}

//Load in state data
d3.csv("happiness.csv", function(data) {

//Set input domain for color scale
color.domain([
40, 45, 50, 55, 60
	//d3.min(data, function(d) { return d.value; }), 
	//d3.max(data, function(d) { return d.value; })
]);

	//Load in GeoJSON data
	d3.json("us-states.json", function(json) {

		//Merge the state leg. data and GeoJSON data
		//Loop through once for each leg. data value
		for (var i = 0; i < data.length; i++) {
	
			//Grab state name
			var dataState = data[i].State;

			//Grab data value, and convert from string to float
			var dataValue = parseFloat(data[i].totalScore);
			var minimumWage = parseFloat(data[i].minimumWage);
      var gini = parseFloat(data[i].gini);
			//console.log("state: " +data[i].State);
  		 	//console.log("value: " + data[i].totalScore);
      var ranking = parseFloat(data[i].overall);
	
			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < json.features.length; j++) {
			
				var jsonState = json.features[j].properties.name;
	
				if (dataState == jsonState) {		
					//Copy the data value into the JSON
					json.features[j].properties.totalScore = dataValue;
					//console.log("dv: " + dataValue);
					json.features[j].properties.overall = ranking;
			
					json.features[j].properties.minimumWage = minimumWage;

          json.features[j].properties.gini = gini;
					
					//Stop looking through the JSON
					break;
					
				}
			}		
		}

//Bind data and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("fill", "#66ccff")
	.on("mouseover", mouseover)
	.on("mousemove", mousemove)
	.on("mouseleave", mouseleave)
	.attr("d", path)
	.attr('class', 'states')
	.attr("fill", function(d) {
   		//Get data value
   		var value = d.properties.totalScore;

   		
   		if (value) {
   			//If value exists…
	   		return color(value);

   		} else {
   			//If value is 0
	   		return "#eff3ff";
   		}

   	})

  });

});




//reset width and height for second chart
margin = {top: 40, right: 40, bottom: 20, left: 40},
w = 500 - margin.left - margin.right,
h = 350 - margin.top - margin.bottom;




//Create SVG elementx
var svg2 = d3.select("#container3")
	.append("svg")
	.attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("happiness.csv",
  
  function(data) {
    /*
        for (var i = 0; i < data.length; i++) {
          console.log("mim wage: " +data[i].minimumWage);
          console.log("happiness: " + data[i].totalScore);
        } 
        */
    //title text 
svg2.append("text")
        .attr("x", (w/2))             
        .attr("y", (margin.top -50 ))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("font-family", "optima") 
        .style("font-family", "Palatino") 
        .style("font-weight", "bold"); 
      //  .text("Correlation of Minimum Wage and Happiness");

   // Add X axis
var x = d3.scaleLinear()
  .domain([5, 13])
  .range([0, w]);
  //  .range([ 0, (2 * w / 3)  ]);
  svg2.append("g")
  .attr("transform", "translate(0," + h + ")")
  // .attr("transform", "translate(0," + (295 )   + ")")
  .call(d3.axisBottom(x)
  .tickFormat(d => d));  
  // .tickFormat(d3.format("d"))); 
// Add X axis label:
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("x", w/2 + margin.left + 160)
      .attr("y", h + margin.top - 50)
      .text("Minimum Wage ($)");
 
var y = d3.scaleLinear()
      .domain( [32, 70])
      .range([h, 0]);
      svg2.append("g")
   //   .attr("transform", "translate(0," + w  + ")")
      .call(d3.axisLeft(y)
      .tickFormat(d => d));  
// Y axis label:
  svg2.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 60 )
      .attr("x", -margin.top - h/2 + 220)
      .text("Happiness Score")

    var tooltip2 = d3.select("#container3").append("div") 
      .attr("class", "tooltip2")
      .style("opacity", 0);


      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover2 = function(d) {
        tooltip2
          .style("opacity", 1)
      }

      var mousemove2 = function(d) {
        tooltip2
        .style("left", (d3.mouse(this)[0]) + 400 + "px")
        .style("top", (d3.mouse(this)[1]) + 900 + "px")
        .html("State: " + d.State+ "<br/>" 
          + "Minimum Wage: $"+ d.minimumWage + "<br/>" 
          + "Happiness Score: " + d.totalScore 
            )
      }

      var mouseleave2 = function(d) {
        tooltip2
          .style("opacity", 0)

      }     
    // Add the points
    svg2
      .append("g")     
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.minimumWage) } )
        .attr("cy", function(d) { return y(d.totalScore) } )
        .attr("r", 4)
        .attr("fill", "#6baed6")
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2) 


    let linearRegression = d3.regressionLinear()
      .x((d) => parseFloat(d.minimumWage)) 
      .y((d) => parseFloat(d.totalScore))
      .domain([5, 20]);

    let res = linearRegression(data)
    //  console.log(res);

  let line = d3.line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  svg2.append("path")
    .datum(res)
    .attr("d", line)
    .style("stroke", "black")
    .style("opacity", ".5")
    .style("stroke-width", "2px");

    })  

