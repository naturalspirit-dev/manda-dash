# Welcome to the Scraper!

These three python files (ports.py, airfields.py, and run.py) come together to form a data collection and cleaning program. The ports.py file is collecting all the maritime data for the application, while the airports.py is collecting all the aviation data. They use the requests, random, and BeautifulSoup libraries to scrape data from open sources websites such as searates.com and skyvector.com, for example. Maritime data is collected from the PUB150 database. After all the data has been collected it is placed into data frames using the pandas library. The data is then cleaned by replacing codes used by certain sources. For example, the PUB150 database is written in codes that are explained in a separate pdf file on their website, the decoding has been hard coded into the ports.py file to make replacing the PUB150 database easier once it is updated again. The airports.py will also determine if airfields are capable or handling a C130/C17 airplane. Once all the data has been cleaned in their respective files, they will be sent to csv's in a data folder with the scrapper folder and be labeled with the country name + if it is a port or airfield dataset.
These two files are called from the run.py file. After these two files have finished running datasets will be called into the run.py file to locate the closest airfield. This will look for not only the closest airfield but also the closest C130/C17 capable airfield. This will then add the closest C130/C17 airport to certain ports if the country has airfield data.

## FAQ
### How do I update the PUB150 database?
To update the PUB150 database you will need to go to the [Pub 150 index](https://msi.nga.mil/Publications/WPI) and download the World Port Index Database (MS Access file). you will then need to export it to a csv file with the name "WPI_complete.csv". Once you have the csv file (WPI_complete.csv) you will place it within the scraper folder to replace the WPI_complete file already in there. The reason for using this dataset is to make the addition of countries easier.

### How do I add countries?
To add more ports countries, you will need to open the ports.py file. Once in the file go to the run_ports() function. There is a list of countries currently there. To add a country simply add a county to that list following the same format. To add more airfields, you will first need to check if the countries airfields are available on skyvector.com. Once that you have established that the country data is on skyvector.com you can add the country to the list in the run_airports() function, again following the same format of the list.

### Why isnt my newly added data being displayed in the app?
Quit the app. Run 'meteor reset'. Restart the app. Your data is now in the front end. If teh problem persists this means you formatted the data incorrectly. 

### Is there a way to speed up the scraper?
Currently there are time.sleep() functions that use a float generator to simulate randomness in how often a webpage is visited to avoid anti-crawling systems. The float is to make the visits appear more human because a sleep of an exact interval will still be picked up by certain systems.

### Can I add any data that I want?
Yes. However, this data will need to be in the exact same schema of the other data in this file to work with the database and the front end. So, if you are going to add port data for example, you will need to make sure that you are following the same schema as all other ports, the data field do not need to be filled in but the certain criteria such as country code, port name and latitude and longitude should be filled out at minimum.   

### Is the error logging?
Yes. Error logs can be found within /scraper/data. Once there you will see text files with the name port_errors and airfield_errors. These two files will write any errors that occurred during the most recent scrape. If they are blank then you are go to go!
