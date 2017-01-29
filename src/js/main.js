
// filter data
// [filter condition]
// year: { start: START_YEAR, end: END_YEAR} -> { start: 2008, end: 2009}
// sex: ARRAY -> 0 (unknown), 1 (female), 2 (male)
// age: ARRAY -> 0 (unknown), 1 (<=18), 2 (19-35), 3 (36-55), 4 (>=56)
// alcohol: ARRAY -> 0 (unknown), 1 (no), 2 (yes)
// safety: ARRAY -> 0 (unknown), 1 (no), 2 (yes)
// vehicle: ARRAY -> 0 (unknown), 1 (no), 2 (motocycle), 3 (bicycle), 4 (car), 5 (pickup & truck)
// hitBy: ARRAY -> 0 (unknown), 1 (no), 2 (motocycle), 3 (bicycle), 4 (car), 5 (pickup & truck)
// time: {start: [DAY, HOUR], end: [DAY, HOUR]}
// [Ex]
// {year: [2008, 2015], sex: [1], alcohol: [1, 2], safety: [1], vehicle: [1, 2, 3], hitBy: [1]}
function genericMapper(value, mapper) {
  if (value in mapper) { return mapper[value]; }
  return -1;
}
function findMatchWithArrayFilter(arrayFilter, entry) {
  var bool = false;
  for (var i = 0, len = arrayFilter.length; i < len; ++i) {
    if (arrayFilter[i] === entry) {
      bool = true;
      break;
    }
  }
  return bool;
}
function timeWrapper(day, hour) {
  // Change to int.
  day = parseInt(day); hour = parseInt(hour);
  // Transform both to one time variable.
  day = (day > 20)? (day-28) : (day + 3);
  hour = (hour === 24)? 0 : hour;
  var time = day * 24 + hour;
  return time;
}

function ageWrapper(ageRangeArrayFilter, age) {
  var ageRange = -1;
  if (age <= 18) ageRange = 1;
  else if (age >= 19 && age <= 35) ageRange = 2;
  else if (age >= 36 && age <= 55) ageRange = 3;
  else if (age >= 56) ageRange = 4;

  return ageRangeArrayFilter.indexOf(ageRange) >= 0;
}

function filterUtil(data, filter) {
  // Check if all filters are specified. If not, error and return empty array.
  if (!(filter.year && filter.year.start && filter.year.end &&
        filter.time && filter.time.start && filter.time.end &&
        filter.sex &&
        filter.alcohol &&
        filter.safety &&
        filter.vehicle &&
        filter.hitBy)) {
    console.error('Please specify all filters. For now, we will just return empty result for you.');
    return [];
  }
  var result = data.filter(function(d) {
    var sex_map = {'unknown' : 0, 'หญิง' : 1, 'ชาย' : 2};
    var alcohol_map = {'unknown' : 0, 'ไม่ดื่ม' : 1, 'ดื่ม' : 2};
    var safety_map = {'unknown' : 0, 'ไม่ใส่' : 1, 'ใส่หมวก' : 2, 'เข็มขัด' : 2};
    var vehicle_map = {
      'unknown' : 0, 'อื่นๆ' : 0,
      'ไม่มี/ล้มเอง' : 1,
      'จักรยานยนต์' : 2,
      'รถจักรยาน' : 3,
      'รถเก๋ง/แท็กซี่' : 4, 'สามล้อเครื่อง' : 4, 'รถตู้' : 4, 'รถโดยสาร 4 ล้อ' : 4,
      'รถบรรทุก' : 5, 'รถโดยสารใหญ่' : 5, 'ปิคอัพ' : 5,
    };
    var time = timeWrapper(d['วันที่เกิดเหตุ'], d['เวลาเกิดเหตุ']);
    var time_filter_start = timeWrapper(filter.time.start[0], filter.time.start[1]);
    var time_filter_end = timeWrapper(filter.time.end[0], filter.time.end[1]);
    var time_filter = (time >= time_filter_start) && (time <= time_filter_end);
    var year_filter = (d.year >= filter.year.start) && (d.year <= filter.year.end);
    var sex_filter = findMatchWithArrayFilter(filter.sex, genericMapper(d['เพศ'], sex_map));
    var age_filter = ageWrapper(filter.age, +d['อายุ']);
    var alcohol_filter = findMatchWithArrayFilter(filter.alcohol, genericMapper(d['การดื่มสุรา'], alcohol_map));
    var safety_filter = findMatchWithArrayFilter(filter.safety, genericMapper(d['มาตรการ'], safety_map));
    var vehicle_filter = findMatchWithArrayFilter(filter.vehicle, genericMapper(d['รถผู้บาดเจ็บ'], vehicle_map));
    var hitBy_filter = findMatchWithArrayFilter(filter.hitBy, genericMapper(d['รถคู่กรณี'], vehicle_map));
    // console.log(d);
    // console.log("year: " + year_filter +
    //   " time: " + time + " " + time_filter_start + " " + time_filter_end +
    //   " time reult: " + time_filter +
    //   " sex: " + sex_filter +
    //   " alcohol: " + alcohol_filter +
    //   " safety: " + safety_filter +
    //   " vehicle: " + vehicle_filter +
    //   " hitBy: " + hitBy_filter);
    return year_filter && time_filter && sex_filter && age_filter && alcohol_filter && safety_filter && vehicle_filter && hitBy_filter;
  });
  return result;
}

