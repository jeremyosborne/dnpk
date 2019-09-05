# Run time configuration

Provides environment agnostic access to run time configuration passed into the application via the environment.

When running simulations in node.js this will wrap `process.env`.

When running in a browser, this will look for an object on `window.DNPK_RUNTIME_CONFIGURATION`.

A configuration object can also be fed to this module at any time.
