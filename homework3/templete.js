// Part 2.1 - Boxplot
d3.csv("socialMedia.csv").then(data => {
  data.forEach(d => d.Likes = +d.Likes);

  const svg = d3.select("#boxplot").append("svg")
    .attr("width", 800)
    .attr("height", 400);

  const margin = { top: 30, right: 20, bottom: 50, left: 60 },
        w = 800, h = 400;

  const xGrp = Array.from(new Set(data.map(d => d.AgeGroup))).sort(),
        x = d3.scaleBand().domain(xGrp).range([margin.left, w - margin.right]).padding(0.2),
        y = d3.scaleLinear().domain([0, d3.max(data, d => d.Likes)]).nice().range([h - margin.bottom, margin.top]);

  svg.append("g").attr("transform", `translate(0,${h - margin.bottom})`).call(d3.axisBottom(x));
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg.append("text").attr("x", w / 2).attr("y", h - 10).attr("text-anchor", "middle").text("Age Group");
  svg.append("text").attr("transform", "rotate(-90)").attr("x", -h / 2).attr("y", 15).attr("text-anchor", "middle").text("Likes");

  const stats = d3.rollup(data, v => {
    const sorted = v.map(d => d.Likes).sort(d3.ascending);
    return {
      min: d3.min(sorted),
      q1: d3.quantile(sorted, 0.25),
      med: d3.quantile(sorted, 0.5),
      q3: d3.quantile(sorted, 0.75),
      max: d3.max(sorted)
    };
  }, d => d.AgeGroup);

  stats.forEach((q, grp) => {
    const xpos = x(grp), bw = x.bandwidth() * 0.6, xleft = xpos + (x.bandwidth() - bw) / 2;
    svg.append("line")
      .attr("x1", xpos + x.bandwidth() / 2)
      .attr("x2", xpos + x.bandwidth() / 2)
      .attr("y1", y(q.min))
      .attr("y2", y(q.max))
      .attr("stroke", "#444");

    svg.append("rect")
      .attr("x", xleft)
      .attr("y", y(q.q3))
      .attr("width", bw)
      .attr("height", y(q.q1) - y(q.q3))
      .attr("fill", "#ccc")
      .attr("stroke", "#444");

    svg.append("line")
      .attr("x1", xleft)
      .attr("x2", xleft + bw)
      .attr("y1", y(q.med))
      .attr("y2", y(q.med))
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
  });
});

// Part 2.2 - Bar plot
d3.csv("SocialMediaAvg.csv").then(data => {
  data.forEach(d => d.AvgLikes = +d.AvgLikes);

  const svg = d3.select("#barplot").append("svg")
    .attr("width", 800)
    .attr("height", 400);

  const margin = { top: 30, right: 20, bottom: 60, left: 60 },
        w = 800, h = 400;

  const plat = Array.from(new Set(data.map(d => d.Platform))),
        type = Array.from(new Set(data.map(d => d.PostType)));

  const x0 = d3.scaleBand().domain(plat).range([margin.left, w - margin.right]).padding(0.2),
        x1 = d3.scaleBand().domain(type).range([0, x0.bandwidth()]).padding(0.1),
        y = d3.scaleLinear().domain([0, d3.max(data, d => d.AvgLikes)]).nice().range([h - margin.bottom, margin.top]),
        clr = d3.scaleOrdinal().domain(type).range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

  svg.append("g").attr("transform", `translate(0,${h - margin.bottom})`).call(d3.axisBottom(x0));
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg.append("text").attr("x", w / 2).attr("y", h - 15).attr("text-anchor", "middle").text("Platform");
  svg.append("text").attr("transform", "rotate(-90)").attr("x", -h / 2).attr("y", 15).attr("text-anchor", "middle").text("Average Likes");

  const groups = svg.selectAll(".group")
    .data(plat)
    .enter().append("g")
    .attr("transform", d => `translate(${x0(d)},0)`);

  groups.selectAll("rect")
    .data(p => data.filter(d => d.Platform === p))
    .enter().append("rect")
    .attr("x", d => x1(d.PostType))
    .attr("y", d => y(d.AvgLikes))
    .attr("width", x1.bandwidth())
    .attr("height", d => y(0) - y(d.AvgLikes))
    .attr("fill", d => clr(d.PostType));

  const legend = svg.append("g").attr("transform", `translate(${w - margin.right - 140}, ${margin.top})`);
  type.forEach((t, i) => {
    legend.append("rect").attr("x", 0).attr("y", i * 20).attr("width", 12).attr("height", 12).attr("fill", clr(t));
    legend.append("text").attr("x", 20).attr("y", i * 20 + 10).text(t);
  });
});

// Part 2.3 - Line plot
d3.csv("SocialMediaTime.csv").then(data => {
  data.forEach(d => d.AvgLikes = +d.AvgLikes);
  data.sort((a, b) => new Date(a.Date.split(" ")[0]) - new Date(b.Date.split(" ")[0]));

  const svg = d3.select("#lineplot").append("svg")
    .attr("width", 800)
    .attr("height", 400);

  const margin = { top: 30, right: 20, bottom: 70, left: 60 },
        w = 800, h = 400;

  const x = d3.scalePoint().domain(data.map(d => d.Date)).range([margin.left, w - margin.right]).padding(0.5),
        y = d3.scaleLinear().domain([0, d3.max(data, d => d.AvgLikes)]).nice().range([h - margin.bottom, margin.top]);

  svg.append("g").attr("transform", `translate(0,${h - margin.bottom})`)
    .call(d3.axisBottom(x)).selectAll("text")
    .style("text-anchor", "end").attr("transform", "rotate(-25)");

  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg.append("text").attr("x", w / 2).attr("y", h - 20).attr("text-anchor", "middle").text("Date");
  svg.append("text").attr("transform", "rotate(-90)").attr("x", -h / 2).attr("y", 15).attr("text-anchor", "middle").text("Average Likes");

  const line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.AvgLikes))
    .curve(d3.curveNatural);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 2)
    .attr("d", line);
});
