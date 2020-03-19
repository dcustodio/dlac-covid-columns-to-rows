# COVID19 Data from columns to rows

> gets data from [2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19) and writes new CSV files adding a new row per day/country

## Running

Run it as any NodeJS program:

`node index.js`

This will create 6 files: 
 - 3 files (deaths.csv, confirmed.csv, recovered.csv) from the Novel Covid-19 Data repository
 - 3 files (deaths-rows.csv, confirmed-rows.csv, recovered-rows.csv) with the transformed data. 

## Example output

`deaths-rows.csv`
```
date, Province/State, Country/Region, Lat, Long, deaths
2020-01-22T00:00:00+01:00, Hubei, China, 30.9756, 112.2707, 17
2020-01-23T00:00:00+01:00, Hubei, China, 30.9756, 112.2707, 17
2020-01-24T00:00:00+01:00, Hubei, China, 30.9756, 112.2707, 24
2020-01-22T00:00:00+01:00, , Thailand, 15, 101, 0
2020-01-23T00:00:00+01:00, , Thailand, 15, 101, 0
2020-01-24T00:00:00+01:00, , Thailand, 15, 101, 0
```
