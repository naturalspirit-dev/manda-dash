# M&A Dashboard

## The Pacific Maritime & Aviation Dashboard

<img src="xforce-logo.jpg"
     alt="X-Force logo"
     style="
      margin-right: 10px;
      width: 200px;
      height: 80px;
      " />

**Version 1.0.0**

A React app that uses a Python bot to gather the latest open source data on ports and airfields from around the Indo-Pacific theatre. This app comes loaded with all the data required to use it. Users can run the bot to scrape the latest data and update the app with the most up-to-date information.

## Demo
Check out our [video](https://www.youtube.com/watch?v=Hib1jKbl0w8)

## Tools Used
- [npm](https://www.npmjs.com/)
- [Node.js](https://nodejs.org/en/)
- [Anaconda](https://www.anaconda.com/products/individual)
- [Meteor](https://www.meteor.com/)
- [MongoDB](https://www.mongodb.com/)
- [React.js](https://reactjs.org/)
- [Semantic UI React](https://react.semantic-ui.com/)


## Installation
First, [install Meteor](https://www.meteor.com/developers/install).

Then clone the repository, and cd into the /app directory of your local copy of the repo, and install with:
```
    $ meteor npm install
```

Once the libraries are installed, you can run the application with:
```
    $ meteor npm run start
```
After running the start script for the first time, it will initialize the Mongo database with pre-scraped data for quick use.

If all goes well, the application will appear at http://localhost:3000.

## Adding your API key (required for satellite map card)
In order for the map card to work, you need to provide it with a Google Maps Embed API key. Follow [this guide](https://developers.google.com/maps/documentation/embed/get-api-key) to create, and restrict your key.
Then, in the main directory manda-dash/, you must create a folder named /config with one file: settings.json. Copy and paste this into settings.json, providing your API key (its recommended you provide http-refferers, and Google Maps embed API restrictions):
```
{
    "GoogleMaps": {
    "appId": "Google Maps Card",
    "key": "YOUR API KEY",
    "restrictions": {
      "source": "http-refferers",
      "api": "Google Maps Embed API"
    }
  }
}
```

## Python Web Scraper Bot
Scrapes data from open sources like searates.com and skyvector.com. Maritime data is collected from the PUB150 database.

Errors from the scraper are written to /scraper/data

For more information on the scraper, including updating and adding records to the database, please check out the scraper README in the /scraper directory.

## Contributors
- Lead Developer: Joseph Palma
    - [Github](https://github.com/josephpalma)
    - [LinkedIn](https://www.linkedin.com/in/joseph-palma-3681b5133/)
- Data Scientist: Matthew Ptucha
    - [Github](https://github.com/ptucham)
    - [LinkedIn](https://www.linkedin.com/in/matthew-ptucha/)
- Contributing Support: Bede Fulton
    - [Github](https://github.com/bedefulton)

## How to Contribute
If you are a Javascript or Python developer, consider looking at our open issues.

You may open a PR if you think you can make meaningful contributions to the data set, functionality, or the applications functional optimization.

## Acknowledgements
We'd like to acknowledge Major Ross, Ms. Dubie, Jessica, Emily, and everyone at the Marine Corps Pacific Command (MARFORPAC) who helped our team during this project. A huge thank you to NSIN for giving us this opportunity.

## License
This software is licensed as-is by MIT. Please check out the LISCENSE file for more information.
