import _ from "lodash";
import configJson from "./config.json"

let configuration = {};
let configJsonOverride = null;

if (process.env.CONFIG_OVERRIDE) {
  try {
    configJsonOverride = require(process.env.CONFIG_OVERRIDE);
  } catch (e) {
    // Do nothing
  }
}

if (configJsonOverride) {
  configuration = _.defaultsDeep(configJsonOverride, configJson);
}

if (process.env.URL_SCHEMA)
  configuration['url_schema'] = process.env.URL_SCHEMA;
if (process.env.BACKEND_HOST)
  configuration['backend_host'] = process.env.BACKEND_HOST;
if (process.env.BACKEND_PORT)
  configuration['backend_port'] = process.env.BACKEND_PORT;

configuration = _.defaultsDeep(configuration, configJson)

configuration['backend_url'] = configuration['url_schema'] + "://" + configuration['backend_host']
  + ":" + configuration["backend_port"]

console.log("Backend: " + configuration['backend_url'] );

export default configuration;
