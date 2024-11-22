console.log("Hello, World!");  // Check if the JavaScript is working

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var result = metadata.filter(sampleObj => sampleObj.id == sample);
    var sampleMetadata = result[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var demographicInfo = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    demographicInfo.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      demographicInfo.append("h5").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var result = samples.filter(sampleObj => sampleObj.id == sample);
    var sampleData = result[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;
    var sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otu_ids, // Set x-axis to otu_ids (bacteria species ids)
      y: sample_values, // Set y-axis to sample_values (count of species)
      text: otu_labels, // Tooltip text will show the label of each species
      mode: 'markers', // Bubble chart uses "markers" as the type
      marker: {
        size: sample_values, // Bubble size will correspond to the sample values
        color: otu_ids, // Color bubbles by otu_id (bacteria)
        colorscale: "Earth" // Nice color scale
      }
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample", // Chart title
      xaxis: { title: "OTU ID" }, // x-axis label
      hovermode: "closest" // Display the hover over tooltip
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var barData = [{
      type: "bar", // Bar chart type
      x: sample_values.slice(0, 10).reverse(), // Top 10 sample values (reversed so biggest bars are at the top)
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Format the otu_ids as "OTU ###"
      text: otu_labels.slice(0, 10).reverse(), // Top 10 labels
      orientation: "h" // Horizontal bar chart
    }];

    var barLayout = {
      title: "Top 10 Bacteria Found", // Chart title
      xaxis: { title: "Sample Value" }, // x-axis label
      yaxis: { title: "OTU ID" } // y-axis label
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;
    console.log("Names: ", data.names); 

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}





// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  console.log("New Sample: ", newSample);
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
