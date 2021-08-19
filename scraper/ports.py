import requests
import pandas as pd
from bs4 import BeautifulSoup
import time
import numpy as np
import random
import logging

def searates(country, country_abr):
    response = requests.get(url='https://www.searates.com/maritime/' + country +'.html',)
    soup = BeautifulSoup(response.content, 'html.parser')
    # This is going to collect all of the ports in the given country
    ports = []
    for tr in soup.find_all('ul')[1:2]:
        tds = tr.find_all('li')
        for x in range ((len(tds))):
            ports.append("%s" % \
            (tds[x].text))

    ports_details = []
    # This is going to go through each port in the given country and collect all of the current port data on searates.com
    for x in range(len(ports)):
        link = ports[x].lower().replace(' ','_')
        link = link.replace('-','_')
        link = link.replace('(','')
        link = link.replace(')','')
        link = link.replace(',','')
        link = link.replace("'",'')
        link = link.replace('/','')
        response = requests.get(url='https://www.searates.com/port/' + link + '_' + country_abr + '.htm',)
        soup = BeautifulSoup(response.content, 'html.parser')
        ports_details.append([ports[x]])
        for tr in soup.find_all('table'):
            tds = tr.find_all('tr')
            for k in range ((len(tds))-1):
                ports_details[x].append("%s" %
                (tds[k+1].text))
        time.sleep(random.uniform(.5, 9.9)) #This is to create a random time inbetween visits to the website to avoid being black/stopped

    col_title = []
    # Give col headers to the csv file.
    if len(ports_details[0]) > 2:
        for x in range(len(ports_details[0])):
            x_split = ports_details[0][x].split(':',1)
            col_title.append(x_split[0])
        col_title[0] = ' Port Name'
    else:
        for x in range(len(ports_details[-1])):
            x_split = ports_details[-1][x].split(':',1)
            col_title.append(x_split[0])
        col_title[0] = ' Port Name'

    # Revomve any redundent information from the csv.
    for x in range(len(ports_details)):
        for k in range(len(ports_details[x])):
            data = ports_details[x][k].split(':',1)
            if len(data)>1:
                ports_details[x][k] = data[1]

    # Creates the data frame for the csv.
    df = pd.DataFrame(ports_details)
    df.columns = col_title

    for x in range(len(df)):
        name = df[' Port Name'][x].split()
        if name[0] == 'Port':
            new_name = ' '.join(name[1:])
            df[' Port Name'][x] = new_name

    df.to_csv(r'../../../../../../scraper/data/ports_vs.csv')

def WPI(country, country_abr):
    # This just pulls the data from the already downloaded PUB150 database that has been exported from an Access Database file to csv file manually saved and exported as WPI_complete.csv
    file = pd.read_csv(r'../../../../../../scraper/WPI_complete.csv')
    df = pd.DataFrame(file)
    df_new = df[df['Country '] == country_abr.upper()]
    df_new.to_csv(r'../../../../../../scraper/WPI_Data.csv')

