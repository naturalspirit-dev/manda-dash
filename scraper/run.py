import pandas as pd
import time
import glob
import os
from airports import run_airports
from ports import run_ports

# The purpose of this is to make one run file so only one program is being called to run.
# This also solves the comparison of airports and port cords to find the closest airport to the ports.
def main():
    start = time.time()

    run_ports()
    run_airports()

    countries = [
        'Australia',
        'Bangladesh',
        'Cambodia',
        'China',
        'Fiji',
        'Hong_Kong',
        'India',
        'Indonesia',
        'Japan',
        'Malaysia',
        'Myanmar',
        'Nauru',
        'New_Caledonia',
        'New_Zealand',
        'Pakistan',
        'Papua_New_Guinea',
        'Philippines',
        'Samoa',
        'Solomon_Islands',
        'South_Korea',
        'Sri_Lanka',
        'Taiwan',
        'Thailand',
        'Tonga',
        'Tuvalu',
        'Vanuatu',
        'Vietnam'
    ]

    for k in range(len(countries)):
        # print('Finding closest Airports to Ports in ' + countries[k])
        port_file = pd.read_csv(r'../../../../../../scraper/data/port_data/' + countries[k].lower() +'_ports.csv')
        air_file = pd.read_csv(r'../../../../../../scraper/data/airfield_data/' + countries[k].lower() +'_airports.csv')
        df_port = pd.DataFrame(port_file)
        df_air = pd.DataFrame(air_file)
        
        port_cords = [[] for x in range(len(df_port))]
        for x in range(len(df_port)):
            port_cords[x].append(df_port['ddLatitude'][x])
            port_cords[x].append(df_port['ddLongitude'][x])


        df_air_copy = df_air.copy()
        c130 = [[x, df_air['capableCOneThirtyCSeventeen'][x]] for x in range(len(df_air['capableCOneThirtyCSeventeen']))]

        for x in c130:
            if x[1] == 'No':
                df_air_copy = df_air_copy.drop(x[0])

        df_air_copy = df_air_copy.reset_index()
        air_cords = [[] for x in range(len(df_air_copy))]
        for x in range(len(df_air_copy)):
            air_cords[x].append(df_air_copy['ddLatitude'][x])
            air_cords[x].append(df_air_copy['ddLongitude'][x])
            air_cords[x].append(df_air_copy['airFieldName'][x])


        # This is the block that finds the closest airport to ports.
        airfield = []
        if len(air_cords) > 0:
            for x in range(len(port_cords)):
                # This search algo is from stackoverflow link is below.
                # https://stackoverflow.com/questions/36778269/finding-closest-pair-of-coordinates-from-a-list
                dist = lambda s,d: (s[0]-d[0])**2+(s[1]-d[1])**2
                match = min(air_cords, key=lambda p: dist(p, port_cords[x]))
                airfield.append(match[-1])

            df_port['closestCOneThirtyCSeventeen'] =  airfield

        del df_port['Unnamed: 0']
        df_port.to_csv(r'../../../../../../scraper/data/port_data/' + countries[k].lower() + '_ports.csv')

    # os.remove(r'../../../../../../scraper/WPI_Data.csv')
    # os.remove(r'../../../../../../scraper/data/ports_vs.csv')
    # os.remove(r'../../../../../../scraper/data/data_before_clean.csv')
    # os.remove(r'../../../../../../scraper/data/airports_before_clean.csv')

    end = time.time()
    print(end-start)
    print('complete')

def combine_all_ports():
    path = r'../../../../../../scraper/data/port_data/'
    all_files = glob.glob(path + "/*.csv")

    li = []

    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)
        li.append(df)

    frame = pd.concat(li, sort = False, axis=0,  ignore_index=True)

    del frame['Unnamed: 0']
    frame.to_csv(r'../../../../../../scraper/ports_combined.csv')
    print('complete')

def combine_all_airports():
    path = r'../../../../../../scraper/data/airfield_data/'
    all_files = glob.glob(path + "/*.csv")

    li = []

    for filename in all_files:
        df = pd.read_csv(filename, index_col=None, header=0)
        li.append(df)

    frame = pd.concat(li, sort = False, axis=0,  ignore_index=True)

    del frame['Unnamed: 0']
    frame.to_csv(r'../../../../../../scraper/airports_combined.csv')
    print('complete')

def sort_ports():
    path = r'../../../../../../scraper/data/port_data/'
    all_files = glob.glob(path + "/*.csv")

    for filename in all_files:
        file = pd.read_csv(filename, index_col=None, header=0)
        df = pd.DataFrame(file)
        df = df.sort_values('portName').reset_index(drop=True)
        # del df['Unnamed: 0']
        df.to_csv(str(filename).replace('\\','/'))
    print('complete')

def sort_airfields():
    path = r'../../../../../../scraper/data/airfield_data/'
    all_files = glob.glob(path + "/*.csv")

    for filename in all_files:
        file = pd.read_csv(filename, index_col=None, header=0)
        df = pd.DataFrame(file)
        df = df.sort_values('airFieldName').reset_index(drop=True)
        del df['Unnamed: 0']
        df.to_csv(str(filename).replace('\\','/'))
    print('complete')

if (__name__ == '__main__'):
    main()
    sort_ports()
    sort_airfields()
    combine_all_ports()
    combine_all_airports()

    
