// Packages
const fetch = require('node-fetch')
const ms = require('ms')

// This is where we're keeping the cached
// releases in the RAM
const cache = {}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  return cache
}

const slack = (text, id) => {
  fetch(`https://hooks.slack.com/services/${id}`, {
    method: 'POST',
    body: JSON.stringify({text})
  })
}

const isCanary = ({tag_name}) => {
  return tag_name.includes('canary')
}

const log = text => slack(text, process.env.TOKEN_EVENTS)
const logError = text => slack(text, process.env.TOKEN_ALERTS)

const platformFromName = name => {
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

const generateMeta = release => {
  return {
    tag: release.tag_name,
    url: release.html_url,
    assets: release.assets.map(({name}) => ({
      name,
      platform: platformFromName(name),
      url: `https://assets.zeit.co/raw/upload/now-cli/${release.tag_name}/${name}.gz`
    }))
  }
}

const cacheData = async () => {
  const start = Date.now()
  const url = 'https://api.github.com/repos/zeit/now-cli/releases?per_page=100'

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.preview'
    }
  })

  if (response.status !== 200) {
    return logError('Non-200 response code from GitHub: ' + response.status)
  }

  let releases

  try {
    releases = await response.json()
  } catch (err) {
    logError('Error parsing response from GitHub: ' + err.stack)
    return
  }

  const canary = releases.find(item => Boolean(item.prerelease))
  const stable = releases.find(item => !item.prerelease)

  if (canary && isCanary(canary)) {
    cache.canary = generateMeta(canary)
  }

  if (stable && !isCanary(stable)) {
    cache.stable = generateMeta(stable)
  }

  log(`Re-built Now CLI releases cache. ` +
  `Elapsed: ${(new Date() - start)}ms`)
}

// Cache releases now
cacheData()

// ... and every 5 minutes
setInterval(cacheData, ms('5m'))