def combine_data_frames(country, country_abr):
    file1 = pd.read_csv(r'../../../../../../scraper/data/ports_vs.csv')
    file2 = pd.read_csv(r'../../../../../../scraper/WPI_Data.csv')
    df1 = pd.DataFrame(file1)
    df2 = pd.DataFrame(file2)

    # Clearing all of the blank rows from the dataframe
    df2 = df2.dropna(how='all')

    # Creating a Latitude and longitude field in the PUB150 extracted data. This is because it does not list data in a readable long lat format.
    lat = []
    long = []
    df2 = df2.reset_index(drop=True)
    for x in range(len(df2)):
        lat.append('-' +str(df2['Field4'][x]) + ' ' + str(df2['Field5'][x]) + ' ' + str(df2['Combo353'][x]))
        long.append(str(int(df2['Field7'][x])) + ' ' + str(int(df2['Field8'][x])) + ' ' + str(df2['Combo214'][x]))
    df2['Latitude'] = lat
    df2['Longitude'] = long

    # Removing white spaces from the columns
    df1_col = list(df1.columns)
    df2_col = list(df2.columns)
    for x in range(len(df1_col)):
        df1_col[x] = df1_col[x].strip()
    for x in range(len(df2_col)):
        df2_col[x] = df2_col[x].strip()
    df2.columns = df2_col
    df1.columns = df1_col

    # Renaming columns so that they match in both dataframes and can easily be combined
    df2 = df2.rename(columns = {
    '1st Port of Entry' : 'First Port of Entry',
    'ETA Message' : 'ETA Message Required',
    'U.S. Representative' : 'USA Representative',
    'Maximum Size Vessel' : 'Maximum Vessel Size',
    'Overhead Limits' : 'Overhead Limit',
    'Tide.1' : 'Mean Tide',
    '100 Tons Plus' : '100+ Ton Lifts',
    '50-100 Tons' : '50-100 Ton Lifts',
    '25-49 Tons' : '25-49 Ton Lifts',
    '0-24 Tons' : '0-24 Ton Lifts',
    'Fixed' : 'Fixed Cranes',
    'Mobile' : 'Mobile Cranes',
    'Floating' : 'Floating Cranes',
    'Electric Repair' : 'Electrical Repair',
    'Nav Equipment' : 'Navigation Equipment',
    'Repair' : 'Ship Repairs',
    'Railway' : 'Marine Railroad Size',
    'Drydock' : 'Drydock Size'
    })

    df1 = df1.rename(columns = {
    'Local Assist' : 'Local Assistance',
    'Assist' : 'Tug Assistance',
    'Salvage' : 'Tug Salvage',
    'Deratt Cert' : 'SSCC Cert',
    'Radio Tel' : 'Radio Telephone',
    'Med Moor' : 'Med. Moor',
    'Ice' : 'Ice Moor',
    'Beach' : 'Beach Moor',
    })

    for x in range(len(df2['Port Name'])):
        name = df2['Port Name'][x].split()
        if name[0] == 'PORT':
            new_name = ' '.join(name[1:])
            df2['Port Name'][x] = new_name

    # Combining both dataframes into one
    combine = [df1,df2]
    result = pd.concat(combine, ignore_index = True,
                    keys= ['Port Name', 'Publication', 'Chart',
                        'Harbor Size', 'Harbor Type', 'Shelter', 'Tide', 'Swell',
                        'Other', 'Overhead Limit', 'Channel', 'Anchorage', 'Cargo Pier',
                        'Oil Terminal', 'Mean Tide', 'Maximum Vessel Size',
                        'Good Holding Ground', 'Turning Area', 'First Port of Entry',
                        'USA Representative', 'ETA Message Required', 'Compulsory', 'Available',
                        'Local Assistance', 'Advisable', 'Tug Salvage', 'Tug Assistance',
                        'Pratique', 'SSCC Cert', 'Other.1', 'Telephone', 'Telefax', 'Radio',
                        'Radio Telephone', 'Air', 'Rail', 'Wharves', 'Anchor', 'Med. Moor',
                        'Beach Moor', 'Ice Moor', 'Medical Facilities', 'Garbage Disposal',
                        'Degauss', 'Dirty Ballast', 'Fixed Cranes', 'Mobile Cranes',
                        'Floating Cranes', '100+ Ton Lifts', '50-100 Ton Lifts',
                        '25-49 Ton Lifts', '0-24 Ton Lifts', 'Longshore', 'Electrical', 'Steam',
                        'Navigation Equipment', 'Electrical Repair', 'Provisions', 'Water',
                        'Fuel Oil', 'Diesel Oil', 'Deck', 'Engine', 'Ship Repairs',
                        'Drydock Size', 'Marine Railroad Size', 'Latitude', 'Longitude'],
                    sort=False)



    #  Formating the combined data frame so theat the country abr is filled for all ports along with capitalizing all ports for uniform data
    result['Country'] = df2['Country'][0]
    result['Port Name'] = result['Port Name'].str.upper()
    result = result.drop(columns = ['Combo214', 'Combo353', 'Field4', 'Field5', 'Field7', 'Field8',
                                    'Unnamed: 0', 'Index No.', 'Region', 'Ice', 'Telefax'])
    #  Reordering to move the Country abr to the first column
    first_column = result.pop('Country')
    result.insert(0, 'Country', first_column)

    # returns the csv of the combined data
    result.to_csv(r'../../../../../../scraper/data/data_before_clean.csv')
    clean_up(country, country_abr)


