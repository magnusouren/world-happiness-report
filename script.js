const selectedCountries = []

async function loadData() {
    try {
        const data = await d3.json("happiness_data.json");
        if (!data || data.length === 0) {
            console.error("Data could not be loaded or is empty.");
            return [];
        }
        return data;
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
}

function findCountry(data, countryName, year) {
    const country = data.find(d => d["Country name"] === countryName && d.year === year);
    return country ? country : null;
}

// function addCountrDataToDiv(
//     countryData,
//     divElement,
//     countryName,
//     year
// ) {
//     const country = findCountry(countryData, countryName, year);
//     if (!country) {
//         divElement.innerHTML = "No data available";
//         return;
//     }
    
//     const container = document.createElement("div");
//     const title = document.createElement("h3");
//     title.textContent = country["Country name"];
//     container.appendChild(title);

//     const list = document.createElement("ul");
//     for (const key in country) {
//         const item = document.createElement("li");
//         item.textContent = `${key}: ${country[key]}`;
//         list.appendChild(item);
//     }
//     container.appendChild(list);

//     divElement.innerHTML = "";
//     divElement.appendChild(container);
// }




// Load GeoJSON data and create the map
async function drawWorldMap(data, year) {
    try {
        // Load the GeoJSON data for the world map
        const world = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");

        // Set up dimensions
        const width = 800, height = 600;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        // Create SVG element
        const svg = d3.select("#world-map")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define a projection and path generator
        const projection = d3.geoMercator()
            .scale(130)
            .translate([width / 2, height / 1.5]);
        const path = d3.geoPath().projection(projection);


        const colorScale = d3.scaleSequential(d3.interpolateRdBu)
            .domain([0, 10]); // Example domain, customize based on your data

        // Draw the map
        svg.selectAll("path")
            .data(world.features)
            .join("path")
            .attr("d", path)
            .attr("fill", "lightgray") // Default color
            .attr("stroke", "white")
            .attr("stroke-width", 0.75)
            .on("mouseover", function (event, d) {
                const countryData = findCountry(data, d.properties.name, year);
                if (!countryData) {
                    d3.select(this).style("cursor", "not-allowed");
                    d3.select(this).attr("title", "No data available");
                    return;
                };
                d3.select(this).attr("fill", "orange");
                const tooltip = d3.select("#tooltip");
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Country: ${countryData["Country name"]}<br>Life Ladder: ${countryData["Life Ladder"]}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
                const countryData = findCountry(data, d.properties.name, year);
                if (!countryData) {
                    d3.select(this).attr("fill", "lightgray");
                    return;
                }
                d3.select(this).attr("fill", countryData ? colorScale(countryData["Life Ladder"]) : "lightgray");
            })
            .on("click", function (event, d) {
                const countryData = findCountry(data, d.properties.name, year);
                if (!countryData) {
                    console.log(`No data available for ${d.properties.name}`);
                    return;
                }
                selectedCountries.push(countryData["Country name"]);
                document.getElementById("chart1").innerHTML = selectedCountries.join(", ");
            });

        // Example: Coloring countries dynamically
        function colorCountries(countryData) {
            svg.selectAll("path")
                .attr("fill", d => {
                    const value = countryData[d.properties.name];
                    return value ? colorScale(value) : "lightgray";
                });
        }

        const countryData = {};

        // Example: Map country names to data values
        data.filter(d => d.year === year).forEach(d => {
            countryData[d["Country name"]] = d["Life Ladder"];
        });

        console.log("Country data:", countryData);

        // Apply colors to countries
        colorCountries(countryData);

    } catch (error) {
        console.error("Error loading or rendering the map:", error);
    }
}

// Call the function to draw the map
async function main() {
    const data = await loadData();
    if (data.length === 0) return;
    console.log("Data loaded succesfully:", data);

    d3.select("#year").on("change", function() {
        const year = d3.select(this).property("value");
        d3.select("#world-map").selectAll("*").remove(); // Clear previous map
        drawWorldMap(data, +year);
    });

    d3.select("#world-map").selectAll("*").remove(); // Clear previous map
    drawWorldMap(data, 2023);


}

main();