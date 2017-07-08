// Packages
const fetch = require('node-fetch')
const ms = require('ms')

let data = []

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  return data
}

// Cache data now and every X ms
cacheData()
setInterval(cacheData, ms('15m'))

function log(text) {
  return slack(text, process.env.TOKEN_EVENTS)
}

function logError(text) {
  return slack(text, process.env.TOKEN_ALERTS)
}

function slack(text, id) {
  fetch(`https://hooks.slack.com/services/${id}`, {
    method: 'POST',
    body: JSON.stringify({text})
  })
}

function platformFromName(name) {
  if (/\.dmg$/.test(name)) {
    return 'macOS DMG'
  } else if (/\.AppImage$/.test(name)) {
    return 'AppImage'
  } else if (/\.rpm$/.test(name)) {
    return 'Fedora/RedHat'
  } else if (/\.deb$/.test(name)) {
    return 'Ubuntu/Debian'
  } else if (/\blinux\b/.test(name)) {
    return 'Linux (glibc)'
  } else if (/\balpine\b/.test(name)) {
    return 'Alpine (musl)'
  } else if (/\bmacos\b/.test(name) || /\bmac\b/.test(name)) {
    if (/\.zip$/.test(name)) {
      return 'macOS Zip'
    }
    return 'macOS'
  } else if (/\.exe$/.test(name)) {
    return 'Windows'
  }
  return 'Others'
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

    data = {
      tag: data_.tag_name,
      url: data_.html_url,
      assets: data_.assets.map(({name}) => ({
        name,
        platform: platformFromName(name),
        url: `https://cdn.zeit.co/releases/now-cli/${data_.tag_name}/${name}`
      }))
    }

    log(`Re-built now releases cache. ` +
        `Elapsed: ${(new Date() - start)}ms`)
  })
  .catch(err => {
    logError('Error parsing response from GitHub: ' + err.stack)
  })
}
