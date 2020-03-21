# COVID19 Data from columns to rows

> gets data from [2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19) and writes new CSV files adding a new row per day/country


I uploaded the CSV files to [Viur](https://www.viurdata.com) to create an [Interactive dashboard](https://covid.viurdata.com/#/public/0dd16158-451d-4dbe-8d8e-51e2544489e7?Country=Portugal&Country=Spain&Country=France&Country=Belgium&Country=Netherlands&Country=Germany&Country=Italy)

![Dashboard](https://github.com/dcustodio/dlac-covid-columns-to-rows/blob/master/dashboard-20-03-2020.png?raw=true)

## Running

Run it as any NodeJS program:

`node index.js`

This will create 6 files: 
 - 3 files (deaths.csv, confirmed.csv, recovered.csv) from the Novel Covid-19 Data repository
 - 3 files (deaths-rows.csv, confirmed-rows.csv, recovered-rows.csv) with the transformed data. 

`node index.js --from 19-03-2020`

This will create 3 files with the records from that day (included) onwards: 
 - 3 files (deaths-19-03-2020rows.csv, confirmed-19-03-2020rows.csv, recovered-19-03-2020rows.csv) with the transformed data. 

`node index.js --local`

Once you got the main files (updated every day) you can just use the local versions using the `--local` flag.

## Example output

`deaths-rows.csv`
```
date,Province/State,Country/Region,Lat,Long,deaths
16-03-2020;"";"Korea, South";36;128;75
17-03-2020;"";"Korea, South";36;128;81
18-03-2020;"";"Korea, South";36;128;84
16-03-2020;"";"Thailand";15;101;1
17-03-2020;"";"Thailand";15;101;1
18-03-2020;"";"Thailand";15;101;1
```
