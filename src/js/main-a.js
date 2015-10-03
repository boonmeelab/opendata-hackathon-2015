$(function() {

  console.log('Ready *__*');
  d3.select("body")
    .append("p")
    .text("New paragraph!");
  d3.csv("/public/data/100_samples_newyear_casualties.csv", function(data) {
    console.log(data);
  });
});

