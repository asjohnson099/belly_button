
function init() {

    // Fetch the JSON data.
    d3.json("samples.json").then((importedData) => {
        var data = importedData.samples[0];
        console.log(importedData)

        var samples = data.sample_values;
        var sliced = samples.slice(0, 10);
        var reversed = sliced.reverse();

        var otunumbers = data.otu_ids;
        var labels = otunumbers.map(row => `OTU ${row}`);
        labels = labels.slice(0, 10).reverse();

        var otulabels = data.otu_labels;
        var text = otulabels.slice(0, 10).reverse();

        var name = data.id;

        // create and display the values for the dropdown menu
        var dropmenu = importedData.names;
    
        d3.selectAll("#selDataset")
            .selectAll("option")
            .data(dropmenu)
            .enter()
            .append("option")
            .html(function(value, index) {
                return `<option value="${index}">${value}</option>`;
              });

        // create and display demographic metadata
        var metadata = importedData.metadata[0];
        buildTable(metadata);

        // create and display data for bubble chart
        bubbleChart(otunumbers, samples, otulabels);

        // create the trace for the bar chart
        var trace1 = {
            x: reversed,
            y: labels,
            text: text,
            name: "Top 10 OTUs",
            type: "bar",
            orientation: "h"
        };

        // data
        var chartData = [trace1];

        // layout
        var layout = {
            title: `Top 10 OTUs for: ${name}`,
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", chartData, layout);
});

};  // end of init function...

function optionChanged(choice) {

    // Fetch the JSON data.
    d3.json("samples.json").then((importedData) => {
        var data = importedData.samples[choice];

        var samples = data.sample_values;
        var sliced = samples.slice(0, 10);
        var reversed = sliced.reverse();

        var otunumbers = data.otu_ids;
        var labels = otunumbers.map(row => `OTU ${row}`);
        labels = labels.slice(0, 10).reverse();

        var otulabels = data.otu_labels;
        var text = otulabels.slice(0, 10).reverse();

        name = data.id;

        // Update demographic metadata
        clearTable();
        var metadata = importedData.metadata[choice];
        buildTable(metadata);

        // Update bubble chart
        bubbleChart(otunumbers, samples, otulabels);

        // Update and restyle the existing plot with id "bar"
        Plotly.restyle("bar", "x", [reversed]);
        Plotly.restyle("bar", "y", [labels]);
        Plotly.restyle("bar", "text", [text]);
        Plotly.relayout("bar", {title:`Top 10 OTUs for: ${name}`});
    });

};  // end of optionChanged function ...

// Create a bubble chart to display sample data.

function bubbleChart(x, y, text) {

    console.log(x);
    console.log(y);
    console.log(text);

    var trace1 = {
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
          color: x,
          size: y
        },
        type: 'scatter'
      };
    
    var data = [trace1];

    var layout = {
        xaxis: {title: {text: 'OTU ID'}},
        showlegend: false,
        width: 1000,
        height: 600
    };

    Plotly.newPlot('bubble', data, layout);

};  // end of bubbleChart function ...


// Create functions to clear metadata table and build metadata table

function clearTable() {
    d3.select("#sample-metadata").selectAll("table").remove("tr");
};

function buildTable(meta) {
    newdata = [
        {index: "id", value: meta.id},
        {index: "ethnicity", value: meta.ethnicity},
        {index: "gender", value: meta.gender},
        {index: "age", value: meta.age},
        {index: "location", value: meta.location},
        {index: "wfreq", value: meta.wfreq},
        {index: "bbtype", value: meta.bbtype}
    ]

    d3.select("#sample-metadata").append("table").selectAll("tr")
    .data(newdata)
    .enter()
    .append("tr")
    .html(function(a) {
        return `<td class="small">${a.index}: </td><td class="small"> ${a.value}</td>`
    });

};  // end of buildTable function ...


// Run the functions: Initial and then dropdown using selectIndex value for display.

init();