function prefilterUtil(data) {
  var result = {};
  for (var i = 0, len = data.length; i < len; ++i) {
    var day = parseInt(data[i]['วันที่เกิดเหตุ']);
    var hour = parseInt(data[i]['เวลาเกิดเหตุ']);
    hour = (hour === 24)? 0 : hour;
    if (!(day in result)){
      result[day] = {};
    }
    if (!(hour in result[day])) {
      result[day][hour] = [];
    }
    result[day][hour].push(data[i]);
  }
  return result;
}

//   // Global var for all loaded .csv data
//   var dataset;

//   d3.csv("/public/data/175_samples_all_newyear_casualties.csv", function(error, data) {
//     if (error) { // when data is failed to load, do nothing.
//       console.error(error);
//     } else {
//       // data is loaded successfully, we can start to visualize it.
//       dataset = data;
//       console.log("original");
//       console.log(data);
//       // call other functions here
//       console.log("after filter");
//       var myfilter = {
//         year: {start: 2008, end: 2009},
//         time: {start: [28, 0], end: [1, 1]},
//         sex: [1],
//         alcohol: [1],
//         safety: [1],
//         vehicle: [2],
//         hitBy: [1,2,3,4,5],
//       };
//       console.log(filterUtil(data, myfilter));
//     }
//   });

function parse_search_string(str) {
  var split = str.split('&');
  var param = {};
  for (var i = 0; i < split.length; i++) {
    var tuple = split[i].split('=');
    param[tuple[0]] = decodeURIComponent(tuple[1]);
  }
  return param;
}

var qs = parse_search_string(location.search.slice(1));
var select_year = Number(qs.year || 2008);
var default_global_filter = {
  year: {start: select_year, end: select_year},
  time: {start: [28, 0], end: [3, 23]},
  sex: [0,1,2],
  age: [0,1,2,3,4],
  alcohol: [0,1,2],
  safety: [0,1,2],
  vehicle: [0,1,2,3,4,5],
  hitBy: [0,1,2,3,4,5]
};
// clone default filter
var global_filter = JSON.parse(JSON.stringify(default_global_filter));

$(function() {

  $('.filter-options').on('click', 'a', function(e) {
    e.preventDefault();
    var $el = $(this);
    var $group = $el.closest('.filter-options');
    var isSelect = !$el.hasClass('selected');
    var filter = $el.data('filter');
    var value = $el.data('value');

    $group.find('a').removeClass('selected');
    if (isSelect) {
      $el.addClass('selected');
      // select one
      global_filter[filter] = [+value];
    } else {
      // deselect
      global_filter[filter] = default_global_filter[filter];
    }

    // next tick
    setTimeout(function() {
      updateFilter();
    }, 1)
  });
});


var w = 450;
var h = 700;
var projection = d3.geo.albers()
    .center([100.0, 13.5])
    .rotate([0, 24])
    .parallels([5, 21])
    .scale(1200 * 2)
    .translate([-100, 200]);

var path = d3.geo.path().projection(projection);
var t = projection.translate(); // the projection's default translation
var s = projection.scale() // the projection's default scale

var map = d3.select("#vis").append("svg:svg")
    .attr("id", "overlay")
    .attr("width", w)
    .attr("height", h)
    // enable pan zoom
    //- .call(d3.behavior.zoom().on("zoom", redraw));

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

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-20, 0])
  .html(function(d) {
    return 'จังหวัด: '+d['จังหวัด']+' / เพศ: '+d['เพศ']+' / อายุ: '+d['อายุ']+' / การดื่มสุรา: '+d['การดื่มสุรา']+'<br>มาตรการ: '+d['มาตรการ']+' / รถผู้บาดเจ็บ: '+d['รถผู้บาดเจ็บ']+' / รถคู่กรณี: '+d['รถคู่กรณี'];
    //- return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
  });
