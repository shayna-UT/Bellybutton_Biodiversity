// Dynamically Generate Dropdown Menu Items
function init() {

    // Select the dropdown menu with id of "selDataset"
    // and assign the dropdown menu to the variable "selector"
    var selector = d3.select("#selDataset");
  
    // Read the data from samples.json & assign entire file data to argument "data"
    d3.json("samples.json").then((data) => {
      
      // Assign the names array (ID#s) inside the data object to a variable
      var sampleNames = data.names;
      
      // forEach element in the names array (aka forEach ID), 
      sampleNames.forEach((sample) => {
        selector
          // a dropdown menu option is appended,
          .append("option")
          // the text of each dropdown menu option is the ID,
          .text(sample)
          // the value property is also assigned the ID
          .property("value", sample);
      });
    });
};

// Call the function
init();

// When the value of the menu option is changed to a "newSample" (aka new ID#):
function optionChanged(newSample) {

    // populate the demographic info panel with that volunteer's info 
    buildMetadata(newSample);

    // displaye the top 10 bacterial species (OTUs) with a bar chart
    buildCharts(newSample);
};

// When the dropdown menu option is selected, the ID# is passed in as "sample"
function buildMetadata(sample) {

    // Read the data from samples.json & assign entire file data to argument "data"
    d3.json("samples.json").then((data) => {
        // Assign the metadata array inside the data object to a variable
        var metadata = data.metadata;
        // Filter for an object in the array whose id property matches the ID#
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        // Since filter() returns an array, assign the object (first item) to a variable
        var result = resultArray[0];
        // Select the demographic info panel div & assign it to a variable
        var PANEL = d3.select("#sample-metadata");
        // Ensure the contents of the panel are cleared when another ID# is chosen
        PANEL.html("");
        // Append H6 heading & print the demographic data of that volunteer to panel
        Object.entries(result).forEach(([key, value]) => {
            //console.log(key + ": " + value);
            PANEL.append("h6").text(key.toUpperCase() + ": " + value);
          });
    });
};

// Create a horizontal bar chart to display the top 10 OTUs found in that individual
function buildCharts(sample){

    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        var sampleObj = sampleArray[0];
        console.log(sampleObj);

        var sampleValues = sampleObj.sample_values;
        var sampleOtuId = sampleObj.otu_ids;
        var sampleOtuIdName = [];
        for (var i = 0; i < sampleOtuId.length; i++){
            sampleOtuIdName[i] = "OTU " + sampleOtuId[i];
        };
        var sampleOtuLabel = sampleObj.otu_labels;

        var bacteriaObj = [];
        for (var i = 0; i < sampleValues.length; i++){
            bacteriaObj.push({
                value: sampleValues[i],
                id: sampleOtuIdName[i],
                idNumber: sampleOtuId[i],
                label: sampleOtuLabel[i]
            });
        };
        console.log(bacteriaObj);

        var sortedBacteria = bacteriaObj.sort((sample1, sample2) => sample1.vaue - sample2.valaue);
        var topTenBacteria = sortedBacteria.slice(0,10);
        console.log(topTenBacteria);

        // Build bar chart
        var trace1 = {
            x : topTenBacteria.map((topTenBacteria) => topTenBacteria.value),
            y : topTenBacteria.map((topTenBacteria) => topTenBacteria.id),
            type : "bar",
            orientation: "h",
            text: topTenBacteria.map((topTenBacteria) => topTenBacteria.label)
        };

        var layout1 = {
            title: "Top 10 OTUs Found in Test Subject",
            xaxis: {
                title: "Sample Value"
            },
            yaxis: {
                title: "OTU ID",
                autorange: 'reversed'
            },
        };

        Plotly.newPlot("bar", [trace1], layout1);

        // Build Bubble Chart
        var bubbleSize = bacteriaObj.map((bacteriaObj) => bacteriaObj.value);
        //var desiredMaxMarkerSize = 40;

        var trace2 = {
            x : bacteriaObj.map((bacteriaObj) => bacteriaObj.idNumber),
            y : bacteriaObj.map((bacteriaObj) => bacteriaObj.value),
            text: bacteriaObj.map((bacteriaObj) => bacteriaObj.label),
            mode: 'markers',
            marker: {
                color: bacteriaObj.map((bacteriaObj) => bacteriaObj.idNumber),
                colorscale: "Rainbow",
                size: bubbleSize,
                sizemode: "diameter",
                sizeref: 2,
                //sizemode: "area",
                //sizeref: 2.0 * Math.max(bubbleSize) / (desiredMaxMarkerSize ** 2),
                sizemin: 5
            }
        };

        var layout2 = {
            //title: "Bubble Chart",
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            }
        };

        Plotly.newPlot("bubble", [trace2], layout2);

        // Build a Gauge for washing frequency
        var trace3 = {
            domain: {x: [0,9], y: [0,9]}
        };

        Plotly.newPlot("gauge", [trace3]);
    });

};