#  remove dupliacte port info
def clean_up(country, country_abr):
    file = pd.read_csv(r'../../../../../../scraper/data/data_before_clean.csv')
    df = pd.DataFrame(file)
    df = df.replace(np.nan, '', regex=True)

    # This section is a very roundabout way to check for duplicates and prevent data loss when merging the data frames.
    # It could be quicker but I could not figure out a way to make faster functions work without data loss.

    df = df.replace(r'^\s*$', 'nan', regex=True)
    data =  [[x] for x in df.columns]
    test = []
    for x in range(len(df)):
        w = 0
        k = 0
        name = df['Port Name'][x].split()
        if name[0] == 'PORT':
            name = name[1]
        else:
            name = ' '.join(name)
        while k < len(df):
            name2 = df['Port Name'][k].split()
            if name2[0] == 'PORT':
                name2 = name2[1]
            else:
                name2 = ' '.join(name2)
            if name == name2 and x != k:
                if k not in test:
                    test.append(x)
                    set1 = df.iloc[x]
                    set2 = df.iloc[k]
                    for j in range(len(data)):
                        if set1[j] == set2[j]:
                            data[j].append(set1[j])
                        elif set1[j] == 'nan':
                            data[j].append(set2[j])
                        elif set2[j] == 'nan':
                            data[j].append(set1[j])
                        else:
                            data[j].append(set1[j])
                break
            k+=1
            if k == len(df):
                set1 = df.iloc[x]
                check = set1['Port Name']
                check = check.split()
                if check[-1] == 'HARBOR' or check[-1] == 'HARBOUR':
                    check = ' '.join(check[:-1])
                    if len(data[2]) > 1:
                        for x in data[2]:
                            if check in x:
                                w = 1
                                break
                if w == 1:
                    break
                for j in range(len(data)):
                    data[j].append(set1[j])

    final = pd.DataFrame(data)
    final = final.transpose()
    final.columns = df.columns
    final = final.drop([0])
    final = final.replace('nan', '', regex=True)

    # End of roundabout data loss fix.

    # This section is cleaning the data into a format that was agreed to for the data reporting.
    # These drops are data that at the time were said to be unneccesary however,
    # this program will still scrap the data and drops it here incase at any point in the future it is deemed necessary to have these data points.

    final = final.drop(['Unnamed: 0', 'UN/LOCODE', '800 Number', 'Max Draft', 'ETA Message Required', 'Other', 'Advisable', 'Local Assistance', 'Other.1', 'SSCC Cert', 'Telephone', 'Radio', 'Air', 'Telegraph',
    'Radio Telephone', 'Ice Moor', 'Anchor', 'Beach Moor', 'Electrical Repair', 'Steam', 'Electrical', 'Navigation Equipment', 'Engine', 'Degauss', 'Garbage Disposal', 'Dirty Ballast'], axis = 1)

    # This section is for cleaning data into a uniform standard done through hard coding along with decoding some of the encoded sections of data.

    final['Harbor Size'].replace({
        # HARBOR SIZE
            'L': 'Large',
            'M': 'Medium',
            'S': 'Small'  ,
            'V': 'Very Small'
            }, inplace=True)
    final['Harbor Type'].replace({
        # HARBOR TYPE
            'RT' : 'River Tide Gate' ,
            'LC' : 'Lake or Canal' ,
            'OR' : 'Open Roadstead' ,
            'TH' : 'Typhoon Harbor' ,
            'RN' : 'River Natural',
            'CN' : 'Coastal Natural',
            'CB' : 'Coastal Breakwater',
            'CT' : 'Coastal Tide Gate' ,
            'RB' : 'RIVER BASIN',
            'N' : 'NONE'
                }, inplace=True)

    final['Shelter'].replace({
        # SHELTER AFFORDED
            'E' : 'Excellent',
            'G' : 'Good',
            'F' : 'Fair',
            'P' : 'Poor',
            'N' : 'None'
            }, inplace=True)

    for x in ['Channel','Cargo Pier','Anchorage','Oil Terminal']:
        final[x].replace({
            # FEET
                'A' : '76 - over ft' ,
                'B' : '71 - 75 ft',
                'C' : '66 - 70 ft' ,
                'D' : '61 - 65 ft' ,
                'E' : '56 - 60 ft' ,
                'F' : '51 - 55 ft' ,
                'G' : '46 - 51 ft' ,
                'H' : '41 - 45 ft'  ,
                'J' : '36 - 40 ft'  ,
                'K' : '31 - 35 ft' ,
                'L' : '26 - 30 ft'  ,
                'M' : '21 - 25 ft' ,
                'N' : '16 - 20 ft',
                'O' : '11 - 15 ft',
                'P' : '6 - 10 ft',
                'Q' : '0 - 5 ft'
                }, inplace=True)

    final['Maximum Vessel Size'].replace({
        # MAXIMUM SIZE VESSEL
            'L': 'over 500 feet', #(152.4 meters)
            'M': 'less than 500 feet' #(152.4 meters)
            }, inplace=True)

    final['Ship Repairs'].replace({
        #REPAIRS
            'A' : 'Major', #– Extensive overhauling and rebuilding in well equipped shipyards.
            'B' : 'Moderate', #– Extensive overhauling and rebuilding that does not require drydocking. Suitable drydocking facilities are usually lacking or inadequate.
            'C' : 'Limited', #– Small repair work in independent machine shops or foundries.
            'D' : 'Emergency only',
            'N' : 'None'
            }, inplace=True)

    final['Marine Railroad Size'].replace({
        #Railways
            'S' : 'Up to 200 tons',
            'M' : '201 to 1,000 tons',
            'L' : 'over 1,000 tons',
            ' Small ' : 'Up to 200 tons',
            ' Medium ' : '201 to 1,000 tons',
            ' Large ' : 'over 1,000 tons'
            }, inplace=True)

    final['Drydock Size'].replace({
        # Drydock
            'S' : 'Up to 656 ft', #(200 meters)
            'M' : '657 ft to 984 ft', #(201 to 300 meters)
            'L' : '985 ft and over', #(301 meters and over)
            ' Small ' : 'Up to 656 ft', #(200 meters)
            ' Medium ' : '657 ft to 984 ft', #(201 to 300 meters)
            ' Large ' : '985 ft and over' #(301 meters and over)
            }, inplace=True)

    # Leaving this in incase anyone wants to add Max Draft again
    # final['Max Draft'].replace({
    #     # FEET
    #         '  a ' : '76 - over ft' ,
    #         '  b ' : '71 - 75 ft',
    #         '  c ' : '66 - 70 ft' ,
    #         '  d ' : '61 - 65 ft' ,
    #         '  e ' : '56 - 60 ft' ,
    #         '  f ' : '51 - 55 ft' ,
    #         '  g ' : '46 - 51 ft' ,
    #         '  h ' : '41 - 45 ft'  ,
    #         '  j ' : '36 - 40 ft'  ,
    #         '  k ' : '31 - 35 ft' ,
    #         '  l ' : '26 - 30 ft'  ,
    #         '  m ' : '21 - 25 ft' ,
    #         '  n ' : '16 - 20 ft',
    #         '  o ' : '11 - 15 ft',
    #         '  p ' : '6 - 10 ft',
    #         '  q ' : '0 - 5 ft'
    #         }, inplace=True)

    remove_units = ['Channel','Cargo Pier','Anchorage','Oil Terminal']
    for x in remove_units:
        final[x].replace({
                '  6 - 10 feet 1.8 - 3 meters  ' : '6 -10 ft',
                ' 11 - 15 feet 3.4 - 4.6 meters '   :'11 - 15 ft',
                ' 16 - 20 feet 4.9 - 6.1 meters '   :'16 - 20 ft',
                ' 21 - 25 feet 6.4 - 7.6 meters '   :'21 - 25 ft',
                ' 26 - 30 feet 7.1 - 9.1 meters '   :'26 - 30 ft',
                ' 31 - 35 feet 9.4 - 10 meters '    :'31 - 35 ft',
                ' 36 - 40 feet 11 - 12.2 meters '   :'36 - 40 ft',
                ' 41 - 45 feet 12.5 - 13.7 meters ' : '41 - 45 ft',
                ' 46 - 50 feet 14 - 15.2 meters '   :'46 - 50 ft',
                ' 51 - 55 feet 15.5 - 16 meters '   :'51 - 55 ft',
                ' 61 - 65 feet 18.6 - 19.8 meters ' : '61 - 65 ft',
                ' 71 - 75 feet 21.6 - 22.9 meters ' : '71 - 75 ft',
                ' 76 feet - OVER 23.2m - OVER ' : '76 - over ft'
                }, inplace=True)

    for x in range(len(final['Mean Tide'])):
        data = final['Mean Tide'][x+1].split()
        if len(data)>0:
            final['Mean Tide'][x+1] = data[0]
        else:
            final['Mean Tide'][x+1] = ''

    final_fixes = ['First Port of Entry', 'USA Representative', 'Medical Facilities', 'Turning Area', 'Good Holding Ground', 'Tide', 'Overhead Limit', 'Swell',
    'Compulsory', 'Available', 'Tug Assistance', 'Tug Salvage',	'Pratique',	'Rail',	'Wharves', 'Med. Moor',	'100+ Ton Lifts', '50-100 Ton Lifts',
    '25-49 Ton Lifts', '0-24 Ton Lifts', 'Fixed Cranes', 'Mobile Cranes', 'Floating Cranes', 'Longshore', 'Provisions', 'Fuel Oil',	'Deck',	'Water', 'Diesel Oil']
    for x in final_fixes:
        try:
            final[x].replace({
                    'Y': 'Yes',
                    ' Yes ': 'Yes',
                    'N': 'No'  ,
                    ' No ': 'No',
                    1 : 'Yes',
                    ' 1 ': 'Yes'
                    }, inplace=True)
        except:
            final[x].astype(str).replace({
                    'Y': 'Yes',
                    ' Yes ': 'Yes',
                    'N': 'No'  ,
                    ' No ': 'No',
                    1 : 'Yes',
                    ' 1 ': 'Yes'
                    }, inplace=True)

    # This is to fix encoding errors in the degree symbols and make the pulled data easily readable
    for x in range(len(final['Latitude'])):
        data = final['Latitude'][x+1].strip()
        if len(data) > 0:
            if data[-1] == 'S':
                data = final['Latitude'][x+1].replace("'",'')
                data = data.replace('º','')
                data = data.replace('-','')
                final['Latitude'][x+1] = '-' + data
            else:
                data = final['Latitude'][x+1].replace("'",'')
                data = data.replace('º','')
                data = data.replace('-','')
                final['Latitude'][x+1] = data
        else:
            final['Latitude'][x+1] = '0'

    for x in range(len(final['Longitude'])):
        data = final['Longitude'][x+1].strip()
        if len(data) > 0:
            if data[-1] == 'E':
                data = final['Longitude'][x+1].strip()
                data = data.replace('º','')
                data = data.replace("'",'')
                data = data.replace('-','')
                final['Longitude'][x+1] = data.replace('"','')
            else:
                data = final['Longitude'][x+1].strip()
                data = data.replace('º','')
                data = data.replace("'",'')
                data = data.replace('-','')
                data = data.replace('"','')
                final['Longitude'][x+1] = '-' + data
        else:
            final['Longitude'][x+1] = '0'

    # This section is to give the dd cords. for digital maps
    dd_lat_list = []
    for x in range(len(final['Latitude'])):
        data = final['Latitude'][x+1].strip()
        if data == '0':
            dd_lat_list.append(data)
        else:
            if data[-1] == 'S':
                data = data.replace('S','')
                data = data.replace('-','- ')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[1]) + int(data[2])/60 + int(data[3])/3600
                    dd_lat_list.append(str(data[0]) + str(dd))
                else:
                    dd = int(data[1]) + int(data[2])/60
                    dd_lat_list.append(str(data[0]) + str(dd))
            else:
                data = data.replace('N','')
                data = data.replace('-','- ')
                data = data.split()
                if len(data) > 3:
                    dd = int(data[0]) + int(data[1])/60 + int(data[2])/3600
                    dd_lat_list.append(str(dd))
                else:
                    dd = int(data[0]) + int(data[1])/60
                    dd_lat_list.append(str(dd))

    dd_long_list = []
    for x in range(len(final['Longitude'])):
        data = final['Longitude'][x+1].strip()
        if data == '0':
            dd_long_list.append(data)
        else:
            if data[-1] == 'E':
                data = data.replace('E','')
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
                data = data.split()
                if len(data) > 3:
                    dd = int(data[1]) + int(data[2])/60 + int(data[3])/3600
                    dd_long_list.append(str(data[0]) + str(dd))
                else:
                    dd = int(data[1]) + int(data[2])/60
                    dd_long_list.append(str(data[0]) + str(dd))

    insert = final.columns.get_loc('Longitude')+1
    final.insert(insert, 'DD Lat.', dd_lat_list)
    final.insert(insert+1, 'DD Long.', dd_long_list)

    # Final change and send to csv
    # This header change is to make the headers work with the app.
    new_headers = [
    'country',
    'portName',
    'portAuthority',
    'address',
    'phone',
    'fax',
    'email',
    'latitude',
    'longitude',
    'ddLatitude',
    'ddLongitude',
    'portType',
    'portSize',
    'firstPortofEntry',
    'publication',
    'chart',
    'usaRep',
    'medicalFacilities',
    'harborSize',
    'shelter',
    'maxVesselSize',
    'harborType',
    'turningArea',
    'holdingGround',
    'tide',
    'overheadLimit',
    'swell',
    'channel',
    'cargoPier',
    'meanTide',
    'anchorage',
    'oilTerminal',
    'compulsory',
    'available',
    'tugAssistance',
    'tugSalvage',
    'pratique',
    'rail',
    'wharves',
    'medMoor',
    'hundredTonLifts',
    'fiftyTonLifts',
    'twentyTonLifts',
    'zeroTonLifts',
    'fixedCranes',
    'mobileCranes',
    'floatingCranes',
    'longshore',
    'provisions',
    'fuelOil',
    'deck',
    'water',
    'dieselOil',
    'shipRepairs',
    'marineRailroadSize',
    'drydockSize'
    ]

    final.columns = new_headers

    # This section is to fix some formatting with addresses
    lst = [x for x in final.address]
    for x in range(len(lst)):
        res = []
        if type(lst[x]) == str:
            new_lst = lst[x].split()
            test = [x for x in new_lst]
            # these two for loops from https://www.geeksforgeeks.org/python-add-space-between-potential-words/
            for ele in test:
                temp = [[]]
                for char in ele:

                    # checking for upper case character
                    if char.isupper():
                        temp.append([])

                    # appending character at latest list
                    temp[-1].append(char)

                # joining lists after adding space
                res.append(' '.join(''.join(ele) for ele in temp))
            new_add = ' '.join(res)
            new_add = new_add.replace('  ', ' ')
            new_add = new_add.replace('- ', '-')
            new_add = new_add.replace('G P O', 'GPO')
            new_add = new_add.replace('P O', 'PO')
            new_add = new_add.strip()
            final.address[x+1] = new_add
        else:
            final.address[x+1] = 'should be blank'

    final = final.reset_index(drop=True)
    final.to_csv(r'../../../../../../scraper/data/port_data/'  + country + '_ports.csv')