map.call(tip);


var thailand = map.append("svg:g").attr("id", "thailand");
var legend = map.append("svg:g").attr("id", "legend");
var accidentMap = map.append("svg:g")
  .attr("id", "accident-map")
  .attr("clip-path", "url(#map-clip)");
var injuryMap = accidentMap.append("svg:g").attr("id", "injury-map");
var casualtyMap = accidentMap.append("svg:g").attr("id", "casualty-map");

var dataset;
var databucket = {};
var province = {};
var province_data = [];

var number_format = d3.format('0,000');
var injured_color = d3.rgb('#57c3d3');
var dead_color = d3.rgb('#ff0000');

d3.xml("public/image/map.svg", "image/svg+xml", function(xml) {
  var $map = $(xml.documentElement);
  $map.attr('id', 'map');
  $('#vis').prepend($map);

  // insert map clip path
  map.insert("svg:path", ":first-child")
        .attr('id', 'map-clip-dummy')
        .attr('fill', 'transparent')
        .attr('transform', 'translate(43,33)scale(1.1)')
        .attr('d', $('#_105613120').attr('d'));

  map.insert("svg:defs", ":first-child")
      .append("svg:clipPath")
        .attr("id", "map-clip")
      .append('svg:path')
        .attr('id', 'map-clip-path')
        .attr('transform', 'translate(43,33)scale(1.1)')
        .attr('d', $('#_105613120').attr('d'));

});

d3.json("public/data/thailand.json", function (json) {

  parse_province(json);

  // draw legend
  var legend_data = [
    { label: 'Injury', class: 'injured', r: 2 },
    { label: 'Casualty', class: 'died', r: 4 },
  ];
  legend.selectAll(".legend-icon")
      .data(legend_data)
    .enter().append('circle')
      .attr('class', function(d) { return 'legend-icon legend-icon-'+d.class; })
      .attr('cx', function(d, i) { return 250; })
      .attr('cy', function(d, i) { return 80 + i*20; })
      .attr('r', function(d, i) { return d.r; })
      .attr('color', function(d) { return d.color; });
  legend.selectAll(".legend-text")
      .data(legend_data)
    .enter().append('text')
      .attr('class', function(d) { return 'legend-text legend-text-'+d.class; })
      .attr('x', function(d, i) { return 260; })
      .attr('y', function(d, i) { return 80 + i*20; })
      //- .attr('r', 2)
      .text(function(d) { return d.label; });


  thailand.selectAll(".province")
      .data(json.features)
    .enter().append("svg:path")
      .attr("class", function(d) { return "province province-" + d.properties.CHA_NE+' province-'+d.properties.code; })
      .attr("d", path);

  thailand.selectAll(".province-center")
    .data(province_data)
    .enter().append("svg:circle")
      .attr('class', function(d) { return 'province-center'; })
      .attr('cx', function(d) {
        return projection(d.center)[0];
        })
      .attr('cy', function(d) { return projection(d.center)[1]; })
      .attr('r', function(d) { return 0; })
      ;

  //- startEmotionalScene();


  d3.csv("public/data/newyear_casualties_"+select_year+".csv", function(error, data) {
  // d3.csv("public/data/175_samples_all_newyear_casualties.csv", function(error, data) {
    if (error) { // when data is failed to load, do nothing.
      console.error(error);
    } else {
      // data is loaded successfully, we can start to visualize it.
      dataset = data;

      console.log('total data:', dataset.length);
      //- console.log('loading...');

      console.time('bucket');
      initTimeslotBucket();
      console.timeEnd('bucket');

      //- console.log('ready!');

      // init slider
      var $slider = $('#slider');
      var max_val = 7 * 24;
      $slider.slider({
        max: max_val,
        min: 0,
        value: 0,
        step: 1,
        slide: function(e, ui) {
          console.log(e);
          console.log(ui.value);
          var value = ui.value;
          var day = value / 24;
          var hour = value % 24;
          day = (day < 4)? day + 28: day - 3;
          global_filter['time'].end[0] = day;
          global_filter['time'].end[1] = hour;
          // next tick
          setTimeout(function() {
            updateFilter();
          }, 1);
        },
      })
      .each(function() {
        // Space out values
        var day_captions= ['Dec 28', 'Dec 29', 'Dec 30', 'Dec 31', 'Jan 1', 'Jan 2', 'Jan 3'];
        for (var i = 0, len = day_captions.length; i < len; ++i) {
          var el = $('<label>' + day_captions[i] + '</label>').css('left',(i/(len)*100)+'%');
          $( "#slider" ).append(el);
        }
      });

      //- $slider.slider('disable');
      startTimelineScene();

    }

  });

});

