const request = require('request-promise')

const constructor = () => {
  const req = request.defaults({
    headers: {
      'Content-Type': 'application/json'
    },
    baseUrl: 'https://data.ripple.com/v2',
    json: true
  })

  return req
}

module.exports = constructor
