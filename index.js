const fetch = require('node-fetch')
const ms = require('ms')

let data = []

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  return data
}

// cache data now and every X ms
cacheData()
setInterval(cacheData, ms('15m'))

function log(text) {
  return slack(text, 'T0CAQ00TU/B3BTWAJLR/Lyo5DjtFTFILfRPfUAa5yLoQ')
}

function logError(text) {
  return slack(text, 'T0CAQ00TU/B3D9078A3/hlmwh17yhjGztTKmBzCQG7lV')
}

function slack(text, id) {
  fetch(`https://hooks.slack.com/services/${id}`, {
    method: 'POST',
    body: JSON.stringify({text})
  })
}

function cacheData() {
  const start = Date.now()
  fetch('https://api.github.com/repos/zeit/now-cli/releases/latest', {
    headers: {
      Accept: 'application/vnd.github.preview'
    }
  })
  .then(res => {
    if (res.status !== 200) {
      return logError('Non-200 response code from GitHub: ' + res.status)
    }
    return res.json()
  })
  .then(data_ => {
    if (!data_) {
      return
    }
    data = data_

    log(`Re-built now releases cache. ` +
        `Elapsed: ${(new Date() - start)}ms`)
  })
  .catch(err => {
    logError('Error parsing response from GitHub: ' + err.stack)
  })
}
