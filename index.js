const { Observable } = require('rxjs')
const moment = require('moment')
const numeral = require('numeral')
const Ripple = require('./utils/ripple')

// Filter result based on watchValue
const getDailyReport = (watchValue = 100000) => {
  const ripple = Ripple()
  const date = moment().subtract('1', 'days').format()
  const params = {
    uri: `/reports/${date}`,
    qs: {
      limit: 100,
      accounts: true,
      payments: true
    }
  }

  return Observable
    .interval(250)
    .concatMap(count => Observable
      .fromPromise(ripple(params))
      .do(res => { params.qs.marker = res.marker })
    )
    .takeWhile(res => res.count !== 0)
    .mergeMap(res => Observable.from(res.reports))
    .filter(report => numeral(report.total_value).value() > watchValue)
    .subscribe({
      next: result => console.info('NEXT\r\n', result),
      error: result => console.error('ERROR\r\n', result)
    })
}

getDailyReport()
