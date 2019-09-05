# Run time configuration

Provides environment agnostic access to run time configuration passed into the application via the environment.

When running simulations in Node.js this will wrap `process.env`.

When running in a browser, this will look for an object on `window.DNPK_RUNTIME_CONFIGURATION`.

By design, all values returned from this modules should be assumed to be `strings` or `undefined` due to how env-vars are passed from the environment to the running process. Modules making use of any run time configuration must perform their own type casting if needed.
