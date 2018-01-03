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
  } else {
    var duration = 60 / parseInt(tempoSlider.val()) * 1000;
    duration = duration / 4 * parseInt($('select.rhythm-select.denominator').val());
    interval = setInterval(function () {
      if (counter % parseInt($('select.rhythm-select.numerator').val()) === 0) {
        co.pause();
        co.currentTime = 0;
        co.play();
      } else {
        ti.pause();
        ti.currentTime = 0;
        ti.play();
      }
      counter++;

      path.data(pie(dataset.lower))
        .attr('d', arc)
        .each(function (d) { this._current = d; });

      path = path.data(pie(dataset.upper));
      path.transition().duration(duration).ease(d3.easeLinear)
          .attrTween('d', function(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) { return arc(i(t)); };
          });
    }, duration);
  }
});