function updateFilter() {
  var filtered_data = filterUtil(dataset, global_filter);
  var data;
  var optimizeSpeed = true;
  var isDead;
  var ndead = 0;
  console.log(filtered_data.length);
  // clear old dots
  injuryMap.selectAll('*').remove();
  casualtyMap.selectAll('*').remove();

  for (var i=0; i<filtered_data.length; i++) {
    data = filtered_data[i];
    isDead = data['ผลการรักษา'].indexOf('ตาย') >= 0;
    if (isDead) ndead++;

    // avoid rendering some injury accidents
    // to reduce computation time
    if (optimizeSpeed && !isDead && i%5 != 0) {
      //- counter++;
    } else if (shoot(data, isDead, i, false)) {
      //- counter++;
    }
  }

  $('#total-casualty .count').text(number_format(filtered_data.length));
  $('#died-casualty .count').text(number_format(ndead));
  $('#injured-casualty .count').text(number_format(filtered_data.length - ndead));

}

function endScene() {
  $('#filter-panel').fadeIn();
  $('#slider').slider('enable');
}

function initTimeslotBucket() {
  databucket = prefilterUtil(dataset);
}

function startTimelineScene() {
  var speed = 200;
  var parallelism = 1;
  var counter = 0;

  var now = [ 28, 0 ];
  var selected_data;
  var selected_counter = 0;

  var $diedCount = $('#died-casualty .count');
  var $injuredCount = $('#injured-casualty .count');

  var $slider = $('#slider');

  var intervalId = setInterval(updateTimelineScene, speed);

  function getNext() {
    if (now[0] == 4) return null;
    if (selected_data && selected_counter < selected_data.length) {
      return selected_data[selected_counter++];
    }

    // update slider timeline
    $slider.slider('value', timeWrapper(now[0], now[1]));

    // filter data
    selected_data = databucket[now[0]] ? databucket[now[0]][now[1]] : [];
    selected_counter = 0;

    // move to next time slot
    now[1]++;
    if (now[1] === 24) {
      now[0]++;
      if (now[0] > 31) now[0] = 1;
      now[1] = 0;
    }

    return selected_data[selected_counter++];
  }

  function updateTimelineScene() {
    var data;
    var isDead;
    var optimizeSpeed = counter > 400;
    var $display;

    for (var i=0, data=getNext(); data && i<parallelism; data=getNext(), i++) {
      isDead = data['ผลการรักษา'].indexOf('ตาย') >= 0;

      // update display count
      $display = isDead ? $diedCount : $injuredCount;
      $display.text(number_format(+$display.text().replace(',', '')+1) );

      // avoid rendering some injury accidents
      // to reduce computation time
      if (optimizeSpeed && !isDead && i%5 != 0) {
        counter++;
      } else if (shoot(data, isDead, counter, true)) {
        counter++;
      }
    }

    // update display count
    $('#total-casualty .count').text(number_format(counter));

    // step 2
    if (speed != 0 && counter > 25) {
      speed = 50;
      parallelism = 1;
      clearInterval(intervalId);
      intervalId = setInterval(updateTimelineScene, speed);
    }

    // step 3
    if (speed != 0 && counter > 100) {
      speed = 50;
      parallelism = 3;
      clearInterval(intervalId);
      intervalId = setInterval(updateTimelineScene, speed);
    }

    // step 4
    if (speed != 0 && counter > 400) {
      speed = 0;
      parallelism = 200;
      clearInterval(intervalId);
      intervalId = setInterval(updateTimelineScene, speed);
    }

    // finish at date 4
    if (now[0] === 4) {
      clearInterval(intervalId);
      endScene();
    }
  }
}

function startEmotionalScene() {
  var speed = 200;
  var parallelism = 1;
  var target = 10000;
  var counter = 0;

  var intervalId = setInterval(updateEmotionalScene, speed);
  function updateEmotionalScene() {

    for (var i=0; i<parallelism; i++) {
      if (shoot(Math.floor(Math.random()*90)+10, Math.random() > 0.015 ? false : true, counter, true)) {
        counter++;
      }
    }

    $('#total-casualty .count').text(number_format(counter));

    // step 2
    if (speed != 0 && counter > 25) {
      speed = 50;
      parallelism = 1;
      clearInterval(intervalId);
      intervalId = setInterval(updateEmotionalScene, speed);
    }

    // step 3
    if (speed != 0 && counter > 100) {
      speed = 50;
      parallelism = 3;
      clearInterval(intervalId);
      intervalId = setInterval(updateEmotionalScene, speed);
    }

    // step 4
    if (speed != 0 && counter > 400) {
      speed = 0;
      parallelism = 33;
      clearInterval(intervalId);
      intervalId = setInterval(updateEmotionalScene, speed);
    }

    // finish
    if (counter > target) {
      clearInterval(intervalId);
      endScene();
    }
  }
}

