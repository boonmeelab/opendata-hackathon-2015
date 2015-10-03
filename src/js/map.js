  <script type="text/javascript">
    var w = 960;
    var h = 500;
    var proj = d3.geo.mercator();
    var path = d3.geo.path().projection(proj);
    var t = proj.translate(); // the projection's default translation
    var s = proj.scale() // the projection's default scale

    var map = d3.select("#vis").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .call(d3.behavior.zoom().on("zoom", redraw));

    var axes = map.append("svg:g").attr("id", "axes");

    var xAxis = axes.append("svg:line")
        .attr("x1", t[0])
        .attr("y1", 0)
        .attr("x2", t[0])
        .attr("y2", h);

    var yAxis = axes.append("svg:line")
        .attr("x1", 0)
        .attr("y1", t[1])
        .attr("x2", w)
        .attr("y2", t[1]);

    var uk = map.append("svg:g").attr("id", "uk");

    d3.json("uk.json", function (json) {
      uk.selectAll("path")
          .data(json.features)
        .enter().append("svg:path")
          .attr("d", path);
    });

    function redraw() {
      // d3.event.translate (an array) stores the current translation from the parent SVG element
      // t (an array) stores the projection's default translation
      // we add the x and y vales in each array to determine the projection's new translation
      var tx = t[0] * d3.event.scale + d3.event.translate[0];
      var ty = t[1] * d3.event.scale + d3.event.translate[1];
      proj.translate([tx, ty]);

      // now we determine the projection's new scale, but there's a problem:
      // the map doesn't 'zoom onto the mouse point'
      proj.scale(s * d3.event.scale);

      // redraw the map
      uk.selectAll("path").attr("d", path);

      // redraw the x axis
      xAxis.attr("x1", tx).attr("x2", tx);

      // redraw the y axis
      yAxis.attr("y1", ty).attr("y2", ty);
    }
  </script>
