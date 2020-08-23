// Dynamically Generate Dropdown Menu Items
function init() {

    // Select the dropdown menu with id of "selDataset"
    // and assign the dropdown menu to the variable "selector"
    var selector = d3.select("#selDataset");
  
    // Read the data from samples.json & assign entire file data to argument "data"
    d3.json("samples.json").then((data) => {
      
      // Assign the names array (ID#s) inside the data object to a variable
      var sampleNames = data.names;
      console.log("Welcome!")
      
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
        // Assign the samples array inside the data object to a variable
        var sampleData = data.samples;
        // Filter for an object in the array whose id property matches the ID#
        var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample);
        // Since filter() returns an array, assign the object (first item) to a variable
        var sampleObj = sampleArray[0];
        //console.log(sampleObj);

        // Assign the sample_values array insinde the sampleObj to a variable
        var sampleValues = sampleObj.sample_values;
        // Assign the otu_ids array insinde the sampleObj to a variable
        var sampleOtuId = sampleObj.otu_ids;
        // Add "OTU" infront of each otu_id number & assign to a variable
        var sampleOtuIdName = [];
        for (var i = 0; i < sampleOtuId.length; i++){
            sampleOtuIdName[i] = "OTU " + sampleOtuId[i];
        };
        // Assign the otu_labels array insinde the sampleObj to a variable
        var sampleOtuLabel = sampleObj.otu_labels;

        // Add the key-value pairs for each bacteria in Test Subject to bacteriaObj
        var bacteriaObj = [];
        for (var i = 0; i < sampleValues.length; i++){
            bacteriaObj.push({
                value: sampleValues[i],
                id: sampleOtuIdName[i],
                idNumber: sampleOtuId[i],
                label: sampleOtuLabel[i]
            });
        };
        //console.log(bacteriaObj);

        // Ensure bacteriaObj has been sorted based on most samples values in descending order
        var sortedBacteria = bacteriaObj.sort((sample1, sample2) => sample1.vaue - sample2.valaue);
        // Slice the sortedBacteria to only include top 10 (most present) samples
        var topTenBacteria = sortedBacteria.slice(0,10);
        //console.log(topTenBacteria);

        // Build bar chart of top 10 bacteria samples:
        var trace1 = {
            x : topTenBacteria.map((topTenBacteria) => topTenBacteria.value),
            y : topTenBacteria.map((topTenBacteria) => topTenBacteria.id),
            type : "bar",
            orientation: "h",
            text: topTenBacteria.map((topTenBacteria) => topTenBacteria.label)
        };

        var layout1 = {
            title: { text: "Top 10 OTUs Found in Test Subject", font: {size: 20} },
            xaxis: {
                title: "Sample Value"
            },
            yaxis: {
                title: "OTU ID",
                autorange: 'reversed'
            },
        };

        Plotly.newPlot("bar", [trace1], layout1);

        // Build Bubble Chart for all bacteria samples collected in Test Subject:
        var bubbleSize = bacteriaObj.map((bacteriaObj) => bacteriaObj.value);

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
                sizemin: 5
            }
        };

        var layout2 = {
            title: { text: "Bacteria Inside Test Subject's Bellybutton", font: {size: 20} },
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Value"
            }
        };

        Plotly.newPlot("bubble", [trace2], layout2);

        // Build a Gauge for bellybutton washing frequency
        var sampleMetadataObj = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
        var wfreq = sampleMetadataObj.wfreq; // washing frequency of bellybutton for that Test Subject
        //console.log(wfreq);

        var trace3 = {
            domain: { x : [0, 9], y : [0, 9] },
            value: wfreq,
            title: { text: "Scrubs per Week", font: {size:18} },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9], tickwidth: 2, tickmode: "array", tickvals: [0,1,2,3,4,5,6,7,8,9] },
                bar: {color: "antiquewhite"},
                borderwidth: 2,
                steps: [
                  { range: [0, 1], color: "aquamarine"},
                  { range: [1, 2], color: "mediumturquoise"},
                  { range: [2, 3], color: "darkcyan"},
                  { range: [3, 4], color: "mediumspringgreen"},
                  { range: [4, 5], color: "mediumseagreen"},
                  { range: [5, 6], color: "seagreen"},
                  { range: [6, 7], color: "plum"},
                  { range: [7, 8], color: "orchid"},
                  { range: [8, 9], color: "darkorchid"}
                ]}
        };

        var layout3 = {
            title: { text: "Bellybutton Wash Frequency", font: {size: 20} },
            width: 430,
            height: 400
        };

        Plotly.newPlot("gauge", [trace3], layout3);
    });
};