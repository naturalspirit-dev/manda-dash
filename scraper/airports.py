import requests
import pandas as pd
from bs4 import BeautifulSoup
import time
import random
import logging

def airport_colletion(country_name, abr):
    country = country_name.replace('_', '%20')
    response = requests.get(url='https://skyvector.com/airports/' + country,)
    soup = BeautifulSoup(response.content, 'html.parser')
    # This is going to collect all of the airport regions in the given country
    airports = []
    for tr in soup.find_all("div", class_="view-content")[:1]:
        tds = tr.find_all('a')
        for x in range ((len(tds))):
            airports.append("%s" % \
                (tds[x].text))

    # get the ending link for the regions airports
    air_link = []
    for x in range(len(airports)):
        air_link_correct = airports[x].replace(' ','%20')
        air_link_correct = air_link_correct.replace('?','%3F')
        air_link.append(air_link_correct)

    airports_in_region = []
    # Get each airport name in a region
    for x in range(len(airports)):
        air_link[x] = air_link[x].replace('?', '3F')
        response = requests.get(url='https://skyvector.com/airports/' + country + '/' + air_link[x],)
        soup = BeautifulSoup(response.content, 'html.parser')
        airports_in_region.append([airports[x]])
        for tr in soup.find_all("div", class_="view-content")[:1]:
            tds = tr.find_all('a')
            for k in range ((len(tds))):
                airports_in_region[x].append("%s" % \
                    (tds[k].text))

    air_info_link = []
    ICAO_codes = []
    for x in range(len(airports_in_region)):
        for k in range(len(airports_in_region[x])-2):
            # This was not a super efficient way to do this but it was done to prevent data lose and make sure all the links were working.
            first = airports_in_region[x][k+2].replace(' ', '-')
            second = first.replace('---', ' ')
            second = second.replace('/','-')
            second = second.replace('(','')
            second = second.replace(')','')
            second = second.replace("'",'')
            second = second.replace('.','')
            second = second.replace('Cooma','')  #This is for one airport in Australia
            second = second.replace('Godofredo-PRamos-Principal-Airport', 'Caticlan-Airport') #This is for one in Philippines
            second = second.replace('BReyes', 'B-Reyes') #This is for one in Philippines
            second = second.replace('B U L A', 'Bula') #This is for one in Indonesia
            second = second.replace('---', '-')
            second = second.replace(',', '-')
            second = second.replace('--', '-')
            third = second.split(' ',1)
            if len(third) < 2:
                break
            air_info_link.append('https://skyvector.com/airport/' + third[0] + '/' + third[1].strip())
            ICAO_codes.append(third[0])

    airports_data = []
    for x in range(len(air_info_link)):
        response = requests.get(url=air_info_link[x],)
        soup = BeautifulSoup(response.content, 'html.parser')

        aux = air_info_link[x].split('/', 5)
        aux_name = aux[5].replace('-', ' ')
        airports_data.append([aux_name])

        for tr in soup.find_all("div", class_="aptdata"):
            airports_data[x].append(tr.text)
        time.sleep(random.uniform(.5, 9.9)) #This is to create a random time inbetween visits to the website to avoid being black/stopped

    # clean the airport data for the final data frame that will be sent to csv
    cleaned_info = [[] for x in range(len(airports_data))]
    for x in range(len(airports_data)):
        for k in range(len(airports_data[x])):
            try:
                airports_data[x][k].index('Location')
                if airports_data[x][k].index('Location') >-1:
                    data = airports_data[x][0].replace('Nauru International Airport Airport', 'Nauru International Airport') #One of case of the name being airport twice
                    cleaned_info[x].append(data)

                    split_data = airports_data[x][k].split()
                    lat = 1 + split_data.index('Coordinates:')
                    long = 3 + split_data.index('Coordinates:')
                    for z in [lat,long]:
                        cleaned_info[x].append(split_data[z].replace('°', '.'))
                    break

            except ValueError:
                continue

    for x in range(len(airports_data)):
        for k in range(len(airports_data[x])):
            try:
                airports_data[x][k].index('Operations')
                if airports_data[x][k].index('Operations') >-1:
                    split_data_op = airports_data[x][k].split(':',1)
                    data = split_data_op[1].strip()
                    data = data.replace('Open to the', '')
                    cleaned_info[x].append(data)
                    break

            except ValueError:
                continue

    for x in range(len(airports_data)):
        for k in range(len(airports_data[x])):
            try:
                airports_data[x][k].index('Runway')
                if airports_data[x][k].index('Runway') >-1:
                    pre_split = airports_data[x][k].replace(':', ' ')
                    split_data_run = pre_split.split()
                    surface = 1 + split_data_run.index('Surface')
                    dimension = 1 + split_data_run.index('Dimensions')
                    dimension2 = 3 + split_data_run.index('Dimensions')
                    dime_clean = split_data_run[dimension] + ' x ' + split_data_run[dimension2] + split_data_run[dimension2+1]
                    cleaned_info[x].append(dime_clean)
                    cleaned_info[x].append(split_data_run[surface])
            except ValueError:
                continue

    # This is to set the column names so that they work with the app
    col_names = ['airFieldName', 'latitude', 'longitude','airportUse', 'runwayOneDimensions', 'runwayOneSurface',
              'runwayTwoDimensions', 'runwayTwoSurface', 'runwayThreeDimensions', 'runwayThreeSurface', 'runwayFourDimensions', 'runwayFourSurface']

    df = pd.DataFrame(cleaned_info)

    # This loop is to prevent breaks because the col names have been hard coded above.
    # This loop will have a cut off based on how many run ways the largest airfield has for a given country.
    if len(df.columns) != len(col_names):
        total = len(col_names) - len(df.columns)
        for x in range(total):
            df[str(x)] = ''
    df.columns = col_names

    abr_val = [abr for x in range(len(df))]
    df.insert(0, column='country', value=abr_val)
    df.insert(1, 'icaoCodes', ICAO_codes)
    df.to_csv(r'../../../../../../scraper/data/airports_before_clean.csv')
    clean(country_name)

