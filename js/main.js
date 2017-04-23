$(function(){
    d3.csv('data/dataset.csv', function(error, allData){
        var decade = '1990';
        var deathRate, birthRate

        var yMax = d3.max(allData, (d) => d3.max([+d.Death_rate_60, +d.Death_rate_15, +d.Death_rate_90]));
        var yMin = d3.min(allData, (d) => d3.min([+d.Death_rate_60, +d.Death_rate_15, +d.Death_rate_90]));
        var xMax = d3.max(allData, (d) => d3.max([+d.Birth_rate_60, +d.Birth_rate_15, +d.Birth_rate_90]));
        var xMin = d3.min(allData, (d) => d3.min([+d.Birth_rate_60, +d.Birth_rate_15, +d.Birth_rate_90]));


        var margin = {
            left:   70,
            bottom: 100,
            top:    50,
            right:  70
        };

        var height = 600,
            width = 1100,
            drawHeight = height - margin.bottom - margin.top;
            drawWidth = width - margin.right - margin.left;

        var svg = d3.select('#vis')
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width);
        var g = svg.append('g')
                   .attr('transform', `translate(${margin.left}, ${margin.top})`)
                   .attr('height', drawHeight)
                   .attr('width', drawWidth);
            
        var xAxisLabel = svg.append('g')
                            .attr('transform', `translate(${margin.left}, ${drawHeight+margin.top})`)
                            .attr('class', 'axis');
                
        var yAxisLabel = svg.append('g')
                            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        var xAxisText = svg.append('text')
                           .attr('transform', `translate(${(margin.left+drawWidth)/2},${(drawHeight+margin.top+40)})`)
                           .attr('class', 'title')
                           .text('Birth rate, crude (per 1,000 people)');

        var yAxisText = svg.append('text')
                           .attr('transform', `translate(${margin.left - 40},${(margin.top + drawHeight / 2)}) rotate(-90)`)
                           .attr('class', 'title')
                           .text('Death rate, crude (per 1,000 people)');
        
        var xAxis = d3.axisBottom();

        var yAxis = d3.axisLeft();

        var xScale = d3.scaleLinear();

        var yScale = d3.scaleLinear();
        var setScale = (data) => {
            switch (decade) {
                case '1960' :
                    deathRate = data.map((d)=> +d.Death_rate_60);
                    birthRate = data.map((d)=> +d.Birth_rate_60);
                    break;
                case '1990' :
                    deathRate = data.map((d)=> +d.Death_rate_90);
                    birthRate = data.map((d)=> +d.Birth_rate_90);
                    break;
                case '2015' :
                    deathRate = data.map((d)=> +d.Death_rate_15);
                    birthRate = data.map((d)=> +d.Birth_rate_15);
                    break;
            }

            xScale.range([0, drawWidth])
                  .domain([0, xMax]);

            yScale.range([drawHeight, 0])
                  .domain([0, yMax]);
        }

        var setAxes = () => {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel.call(xAxis);
            yAxisLabel.call(yAxis);
        }


        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d.Country_Name;
        });
        g.call(tip);

        // Get list of regions for colors
        var continents = allData.map((d)=> d.Continent);

        // Set an ordinal scale for colors
        var colorScale = d3.scaleOrdinal().domain(continents).range(d3.schemeCategory10);

        var draw = ((data)=> {
            setScale(data);
            setAxes();
            var circles = g.selectAll('circle')
                            .data(data);

            circles.enter()
                   .append('circle')
                   .merge(circles)
                   .attr('r', 10)
                   .attr('fill', (d,i) => colorScale(d.Continent))
                   .on('mouseover', tip.show)
                   .on('mouseout', tip.hide)
                   .style('opacity', 0.3)
                   .attr('title', (d) => d.Country_Name);

            switch (decade) {
                case '1960' :
                    circles.transition()
                           .duration(600)
                           .attr('cx', (d)=> xScale(d.Birth_rate_60))
                           .attr('cy', (d)=> yScale(d.Death_rate_60));
                    break;
                case '1990' :
                    circles.transition()
                           .duration(600).attr('cx', (d)=> xScale(d.Birth_rate_90))
                           .attr('cy', (d)=> yScale(d.Death_rate_90));
                    break;
                case '2015' :
                    circles.transition()
                           .duration(600).attr('cx', (d)=> xScale(d.Birth_rate_15))
                           .attr('cy', (d)=> yScale(d.Death_rate_15));
                    break;              
            }

            circles.exit()
                   .remove();            
        });
        $("input").on('change', function() {
            // Get value, determine if it is the sex or type controller
            decade = $(this).val();
            draw(allData)
        });
        draw(allData);
        draw(allData);
    })
})