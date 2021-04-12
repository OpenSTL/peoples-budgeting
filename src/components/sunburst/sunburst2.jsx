import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from '../../data/sunburst_data.json'
import './sunburst.css'


const explanationStyle = {
    position: 'absolute',
    top: '260px',
    left: '305px',
    width: '140px',
    textAlign: 'center',
    color: '#666',
    zIndex: -1,
    visibility: 'hidden',
  }
  
  
  class SequenceSunBurst extends React.Component {

    componentDidMount() {
      // Dimensions of sunburst.
      var width = 750;
      var height = 600;
      var radius = Math.min(width, height) / 2;
  
      var x = d3.scaleLinear()
          .range([0, 2 * Math.PI]);
  
      var y = d3.scaleLinear()
          .range([0, radius]);
  
      // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
      var b = {
        w: 150, h: 30, s: 3, t: 10
      };
  
      // Mapping of step names to colors.
      /*var colors = {
        "home": "#5687d1",
        "product": "#7b615c",
        "search": "#de783b",
        "account": "#6ab975",
        "other": "#a173d1",
        "end": "#bbbbbb"
      };*/
      var colors = d3.scaleOrdinal().range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
      this.colors = colors;
  
      // Total size of all segments; we set this later, after loading the data.
      var totalSize = 0; 
  
      var vis = d3.select("#chart").append("svg:svg")
          .attr("width", width)
          .attr("height", height)
          .append("svg:g")
          .attr("id", "container")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
      var partition = d3.partition();
  
    //   var arc = d3.arc()
    //       .startAngle(function(d) { console.log(d); return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    //       .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    //       .innerRadius(function(d) { return radius * Math.sqrt(d.y0) / 1})
    //       .outerRadius(function(d) { return radius * Math.sqrt(d.y0 + d.y1) / 2.5})
    var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });
          
          
  
      // Use d3.text and d3.csv.parseRows so that we do not need to have a header
      // row, and can receive the csv as an array of arrays.
  /*    d3.text("visit-sequences.csv", function(text) {
        var csv = d3.csv.parseRows(text);
        var json = buildHierarchy(csv);
        createVisualization(json);
      });*/
      
      
        createVisualization(data);
  
      // Main function to draw and set up the visualization, once we have the data.
      function createVisualization(json) {
  
        // Basic setup of page elements.
        initializeBreadcrumbTrail();
  
        // Bounding circle underneath the sunburst, to make it easier to detect
        // when the mouse leaves the parent g.
        vis.append("svg:circle")
            .attr("r", radius)
            .style("opacity", 0);
  
        // For efficiency, filter nodes to keep only those large enough to see.
  
        var root = d3.hierarchy(json);
        root.sum(function(d) { return d.value; });
        var nodes = partition(root).descendants()
        // filtering filters out over half of nodes
  /*          .filter(function(d) {
            var dx = d.x1 - d.x0;
            return (dx > 0.005); // 0.005 radians = 0.29 degrees
            });*/
  
        // Determines max depth when entering data to paths
        var maxDepth = 0;
        var path = vis.data(nodes).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", function(d) { return d.depth ? null : "none"; }) 
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", function(d) { 
            if (d.depth > maxDepth) {
                maxDepth = d.depth;
            }
            return colors((d.children ? d : d.parent).data.name); 
            })
            .style("opacity", 1)
            .on("mouseover", mouseover);
  
        // Bounding inner circle based on depth of elements
        var innerG = vis.append("g");
  
        var innerBound = innerG.append("circle")
            .attr("r", radius / (maxDepth + 1))
            .attr("id", "innerBound")
            .style("opacity", 0);
  
        var innerText = innerG.append("text")
            .attr("id", "percentage")
            .attr("x", -20)
            .attr("y", 0)
            .text("");
  
        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mouseleave", mouseleave);
  
        // Get total size of the tree = value of root node from partition.
        totalSize = path.node().__data__.value;
        console.log(totalSize);
       };
  
      // Fade all but the current sequence, and show it in the breadcrumb trail.
      function mouseover(event, d) {
          console.log(d)
        var percentage = (100 * d.value / totalSize).toPrecision(3);
        var percentageString = percentage + "%";
        if (percentage < 0.1) {
          percentageString = "< 0.1%";
        }

        let dollar = d.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let dollarString = "$ " + dollar
  
        d3.select("#percentage")
            .text(dollarString);
  
        d3.select("#explanation")
            .style("visibility", "");
  
        var sequenceArray = getAncestors(d);
        updateBreadcrumbs(sequenceArray, dollarString);
  
        // Fade all the segments.
        d3.selectAll("path")
            .style("opacity", 0.3);
  
        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll("path")
          .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
          })
          .style("opacity", 1);
      }
  
      // Restore everything to full opacity when moving off the visualization.
      function mouseleave(d) {
  
        // Hide the breadcrumb trail
        d3.select("#trail")
            .style("visibility", "hidden");
  
        // Deactivate all segments during transition.
        d3.selectAll("path").on("mouseover", null);
  
        // Transition each segment to full opacity and then reactivate it.
        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .on("end", function() {
              d3.select(this).on("mouseover", mouseover);
              d3.select("#percentage").text("");
            });
  
        d3.select("#explanation")
            .style("visibility", "hidden");
      }
  
      // Given a node in a partition layout, return an array of all of its ancestor
      // nodes, highest first, but excluding the root.
      function getAncestors(node) {
        var path = [];
        var current = node;
        while (current.parent) {
          path.unshift(current);
          current = current.parent;
        }
        return path;
      }
  
      function initializeBreadcrumbTrail() {
        // Add the svg area.
        var trail = d3.select("#sequence").append("svg:svg")
            .attr("width", width)
            .attr("height", 50)
            .attr("id", "trail");
        // Add the label at the end, for the percentage.
        trail.append("svg:text")
          .attr("id", "endlabel")
          .style("fill", "#000");
      }
      
      // calculate size of breadcrumb box due to name size
        function calculateBreadcrumbWidth(d) {
            return (b.w + b.t + d.data.name.toString().length * 4.0);
        }

        // calculate breadcrumb offset
        function calculateBreadcrumbOffset(d) {
            var offset = 0;

            if (d.parent.name == null) {
                return 0;
            }
            while (d.parent.name != null) {
                d = d.parent;
                offset += (calculateBreadcrumbWidth(d) + b.g);
            }
            return (offset);
        }

        function calculateBreadcrumbPercentage(nodeArray) {
            var offset = 0;
            for (var i = 0; i < nodeArray.length; i++) {
                offset += calculateBreadcrumbWidth(nodeArray[i]);
            }
            offset += nodeArray.length * b.g;
            offset += 45;
            return (offset);
        }
      // Generate a string that describes the points of a breadcrumb polygon.
      function breadcrumbPoints(d, i) {
        
        var points = [];
        points.push("0,0");
        points.push(b.w + ",0");
        points.push(b.w + b.t + "," + (b.h / 2));
        points.push(b.w + "," + b.h);
        points.push("0," + b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
          points.push(b.t + "," + (b.h / 2));
        }
        return points.join(" ");
      }

      // Update the breadcrumb trail to show the current sequence and percentage.
      function updateBreadcrumbs(nodeArray, percentageString) {
        // Data join; key function combines name and depth (= position in sequence).
        var g = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, function(d) { 
              return d.data.name + d.depth; });
  
        // Add breadcrumb and label for entering nodes.
        var entering = g.enter().append("g");
  
        entering.append("svg:polygon")
            .attr("points", breadcrumbPoints)
            .style("fill", function(d) { return colors((d.children ? d : d.parent).data.name); });
  
        entering.append("svg:text")
            .attr("x", function (d) {
                return ((b.w + b.t) / 2);
            })
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.name; });
  
        // Set position for entering and updating nodes.
        g.attr("transform", function(d, i) {
            return "translate(" + (d.depth - 1) * (b.w + b.s) + ", 0)";
          });
  
        // Remove exiting nodes.
        g.exit().remove();
  
        // Now move and update the percentage at the end.
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
            .attr("y", b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);
  
        // Make the breadcrumb trail visible, if it's hidden.
        d3.select("#trail")
            .style("visibility", "");
  
      }
  
    }
  
    render() {
      return(
        <div>
          <div id="main">
            <div id="sequence"></div>
            <div id="chart">

            </div>
          </div>
          
        </div>
      )
    }
  }

  export default SequenceSunBurst