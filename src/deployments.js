/**
 * Probot context of the triggered event
 * @param {import('probot').Context} context
 */
const deployments = async (context) => {
  // @TODO need to expose "app" from prev. call
  // app.log.info(context.payload)

  const res = await context.octokit.repos.createDeployment(
    context.repo({
      ref: context.payload.pull_request.head.ref,
      task: "deploy",
      auto_merge: true,
      required_contexts: [],
      payload: {
        schema: "rocks!",
      },
      environment: "staging",
      description: "My Probot App's first deploy!",
      transient_environment: false,
      production_environment: false,
    })
  )

  // bot should get the user's deployment config from own cloud platform 
  const buildFilePath = 'docker-compose.yml'
  const buildFile = await context.octokit.repos.getContent({
    path: buildFilePath,
    ref: context.payload.pull_request.head.ref
  })
  // do something with that... eg. "docker-compose up -d" on own cloud platform

  // get status from own cloud platform and report it on github
  const deploymentId = res.data.id
  await context.octokit.repos.createDeploymentStatus(
    context.repo({
      deployment_id: deploymentId,
      state: "success", // The state of the status. Can be one of error, failure, inactive, pending, or success
      log_url: "https://example.com", // The log URL to associate with this status. This URL should contain output to keep the user updated while the task is running or serve as historical information for what happened in the deployment.
      description: "My Probot App set a deployment status!", // A short description of the status.
      environment_url: "https://example.com", // Sets the URL for accessing your environment.
      auto_inactive: true, // Adds a new inactive status to all prior non-transient, non-production environment deployments with the same repository and environment name as the created status's deployment. An inactive status is only added to deployments that had a success state.
    })
  )
}

module.exports = deployments
