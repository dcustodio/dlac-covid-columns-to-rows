const lineReader = require('line-reader')
const fs = require('fs')
var moment = require('moment')
const https = require('https')

const FILES =
{
  confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv',
  deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv',
  recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv'
}

Object.keys(FILES).forEach(name => {
  https.get(FILES[name], response => {
    const file = fs.createWriteStream(`${name}.csv`)
    var stream = response.pipe(file)

    stream.on('finish', function () {
      let lineCount = 0
      let dates

      var stream = fs.createWriteStream(`${name}-rows.csv`)
      // headers: Province/State,Country/Region,Lat,Long, Date 1, Date 2, ... , Date n
      lineReader.eachLine(`${name}.csv`, function (line, last) {
        // replace line separators because commas are also used in state and country names.
        line = line.replace(/,(?! )/gm, ';')
        const cells = line.split(';')
        const province = addQuotes(cells.shift())
        const country = addQuotes(cells.shift())
        const lat = cells.shift()
        const long = cells.shift()

        if (lineCount === 0) {
          dates = cells
          stream.write(`date;${province};${country};${lat};${long};${name}\n`)
        } else {
          cells.forEach((value, index) => {
            if (index < cells.length) {
              stream.write(`${moment(dates[index], 'M/D/YY').format('DD-MM-YYYY')};${province};${country};${lat};${long};${value}\n`)
            }
          })
        }

        lineCount++

        if (last) {
          stream.end()
        }
      })
    })
  })
})

function addQuotes (cell) {
  return cell.startsWith('"') ? cell : `"${cell}"`
}
