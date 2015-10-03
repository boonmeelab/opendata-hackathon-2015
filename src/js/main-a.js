
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
  day = (day > 20)? (day - 31) : day;
  hour = (hour === 24)? 0 : hour;
  var time = day * 24 + hour;
  return time;
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
    return year_filter && time_filter && sex_filter && alcohol_filter && safety_filter && vehicle_filter && hitBy_filter;
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


