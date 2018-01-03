var ti = new Audio('sounds/ti.wav'),
    co = new Audio('sounds/co.wav')
    counter = 0;

var duration = 500,
    width = window.innerWidth - 20,
    height = window.innerHeight - 20;

var dataset = {
      lower: [0, 1],
      upper: [1, 0]
    },
    radius = Math.min(width, height) / 3,
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

setInterval(function () {
  co.pause();
  co.currentTime = 0;
  co.play();

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
