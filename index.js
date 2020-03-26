const lineReader = require('line-reader')
const fs = require('fs')
const moment = require('moment')
const https = require('https')
const argv = require('yargs').argv

const FILES =
{
  confirmed: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  deaths: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  recovered: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv'
}

// --from 19-03-2020
const from = argv.from

if (from && !(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-20\d\d$/.test(from))) {
  console.error('invalid date format. please use DD-MM-YYYY')

  process.exit(1)
}

// --local
const local = typeof argv.local !== 'undefined' && argv.local


// file
const file = argv.file

if (file && !Object.keys(FILES).includes(file)) {
  console.error(`invalid file "${file}". Available files are: ${Object.keys(FILES).join(', ')}`)

  process.exit(1)
}

const writeRowFiles = (name) => () => {
  let lineCount = 0
  let dates
  const OUT_FILENAME = `${name}-${from || ''}rows.csv`
  const stream = fs.createWriteStream(OUT_FILENAME)
  // headers: Province/State,Country/Region,Lat,Long, Date 1, Date 2, ... , Date n
  lineReader.eachLine(`${name}.csv`, function (line, last) {
    // replace line separators because commas are also used in state and country names.
    line = line.replace(/,(?! )/gm, ';')
    const cells = line.split(';')
    const province = addQuotes(cells.shift())
    const country = addQuotes(cells.shift())
    const lat = cells.shift()
    const long = cells.shift()
    // table header
    if (lineCount === 0) {
      dates = cells
      stream.write(`date;${province};${country};${lat};${long};${name}\n`)
    } else {
      // table body
      cells.forEach((value, index) => {
        const cellDate = moment(dates[index], 'M/D/YY').format('DD-MM-YYYY')
        // print dates from (including it)
        if (from) {
          if (moment(cellDate, 'DD-MM-YYYY').isSameOrAfter(moment(from, 'DD-MM-YYYY'))) {
            stream.write(`${cellDate};${province};${country};${lat};${long};${value}\n`)
          }
        } else {
          // print historic
          if (index < cells.length) {
            stream.write(`${cellDate};${province};${country};${lat};${long};${value}\n`)
          }
        }
      })
    }

    lineCount++

    if (last) {
      console.info(`finished ${OUT_FILENAME}`)
      stream.end()
    }
  })
}

Object.keys(FILES).forEach(name => {

  if (typeof file === 'undefined' || name === file) {

    // we don't need to download the files each time
    if (local) {
      console.info(`[local] ${name}`)
      writeRowFiles(name)()
    } else {
      https.get(FILES[name], response => {
        console.info(`[http] ${name}`)
        const file = fs.createWriteStream(`${name}.csv`)
        var stream = response.pipe(file)
        stream.on('finish', writeRowFiles(name))
      })
    }
  }
})

function addQuotes (cell) {
  return cell.startsWith('"') ? cell : `"${cell}"`
}