function parse_province(data) {
  data.features.forEach(function(f) {
    var id = f.properties.code;
    f.id = id;
    f.region_type = 'province';
    f.center = get_avg_point(f);
    // add to list
    province_data.push(f);
    province[id] = f;
  });
}
function get_coords(province) {
  if (province.geometry.type === 'Polygon') return province.geometry.coordinates[0];
  if (province.geometry.type === 'MultiPolygon') return province.geometry.coordinates[0][0];
  return null;
}
function get_avg_point(province) {
  var xt=0, yt=0;
  var data = get_coords(province);
  //- if (geometry.type === 'Polygon') data = geometry.coordinates[0];
  //- if (geometry.type === 'MultiPolygon') data = geometry.coordinates[0][0];
  data.forEach(function(d) {
    xt += d[0];
    yt += d[1];
  });
  return [ xt/data.length, yt/data.length];
}

function redraw() {
  // d3.event.translate (an array) stores the current translation from the parent SVG element
  // t (an array) stores the projection's default translation
  // we add the x and y vales in each array to determine the projection's new translation
  var tx = t[0] * d3.event.scale + d3.event.translate[0];
  var ty = t[1] * d3.event.scale + d3.event.translate[1];
  projection.translate([tx, ty]);

  // now we determine the projection's new scale, but there's a problem:
  // the map doesn't 'zoom onto the mouse point'
  projection.scale(s * d3.event.scale);

  // redraw the map
  thailand.selectAll("path").attr("d", path);

  // redraw the x axis
  xAxis.attr("x1", tx).attr("x2", tx);

  // redraw the y axis
  yAxis.attr("y1", ty).attr("y2", ty);
}

function shoot(data, isDead, order, animate) {
  var province_id = data['รหัสจังหวัด'];
  var p = province[province_id];
  if (!p) return false;
  //- p = {
  //-   center: p.center
  //- };
  //- data.center = p.center;
  data.center = path.centroid(p);

  var p_data = [data];
  var dv = Math.log(order+1) * 2;

  // add accident point randomly
  var color = isDead ? dead_color.hsl().toString() : injured_color.hsl().toString();
  var parent = isDead ? casualtyMap : injuryMap;
  var circle = parent.selectAll(".accident-"+order)
    .data(p_data)
    .enter().append("svg:circle")
      .attr('class', function(d) {
        return 'accident accident-dead accident-'+order;
      })
      .attr('cx', function(d) {
        return d.center[0] + Math.random()*dv*2 - dv;
        //- return projection(d.center)[0] + Math.random()*dv*2 - dv;
      })
      .attr('cy', function(d) {;
        return d.center[1] + Math.random()*dv*2 - dv;
        //- return projection(d.center)[1] + Math.random()*dv*2 - dv;
      })
      ;
  if (isDead) {
    // casualty dot
    circle
      .attr('fill', color)
      .on('mouseover', function(e) {
        d3.select(this)
          .transition()
          .attr('r', function(d) { return 10; });
        tip.show(e);
      })
      .on('mouseout', function(e) {
        d3.select(this)
          .transition()
          .attr('r', function(d) { return 2; });
        tip.hide(e);
      });
    if (animate) {
      circle
        .attr('r', function(d) { return 10; })
        .transition()
        .attr('r', function(d) { return 2; })
        ;
    } else {
      circle
        .attr('r', function(d) { return 2; })
        ;
    }
  } else {
    // injury dot
    circle
      .attr('fill', color);

    if (animate) {
      circle
        .attr('r', function(d) { return 3; })
        .transition()
        .attr('r', function(d) { return 1; });
    } else {
      circle
        .attr('r', function(d) { return 1; });
    }
  }
  return true;
}

/**
 * @param  {point} point Point to check
 * @param  {Array<point>} vs  Array of polygon coordinates
 * @return {boolean}     Is inside
 */
function pointInPolygon(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var xi, xj, i, intersect,
      x = point[0],
      y = point[1],
      inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    xi = vs[i][0],
    yi = vs[i][1],
    xj = vs[j][0],
    yj = vs[j][1],
    intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
