let svg = d3.select('#vis')
            .append('svg')
            .attr('width', 600)
            .attr('height', 400)
            .style('background', 'lightyellow')

//draw a circle
svg.append('circle')
    .attr('r', 100)
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('fill', 'blue')

//draw a rect: height, width, x, y, rect
svg.append('rect')
    .attr('x', 0)
    .attr('y', 200)
    .attr('height', 100)
    .attr('width', 50)

//draw a line
svg.append('line')
    .attr('x1', 0)
    .attr('y1', 400)
    .attr('x2', 100)
    .attr('y2', 300)    
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
