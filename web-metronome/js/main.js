// load wav
var ti = new Audio('sounds/ti.wav'),
    co = new Audio('sounds/co.wav');

// init slider
var tempoSlider = $('#tempo-slider').slider();

// init d3
var containerRect = $('.js-donuts-container').width(),
    width = $('.js-donuts-container').width(),
    height = width;

var dataset = {
      lower: [0, 1],
      upper: [1, 0]
    },
    radius = Math.min(width, height) / 2.5,
    pie = d3.pie().sort(null);

var arc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius);

var svg = d3.select('.js-donuts')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var path = svg.selectAll('path')
    .data(pie(dataset.lower))
    .enter().append('path')
    .attr('class', function (d, i) { return 'color' + i })
    .attr('d', arc)
    .each(function (d) { this._current = d; });

// attach button event
var interval = null,
    counter = 0;
$('.js-toggle-click').on('click', function() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    counter = 0;

    path.data(pie([0, 1]))
      .attr('d', arc)
      .each(function (d) { this._current = d; });
  } else {
    var duration = 60 / parseInt(tempoSlider.val()) * 1000,
        denominator = parseInt($('select.rhythm-select.denominator').val()),
        numerator = parseInt($('select.rhythm-select.numerator').val());
    duration = duration * (4 / denominator);
    interval = setInterval(function () {
      if ((counter % numerator) === 0) {
        co.pause();
        co.currentTime = 0;
        co.play();
      } else {
        ti.pause();
        ti.currentTime = 0;
        ti.play();
      }

      var val = (counter % numerator + 1) / numerator;
      path.data(pie([val, 1 - val]))
        .attr('d', arc)
        .each(function (d) { this._current = d; });

      counter++;
    }, duration);
  }
});
