// load wav
var ti = new Audio('sounds/ti.wav'),
    co = new Audio('sounds/co.wav');

// init slider
var tempoSlider = $('#tempo-slider').slider().on('slide', function() {
  $('.tempo-label').text($(this).val());
});

// move js-main-container
var mainContainer = $('.js-main-container'),
    adjustValue = ($(window).height() - mainContainer.height()) / 2 - 20;
mainContainer.animate({ 'margin-top': '+=' + adjustValue + 'px' }, 'slow');

// init d3
var diameter = Math.min($(window).height(), $(window).width());

var dataset = {
      lower: [0, 1],
      upper: [1, 0]
    },
    radius = diameter / 2.5,
    pie = d3.pie().sort(null);

var arc = d3.arc()
    .innerRadius(radius * 0.7)
    .outerRadius(radius);

var svg = d3.select('.js-donuts')
    .attr('width', $(window).width())
    .attr('height', $(window).height())
    .append('g')
    .attr('transform', 'translate(' + $(window).width() / 2 + ',' + $(window).height() / 2 + ')');

var path = svg.selectAll('path')
    .data(pie(dataset.lower))
    .enter().append('path')
    .attr('class', function (d, i) { return 'color' + i })
    .attr('d', arc)
    .each(function (d) { this._current = d; });

// attach button event
var interval = null,
    counter = 0,
    backgroundFlush = $('.background-flush');
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

        backgroundFlush.show().fadeOut(300);
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
