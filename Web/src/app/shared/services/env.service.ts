export class EnvService {

    // The values that are defined here are the default values that can
    // be overridden by env.js
  
    public rootUri = "";
    public tenant = "";
    public clientId = "";
    //public postLogoutRedirectUri = "";
    //public cacheLocation = "";
    public redirectUri = "";
    public resource = "";
    public configEnv = "";
    public endpoints = "";

    constructor() {
      const browserWindow = window || {};
      const browserWindowEnv = browserWindow['__env'] || {};
    
      // Assign environment variables from browser window to env
      // In the current implementation, properties from env.js overwrite defaults from the EnvService.
      // If needed, a deep merge can be performed here to merge properties instead of overwriting them.
      for (const key in browserWindowEnv) {
        if (browserWindowEnv.hasOwnProperty(key)) {
          this[key] = window['__env'][key];
        }
      }
    }
  
  }