def clean(country):
    file = pd.read_csv(r'../../../../../../scraper/data/airports_before_clean.csv')
    df = pd.DataFrame(file)

    # This section is to give the dd cords. for digital maps
    dd_lat_list = []
    for x in range(len(df['latitude'])):
        data = str(df['latitude'][x]).strip()
        if data == 'nan':
            dd_lat_list.append('0')
        else:
            if data[0] == 'S':
                data = data.replace('S','')
                data = data.replace('.',' ')
                data = data.replace("'",'')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[0]) + int(data[1])/60 + int(data[2])/3600
                    dd_lat_list.append(str(data[0]) + str(dd))
                else:
                    dd = int(data[0]) + int(data[1])/60
                    dd_lat_list.append('-' + str(dd))
            else:
                data = data.replace('N','')
                data = data.replace('-','- ')
                data = data.replace('.',' ')
                data = data.replace("'",'')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[0]) + int(data[1])/60 + int(data[2])/3600
                    dd_lat_list.append(str(dd))
                else:
                    dd = int(data[0]) + int(data[1])/60
                    dd_lat_list.append(str(dd))


    dd_long_list = []
    for x in range(len(df['longitude'])):
        data = str(df['longitude'][x]).strip()
        if data == 'nan':
            dd_long_list.append('0')
        else:
            if data[0] == 'E':
                data = data.replace('E','')
                data = data.replace('.',' ')
                data = data.replace("'",'')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[0]) + int(data[1])/60 + int(data[2])/3600
                    dd_long_list.append(str(dd))
                else:
                    dd = int(data[0]) + int(data[1])/60
                    dd_long_list.append(str(dd))
            else:
                data = data.replace('W','')
                data = data.replace('-','- ')
                data = data.replace('.',' ')
                data = data.replace("'",'')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[0]) + int(data[1])/60 + int(data[2])/3600
                    dd_long_list.append(str(dd))
                else:
                    dd = int(data[0]) + int(data[1])/60
                    dd_long_list.append('-' + str(dd))

    insert = df.columns.get_loc('longitude')+1
    df.insert(insert, 'ddLatitude', dd_lat_list)
    df.insert(insert+1, 'ddLongitude', dd_long_list)

    # this section will be inserting the links for the weather at the airports
    weather_link = ['https://www.getmetar.com/' + x for x in df.icaoCodes]
    df.insert(len(df.columns),'weatherLink',weather_link)

    # this delete is to remove a useless column.
    del df['Unnamed: 0']
    df.to_csv(r'../../../../../../scraper/data/airfield_data/' + country.lower() +'_airports.csv')


def run_airports():
    # The reason this list is different from the searates list is due to limitations in the avaiable data that skyvector has.
    countries = [
        ['Australia','AU'],
        ['Bangladesh','BD'],
        ['Cambodia','KH'],
        ['China','CN'],
        ['Fiji','FJ'],
        ['Germany', 'DE'],
        ['Hong_Kong','HK'],
        ['Italy', 'IT'],
        ['India','IN'],
        ['Indonesia','ID'],
        ['Japan','JP'],
        ['Malaysia','MY'],
        ['Myanmar','MM'],
        ['Nauru','NR'],
        ['New_Caledonia','NC'],
        ['New_Zealand','NZ'],
        ['Papua_New_Guinea','PG'],
        ['Philippines','PH'],
        ['Samoa','WS'],
        ['Solomon_Islands','SB'],
        ['South_Korea','KR'],
        ['Sri_Lanka','LK'],
        ['Taiwan','TW'],
        ['Thailand','TH'],
        ['Tonga','TO'],
        ['Tuvalu','TV'],
        ['Vanuatu','VU'],
        ['Vietnam','VN']
    ]

    errors = []
    for x in range(len(countries)):
        try:
            airport_colletion(countries[x][0],countries[x][1])
        except Exception as e:
            error_log = 'Failed to update ' + str(countries[x][0]) + ' because of ' + str(e)
            logging.error('Failed to update ' + str(countries[x][0]) + ' because of ' + str(e))
            errors.append(error_log)

    with open(r'../../../../../../scraper/data/airfield_errors.txt', 'w') as f:
        f.write('Encountered errors with the following countries please run again with only the following countries. \n' + '\n'.join(errors))


if (__name__ == '__main__'):
    run_airports()
