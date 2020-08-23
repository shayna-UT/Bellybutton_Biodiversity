# Bellybutton_Biodiversity

The human body is a source for thousands of types of bacteria, and each part of the body can harbor a different bacteria species. In patricular, we are interested in bacteria found in the bellybutton. Since the bacteria found in one individual will vary from the next, navels of different people from across the country have been sampled. Each volunteer (test subject) has also been assigned an ID number to help maintain anonymity. Using the results of the data collected (found in samples.json), a dashboard has been created for easy access of the results. When each ID number is selected, the participant's demographic information and the bacteria species living in their navel are diplayed. 

For reference, the data is structured as an object that contains 3 keys at the top level: metadata, names, and samples. 
- The metadata array contains the details associated with each volunteer, such as age, location, ethnicity, ID number, and weekly washing frequency of the bellybutton. This information can be found in the Demographic Information Panel. 
- The names array consists of all the ID numbers of the volunteers. 
- The samples array contains the following for each volunteer:
  - id: identifies the ID number of the volunteer
  - otu_id: OTU, or Operational Taxonomic Unit, refers to the species / bacteria type
  - sample_value: the number of samples present for that particular bacteria type 
  - otu_label: the corresponding species name for each bacterial ID

Take a look at the dashboard.
Choose the ID number of the Test Subject you are intersted in and watch the corresponding data be dispalyed.  
