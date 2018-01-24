const { Observable } = require('rxjs')
const moment = require('moment')
const numeral = require('numeral')
const request = require('request-promise')

const getRecentTransaction = (options) => {
  return Observable
    .interval(options.frequency)
    .concatMap(count => Observable
      .fromPromise(request({
        uri: 'https://api.bithumb.com/public/recent_transactions/xrp',
        qs: {
          count: 100
        },
        json: true
      }))
    )
    .takeWhile(res => res.data.length !== 0)
    .mergeMap(res => Observable.from(res.data))
    .filter(data => numeral(data.units_traded).value() >= options.watchValue)
    .map(data => {
      data.transaction_date = moment(data.transaction_date).format('LLLL')
      return data
    })
    .subscribe({
      next: result => console.info('NEXT\r\n', result),
      error: result => console.error('ERROR\r\n', result)
    })
}

// frequency = API call interval in miliseconds
getRecentTransaction({
  frequency: 1000,
  watchValue: 5000
})
