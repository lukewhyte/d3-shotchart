(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  // SCALES USED TO INVERT COURT Y COORDS AND MAP SHOOTING PERCENTAGES OF BINS TO A FILL COLOR 
  var yScale = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0]);

  function court() {
      // NBA court dimensions are 50ft sideline to sideline and 94feet baseline to baseline (47ft half court)
      // Forcing at least a 500x470 ratio for the court in order to paint shots appropriately        
      var width = 500,
          height = .94 * width;

      function court(selection){
          
          selection.each(function(data){
              // Responsive container for the shotchart
              d3.select(this).style("max-width", width/16 + "em");
              // Select the SVG if it exists
              if (!d3.select(this).selectAll("svg").empty()){
                  var svg = d3.select(this).selectAll("svg");
              }
              else {
                  var svg = d3.select(this).append("svg")
                      .attr("viewBox", "0, 0, " + 50 + ", " + 47 + "")
                      .classed("court", true);
              // Append the outer paint rectangle
                  svg.append("g")
                      .classed("court-paint", true)
                      .append("rect")
                      .attr("width", 16)
                      .attr("height", 19) 
                      .attr("x", 25)
                      .attr("transform", "translate(" + -8 + "," + 0 + ")")
                      .attr("y", yScale(19));
                  // Append inner paint lines
                  svg.append("g")
                      .classed("inner-court-paint", true)
                      .append("line")
                      .attr("x1", 19)
                      .attr("x2", 19)
                      .attr("y1", yScale(19))
                      .attr("y2", yScale(0));
                  svg.append("g")
                      .classed("inner-court-paint", true)
                      .append("line")        
                      .attr("x1", 31)
                      .attr("x2", 31)
                      .attr("y1", yScale(19))
                      .attr("y2", yScale(0));
                  // Append foul circle
                  // Add clipPaths w/ rectangles to make the 2 semi-circles with our desired styles
                  var dashedFoulCircle = svg.append("g").classed("foul-circle dashed", true);
                  dashedFoulCircle.append("defs").append("clipPath")
                      .attr("id", "cut-off-top")
                      .append("rect")
                      .attr("width", 12)
                      .attr("height", 6) 
                      .attr("x", 25)
                      .attr("y", yScale(19)) // 47-19 (top of rectangle is pinned to foul line, which is at 19 ft)
                      .attr("transform", "translate(" + -6 + "," + 0 + ")");
                  dashedFoulCircle.append("circle")
                      .attr("cx", 25)
                      .attr("cy", yScale(19)) // 47-19
                      .attr("r", 6)
                      .attr("stroke-dasharray", 1 + "," + 1)
                      .attr("clip-path", "url(#cut-off-top)");
                  var solidFoulCircle = svg.append("g").classed("foul-circle solid", true);
                  solidFoulCircle.append("defs").append("clipPath")
                      .attr("id", "cut-off-bottom")
                      .append("rect")
                      .attr("width", 12)
                      .attr("height", 6) 
                      .attr("x", 25)
                      .attr("y", yScale(19)) /*foul line is 19 feet, then transform by 6 feet (circle radius) to pin rectangle above foul line..clip paths only render the parts of the circle that are in the rectangle path */
                      .attr("transform", "translate(" + -6 + "," + -6 + ")");
                  solidFoulCircle.append("circle")
                      .attr("cx", 25)
                      .attr("cy", yScale(19))
                      .attr("r", 6)
                      .attr("clip-path", "url(#cut-off-bottom)");
                  // Add backboard and rim
                  svg.append("g").classed("backboard", true)
                      .append("line")        
                      .attr("x1", 22)
                      .attr("x2", 28)
                      .attr("y1", yScale(4)) // 47-4
                      .attr("y2", yScale(4)); // 47-4
                  svg.append("g").classed("rim", true)
                      .append("circle")
                      .attr("cx", 25)
                      .attr("cy", yScale(4.75)) // 47-4.75 need to set center point of circle to be 'r' above backboard
                      .attr("r", .75); //regulation rim is 18 inches
                  // Add restricted area -- a 4ft radius circle from the center of the rim
                  var restrictedArea = svg.append("g").classed("restricted-area", true);
                  restrictedArea.append("defs").append("clipPath")
                      .attr("id", "restricted-cut-off")
                      .append("rect")
                      .attr("width", 8) // width is 2r of the circle it's cutting off
                      .attr("height", 4) // height is 1r of the circle it's cutting off
                      .attr("x", 25) // center rectangle
                      .attr("y", yScale(4.75))
                      .attr("transform", "translate(" + -4 + "," + -4 + ")");
                  restrictedArea.append("circle")
                      .attr("cx", 25)
                      .attr("cy", yScale(4.75))
                      .attr("r", 4)
                      .attr("clip-path", "url(#restricted-cut-off)");
                  restrictedArea.append("line")
                      .attr("x1", 21)
                      .attr("x2", 21)
                      .attr("y1", yScale(5.25))
                      .attr("y2", yScale(4));
                  restrictedArea.append("line")
                      .attr("x1", 29)
                      .attr("x2", 29)
                      .attr("y1", yScale(5.25))
                      .attr("y2", yScale(4));
                  // Add 3 point arc
                  var threePointArea = svg.append("g").classed("three-point-area", true);
                  threePointArea.append("defs").append("clipPath")
                      .attr("id", "three-point-cut-off")
                      .append("rect")
                      .attr("width", 44)
                      .attr("height", 23.75)
                      .attr("x", 25)
                      .attr("y", yScale(4.75)) // put recentagle at centerpoint of circle then translate by the inverse of the circle radius to cut off top half
                      .attr("transform", "translate(" + -22 + "," + -23.75 + ")");                
                  threePointArea.append("circle")
                      .attr("cx", 25)
                      .attr("cy", yScale(4.75))
                      .attr("r", 23.75)
                      .attr("clip-path", "url(#three-point-cut-off)");                   
                  threePointArea.append("line")
                      .attr("x1", 3)
                      .attr("x2", 3)
                      .attr("y1", yScale(14))
                      .attr("y2", yScale(0));
                  threePointArea.append("line")
                      .attr("x1", 47)
                      .attr("x2", 47)
                      .attr("y1", yScale(14))
                      .attr("y2", yScale(0)); 
                  // Add key lines
                  var keyLines = svg.append("g").classed("key-lines", true);
                  keyLines.append("line")
                      .attr("x1", 16)
                      .attr("x2", 17)
                      .attr("y1", yScale(7))
                      .attr("y2", yScale(7));
                  keyLines.append("line")
                      .attr("x1", 16)
                      .attr("x2", 17)
                      .attr("y1", yScale(8))
                      .attr("y2", yScale(8));
                  keyLines.append("line")
                      .attr("x1", 16)
                      .attr("x2", 17)
                      .attr("y1", yScale(11))
                      .attr("y2", yScale(11));
                  keyLines.append("line")
                      .attr("x1", 16)
                      .attr("x2", 17)
                      .attr("y1", yScale(14))
                      .attr("y2", yScale(14));
                  keyLines.append("line")
                      .attr("x1", 33)
                      .attr("x2", 34)
                      .attr("y1", yScale(7))
                      .attr("y2", yScale(7));
                  keyLines.append("line")
                      .attr("x1", 33)
                      .attr("x2", 34)
                      .attr("y1", yScale(8))
                      .attr("y2", yScale(8));
                  keyLines.append("line")
                      .attr("x1", 33)
                      .attr("x2", 34)
                      .attr("y1", yScale(11))
                      .attr("y2", yScale(11));
                  keyLines.append("line")
                      .attr("x1", 33)
                      .attr("x2", 34)
                      .attr("y1", yScale(14))
                      .attr("y2", yScale(14));
                  // Append baseline
                  svg.append("g")
                      .classed("court-baseline", true)
                      .append("line")
                      .attr("x1", 0)
                      .attr("x2", 50)
                      .attr("y1", yScale(0))
                      .attr("y2", yScale(0)); 

                  svg.append("g").classed("shots", true);
                  
              };            
          });
      };

    court.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      height = .94 * _;
      return court;
    };

      return court;
  };

  var activeDisplay = "scatter";
  var activeTheme = "day";
  // SCALES USED TO INVERT COURT Y COORDS AND MAP SHOOTING PERCENTAGES OF BINS TO A FILL COLOR 
  var yScale$1 = d3.scaleLinear().domain([0, 47]).rangeRound([47, 0]);
  var percentFormatter = d3.format(".2%");

  function shots() {
      
      var hexRadiusValues = [.8, 1, 1.2],
          hexMinShotThreshold = 1,
          heatScale = d3.scaleQuantize().domain([0, 1]).range(['#5458A2', '#6689BB', '#FADC97', '#F08460', '#B02B48']),
          hexRadiusScale = d3.scaleQuantize().domain([0, 2]).range(hexRadiusValues),
          toolTips = false,
          hexbin = d3.hexbin()
                  .radius(1.2)
                  .x(function(d) { return d.key[0]; }) // accessing the x, y coords from the nested json key
                  .y(function(d) { return yScale$1(d.key[1]); });        
      
      var _nestShotsByLocation = function(data) {
          var nestedData = d3.nest()
              .key(function(d) {
                  return [d.x, d.y];
              })
              .rollup(function(v) { return {
                  "made": d3.sum(v, function(d) { return d.shot_made_flag }),
                  "attempts": v.length,
                  "shootingPercentage":  d3.sum(v, function(d) { return d.shot_made_flag })/v.length
              }})
              .entries(data);
          // change to use a string split and force cast to int
          nestedData.forEach(function(a){
              a.key = JSON.parse("[" + a.key + "]");
          });

          return nestedData;
      };

      var _getHexBinShootingStats = function(data, index) {
          var attempts = d3.sum(data, function(d) { return d.value.attempts; })
          var makes = d3.sum(data, function(d) { return d.value.made; })
          var shootingPercentage = makes/attempts;
          data.shootingPercentage = shootingPercentage;
          data.attempts = attempts;
          data.makes = makes;
          return data;
      };
      
      function makeMadeShots (shot, tool_tip, d, i) {
          d3.select(shot).selectAll("." + d.playerID + i)
                .data([d])
              .enter()
              .append("circle")
              .classed("shot", true)
              .classed("make", true)
              .classed("isSpur", function (d) { return !!d.isSpur })
              .classed(d.playerID + i, true)
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return yScale$1(d.y); })
              .attr("r", .5)
              .on('mouseover', function(d) { if (toolTips) {tool_tip.show(d);} })
              .on('mouseout', function(d) { if (toolTips) {tool_tip.hide(d);} });
      }

      function makeMissedShots (shot, tool_tip, d, i) {
          d3.select(shot).selectAll("." + d.playerID + i)
                .data([d])
              .enter()
              .append("path")
              .classed("shot", true)
              .classed("miss", true)
              .classed("isSpur", function (d) { return !!d.isSpur })
              .classed(d.playerID + i, true)
              .attr("transform", function(d) { return "translate(" + d.x + "," + yScale$1(d.y) + ") rotate(-45)"; })
              .attr("d", d3.symbol().type(d3.symbolCross).size(.5))
              .on('mouseover', function(d) { if (toolTips) {tool_tip.show(d);} })
              .on('mouseout', function(d) { if (toolTips) {tool_tip.hide(d);} });
      }

      function shots(selection){

          selection.each(function(data){

              var shotsGroup = d3.select(this).select("svg").select(".shots"),
                  legends = d3.select(this).select("#legends"),
                  nestedData = _nestShotsByLocation(data),
                  hexBinCoords = hexbin(nestedData).map(_getHexBinShootingStats);

              if (activeDisplay === "scatter"){
                  if (legends.empty() === false){
                      legends.remove();
                  }
                  
                  var shots = shotsGroup.selectAll(".shot")
                                      .data(data, function(d){ return [d.x, d.y]; });
                  shots.exit()
                      .transition().duration(1000)
                      .attr("r", 0)
                      .attr("d", hexbin.hexagon(0))
                      .remove();

                  if (toolTips) {
                      var tool_tip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([-8, 0])
                        .html(function(d) { 
                              return d.shot_distance + "' " + d.action_type; 
                          });
                      
                      shotsGroup.call(tool_tip);
                  }

                  shots.enter().each(function (d, i) {
                      if (d.shot_made_flag) {
                          makeMadeShots(this, tool_tip, d, i);
                      } else {
                          makeMissedShots(this, tool_tip, d, i);
                      }
                  });
                  
              }
              else if (activeDisplay === "hexbin"){

                  var shots = shotsGroup.selectAll(".shot")
                                      .data(hexBinCoords, function(d){ return [d.x, d.y]; });

                  shots.exit()
                      .transition().duration(1000)
                      .attr("r", 0)
                      .attr("d", hexbin.hexagon(0))                
                      .remove();
                  
                  if (toolTips) {
                      var tool_tip = d3.tip()
                        .attr("class", "d3-tip")
                        .offset([-8, 0])
                        .html(function(d) { 
                              return d.makes + " / " + d.attempts + " (" + percentFormatter(d.shootingPercentage) + ")"; 
                          });
                      
                      shotsGroup.call(tool_tip);
                  }

                  shots.enter()                
                      .append("path")
                      .classed("shot", true)
                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                      .attr("d", hexbin.hexagon(0))
                      .on('mouseover', function(d) { if (toolTips) {tool_tip.show(d);} })
                      .on('mouseout', function(d) { if (toolTips) {tool_tip.hide(d);} })
                      .transition().duration(1000)
                      .attr("d", function(d) { 
                                  if (d.length >= hexMinShotThreshold) {
                                      if (d.length <= 3){
                                          return hexbin.hexagon(hexRadiusScale(0));
                                      }
                                      else if (3 < d.length && d.length <= 8){
                                          return hexbin.hexagon(hexRadiusScale(1));
                                      }
                                      else {
                                          return hexbin.hexagon(hexRadiusScale(2));
                                      }
                                  } 
                              })
                      .style("fill", function(d) { return heatScale(d.shootingPercentage); });
                  
                  // CHANGE TO USE SELECTION.EMPTY()
                  if (legends.empty() === true){
                      var legendSVG = d3.select(this).append('svg').attr("viewBox", "0, 0, " + 50 + ", " + 10 + "").attr('id', 'legends'),
                          efficiencyLegend = legendSVG.append('g').classed('legend', true),
                          frequencyLegend = legendSVG.append('g').classed('legend', true)
                                                              .classed('frequency', true),
                          frequencyLegendXStart = 7;

                      efficiencyLegend.append("text")
                                      .classed('legend-text', true)
                                      .attr("x", 40)             
                                      .attr("y", 5)
                                      .attr("text-anchor", "middle") 
                                      .text("Efficiency");
                      efficiencyLegend.append("text")
                                      .classed("legend-text", true)
                                      .attr("x", 34.25)             
                                      .attr("y", 2.5)
                                      .attr("text-anchor", "end") 
                                      .text("cold");
                      efficiencyLegend.append("text")
                                      .classed("legend-text", true)
                                      .attr("x", 45.75)             
                                      .attr("y", 2.5)
                                      .attr("text-anchor", "start") 
                                      .text("hot");
                      efficiencyLegend.selectAll('path').data(heatScale.range())
                                      .enter()
                                      .append('path')
                                      .attr("transform", function (d, i) {
                                        return "translate(" + 
                                          (35 + ((1 + i*2) * 1)) + ", " + 2 + ")";
                                      })
                                      .attr('d', hexbin.hexagon(0))
                                      .transition().duration(1000)
                                      .attr('d', hexbin.hexagon(1))
                                      .style('fill', function (d) { return d; });
                      efficiencyLegend.selectAll("text").style("fill", function(){ 
                                          if (activeTheme === "night"){ return "white"; }
                                          else if (activeTheme === "day"){ return "black"; };
                                      });
                      
                      frequencyLegend.append("text")
                                      .classed('legend-text', true)
                                      .attr("x", 10.25)             
                                      .attr("y", 5)
                                      .attr("text-anchor", "middle")  
                                      .text("Frequency");
                      frequencyLegend.append("text")
                                      .classed("legend-text", true)
                                      .attr("x", 6.25)             
                                      .attr("y", 2.5)
                                      .attr("text-anchor", "end")  
                                      .text("low");
                      frequencyLegend.selectAll('path').data(hexRadiusValues)
                                      .enter()
                                      .append('path')
                                      .attr("transform", function (d, i) {
                                          frequencyLegendXStart += d * 2;
                                          return "translate(" + (frequencyLegendXStart - d) + ", " + 2 + ")";
                                      })
                                      .attr('d', hexbin.hexagon(0))
                                      .transition().duration(1000)
                                      .attr('d', function (d) { return hexbin.hexagon(d); })
                      frequencyLegend.append("text")
                                      .classed("legend-text", true)
                                      .attr("x", 13.75)             
                                      .attr("y", 2.5)
                                      .attr("text-anchor", "start")  
                                      .text("high");
                      
                      frequencyLegend.selectAll("text").style("fill", function(){ 
                                          if (activeTheme === "night"){ return "white"; }
                                          else if (activeTheme === "day"){ return "black"; };
                                      })
                      frequencyLegend.selectAll("path").style("fill", function(){ 
                                          if (activeTheme === "night"){ return "none"; }
                                          else if (activeTheme === "day"){ return "grey"; };
                                      });
                  };                                                      
              };
          });
      };
    
    shots.displayType = function(_) {
      if (!arguments.length) return activeDisplay;
      activeDisplay = _;
      return shots;
    };
    
    shots.shotRenderThreshold = function(_) {
      if (!arguments.length) return hexMinShotThreshold;
      hexMinShotThreshold = _;
      return shots;
    }; 
    
    shots.displayToolTips = function(_) {
      if (!arguments.length) return toolTips;
      toolTips = _;
      return shots;
    };

    shots.theme = function(_) {
      if (!arguments.length) return activeTheme;
      activeTheme = _;
      return shots;
    };


      return shots;
  };

  exports.court = court;
  exports.shots = shots;

  Object.defineProperty(exports, '__esModule', { value: true });

}));