$(function(){
    d3.csv('data/dataset.csv', function(error, allData){
        var decade = '1990';
        var deathRate, birthRate

        var yMax = d3.max(allData, (d) => d3.max([+d.Death_rate_60, +d.Death_rate_15, +d.Death_rate_90]));
        var yMin = d3.min(allData, (d) => d3.min([+d.Death_rate_60, +d.Death_rate_15, +d.Death_rate_90]));
        var xMax = d3.max(allData, (d) => d3.max([+d.Birth_rate_60, +d.Birth_rate_15, +d.Birth_rate_90]));
        var xMin = d3.min(allData, (d) => d3.min([+d.Birth_rate_60, +d.Birth_rate_15, +d.Birth_rate_90]));

        allData.map((d) => {
            d.CurrentBirthRate = d.Birth_rate_90;
            d.CurrentDeathRate = d.Death_rate_90;
        })

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
            return `${d.Country_Name}</br>x: ${d.CurrentBirthRate}</br>y: ${d.CurrentDeathRate}`;
        });
        g.call(tip);

        // Get list of regions for colors
        var continents = allData.map((d)=> d.Continent);
        uniqueContinents = continents.filter(function(item, pos) {
            return continents.indexOf(item) == pos;
        })

        console.log(uniqueContinents)

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
                   .style('opacity', 0.4)
                   .attr('title', (d) => d.Country_Name)
                   .transition()
                   .duration(600)
                   .attr('cx', (d)=> xScale(d.CurrentBirthRate))
                   .attr('cy', (d)=> yScale(d.CurrentDeathRate))
                   .attr('data-legend', (d)=> d.Continent)

            circles.exit()
                   .remove();            

            var guideLine = svg.append('line')
                            .attr('class', 'dashed')
                            .style('stroke', 'orange')
                            .style("stroke-dasharray", ("4, 3"))
                            .style("stroke-opacity", 0.6)
                            .attr('x1', margin.left)
                            .attr('y1', drawHeight+margin.top)
                            .attr('x2', (d) => (xScale(d3.max([xMax, yMax]))))
                            .attr('y2', (d) => (yScale(d3.max([xMax, yMax]))))


            var legend = svg.selectAll(".legend")
                            .data(uniqueContinents)
                            .enter()
                            .append("g")
                            .attr("class", "legend")
                            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                  .attr("class", "legend-rect")
                  .attr("x", width - 18)
                  .attr("width", 18)
                  .attr("height", 18)
                  .style("fill", (d) => colorScale(d))
                  .attr('opacity', '0.7')

            legend.append("text")
                  .attr("class", "legend-text")
                  .attr("x", width - 24)
                  .attr("y", 9)
                  .attr("dy", ".35em")
                  .style("text-anchor", "end")
                  .text(function(d) { return d; });

        });
        $("input").on('change', function() {
            // Get value, determine if it is the sex or type controller
            decade = $(this).val();
            switch(decade){
                case '1960':
                    allData.map((d) => {
                        d.CurrentBirthRate = d.Birth_rate_60;
                        d.CurrentDeathRate = d.Death_rate_60;
                    })
                    break;
                case '1990' :
                    allData.map((d) => {
                        d.CurrentBirthRate = d.Birth_rate_90;
                        d.CurrentDeathRate = d.Death_rate_90;
                    })
                    break;
                case '2015' :
                    allData.map((d) => {
                        d.CurrentBirthRate = d.Birth_rate_15;
                        d.CurrentDeathRate = d.Death_rate_15;
                    })
                    break;
            }
            draw(allData)
        });
        draw(allData);
    })
})