def run_ports():
    # List of countries of intrest to scrap though. This is based on the formating of the searates website urls (which requires country name and country code)
    # and the PUB150 database country codes.
    countries = [
        ['australia',	'au'],
        ['bangladesh',	'bd'],
        ['cambodia',	'kh'],
        ['china',	'cn'],
        ['fiji',	'fj'],
        ['germany', 'de'],
        ['hong_kong',	'hk'],
        ['italy', 'it'],
        ['india',	'in'],
        ['indonesia',	'id'],
        ['japan',	'jp'],
        ['malaysia',	'my'],
        ['myanmar',	'mm'],
        ['nauru',	'nr'],
        ['new_caledonia',	'nc'],
        ['new_zealand',	'nz'],
        ['papua_new_guinea', 	'pg'],
        ['philippines',	'ph'],
        ['samoa',	'ws'],
        ['solomon_islands',	'sb'],
        ['south_korea',	'kr'],
        ['sri_lanka',	'lk'],
        ['taiwan',	'tw'],
        ['thailand',	'th'],
        ['tonga',	'to'],
        ['tuvalu',	'tv'],
        ['united_kingdom', 'gb'],
        ['vanuatu',	'vu'],
        ['vietnam',	'vn']
        ]

    errors = []
    for x in range(len(countries)):
        try:
            searates(countries[x][0], countries[x][1])
            WPI(countries[x][0], countries[x][1])
            combine_data_frames(countries[x][0], countries[x][1])
        except Exception as e:
            error_log = 'Failed to update ' + str(countries[x][0]) + ' because of ' + str(e)
            logging.error('Failed to update ' + str(countries[x][0]) + ' because of ' + str(e))
            errors.append(error_log)

    # This is to tell the user which countries ran into errors and did not run completely.
    # Most often the reason this will cause errors is because of being rejected from the website.
    with open(r'../../../../../../scraper/data/port_errors.txt', 'w') as f:
        f.write('Encountered errors with the following countries please run again with only the following countries. \n' + '\n'.join(errors))

if (__name__ == '__main__'):
    run_ports()
