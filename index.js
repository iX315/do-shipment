// Deployments API example
// See: https://developer.github.com/v3/repos/deployments/ to learn more

const deployments = require('./src/deployments')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("🚢 ready to conquer 🌊!")
  app.on(
    ["pull_request.opened", "pull_request.synchronize"],
    deployments
  )
  app.on('release.published', deployments)

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
