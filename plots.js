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
})};

// Call the function
init();

// When the value of the menu option is changed to a "newSample" (aka new ID#):
function optionChanged(newSample) {

    // populate the demographic info panel with that volunteer's info 
    buildMetadata(newSample);
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
            console.log(key + ": " + value);
            PANEL.append("h6").text(key.toUpperCase() + ": " + value);
          });
    });
};