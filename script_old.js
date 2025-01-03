// Load the data
d3.json("happiness_data.json").then(function(data) {
    if (!data || data.length === 0) {
        console.error("Data could not be loaded or is empty.");
        return;
    }

    // Dimensions
    const width = 500, height = 500;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Filter unique countries
    const countries = [...new Set(data.map(d => d["Country name"]))];
    if (countries.length === 0) {
        console.error("No countries found in the data.");
        return;
    }

    // Set up scales
    const xScaleLine = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const yScaleLine = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Life Ladder"])]).nice()
        .range([height, 0]);

    const xScaleScatter = d3.scaleLinear()
        .domain(d3.extent(data, d => d["PCA1"])).nice()
        .range([0, width]);

    const yScaleScatter = d3.scaleLinear()
        .domain(d3.extent(data, d => d["PCA2"])).nice()
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(countries);

    // Function to update visualizations based on continent filter
    function updateVisualizations(continent) {
        let filteredData;
        if (continent === "all") {
            filteredData = data;
        } else {
            filteredData = data.filter(d => d.continent === continent);
        }

        // Update line chart
        lineSvg.selectAll("path").remove();

        const filteredCountries = [...new Set(filteredData.map(d => d["Country name"]))];
        filteredCountries.forEach(country => {
            const countryData = filteredData.filter(d => d["Country name"] === country);
            if (countryData.length > 0) {
                lineSvg.append("path")
                    .datum(countryData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(country))
                    .attr("stroke-width", 0.75)
                    .attr("d", line)
                    .attr("class", `line-${country.replace(/\s+/g, "-")}`)
                    .on("mouseover", function () {
                        d3.select(this)
                            .attr("stroke-width", 3)
                            .attr("opacity", 1)
                            .attr("z-index", 1);
                    })
                    .on("mouseout", function () {
                        d3.select(this)
                            .attr("stroke-width", 1.5)
                            .attr("opacity", 0.8);
                    });
            }
        });

        // Update scatter plot
        scatterSvg.selectAll("circle").remove();

        scatterSvg.selectAll("circle")
            .data(filteredData)
            .join("circle")
            .attr("cx", d => xScaleScatter(d["PCA1"]))
            .attr("cy", d => yScaleScatter(d["PCA2"]))
            .attr("r", 2)
            .attr("fill", d => colorScale(d["Country name"]))
            .attr("class", d => `scatter-${d["Country name"].replace(/\s+/g, "-")}`)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("r", 4)
                    .attr("fill", "orange");

                scatterSvg.append("text")
                    .attr("x", xScaleScatter(d["PCA1"]) - 75)
                    .attr("y", yScaleScatter(d["PCA2"]) - 10)
                    .attr("z-index", 1)
                    .attr("id", "tooltip")
                    .text(`${d["Country name"]} (${d["year"]})`);
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("r", 2)
                    .attr("fill", d => colorScale(d["Country name"]));

                scatterSvg.select("#tooltip").remove();
            })
            .on("click", function (event, d) {
                const country = d["Country name"];
                const line = d3.select(`.line-${country.replace(/\s+/g, "-")}`);
                if (line.attr("opacity") === "0") {
                    line.attr("opacity", 0.8);
                } else {
                    line.attr("opacity", 0);
                }   
            });
    }

    // Line chart setup
    const lineSvg = d3.select("#chart1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axis titles for the line chart
    lineSvg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Year");

    lineSvg.append("text")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Life Ladder");

    // Scatter plot setup
    const scatterSvg = d3.select("#chart2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axis titles for the scatter plot
    scatterSvg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("PCA1");

    scatterSvg.append("text")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("PCA2");

    // Initial rendering
    const line = d3.line()
        .x(d => xScaleLine(d.year))
        .y(d => yScaleLine(d["Life Ladder"]));

    updateVisualizations("all");

    // Add event listener to the dropdown
    d3.select("#continent").on("change", function() {
        const selectedContinent = d3.select(this).property("value");
        updateVisualizations(selectedContinent);
    });
}).catch(error => {
    console.error("Error loading or processing data:", error);
});
