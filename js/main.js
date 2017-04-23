$(function(){
    d3.csv('data/SAT_Results.csv', function(error, allData){
        var section = 'Math';

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
                           .attr('transform', `translate(${(margin.left+drawWidth)/2}, ${drawHeight+margin.top+40}) rotate(-90)`)
                           .attr('class', 'title');

        var yAxisText = svg.append('text')
                           .attr('transform', `translate(${margin.left - 40},${(margin.top + drawHeight / 2)}) rotate(-90)`)
                           .attr('class', 'title');
        
        var xAxis = d3.axisBottom();

        var yAxis = d3.axisLeft();

        var xScale = d3.scaleBand();

        var yScale = d3.scaleLinear();

        var setScale = (data) => {
            var schools = data.map((d)=> d.SCHOOL_NAME)

            xScale.range([0, drawWidth])
                  .padding(0.1)
                  .domain(schools);
            var yMin = d3.min(data, (d) => d.Reading);
            
            var yMax = d3.max(data, (d) => d.Reading);

            yScale.range([drawHeight, 0])
                  .domain([0, yMax]);
        }

        var setAxes = () => {
            xAxis.scale(xScale);
            yAxis.scale(yScale);

            xAxisLabel.call(xAxis);
            yAxisLabel.call(yAxis);

        }

        var draw = ((data)=> {
            setScale(data);
            setAxes();
            console.log("?")
            var bars = g.selectAll('rect')
                        .data(data);

            bars.enter()
                .append('rect')
                .attr('x', ((d)=> xScale(d.SCHOOL_NAME)))
                .attr('y', ((d)=> drawHeight))
                .attr('width', xScale.bandwidth())
                .merge(bars)
                .attr('y', ((d)=> yScale(d.Reading)))
                .attr('height', (d)=> drawHeight - yScale(d.Reading));

            bars.exit()
                .remove();            
        });
        console.log(allData);
        draw(allData);
        //var currentData = filterData();
        //console.log(allData)
        //draw(allData);

    })
})