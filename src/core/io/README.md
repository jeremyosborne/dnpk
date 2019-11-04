# Low level data read / write / remove

Whatever data we persist will go through here.

* All data objects read or written will [de]serialized via `JSON.parse`/`JSON.stringify`.
* Data is keyed by a relative path.
* The caller should never need to know if this is a file system write, an HTTP request, a DB insert, etc.
* Whatever backing system we put into place will need to be able to handle key:value style storage and the app will need to be organized to support unique-enough keys for the scope of our needs.

## TODO

* First round of code is meant to hide calls to `fs` and prevent that from creeping into other spots of the application for now, as current plans want both file system storage as well as TCP/IP based storage (likely HTTP, maybe WebSockets). When we add in the socket style communication, this will need to be refactored in ways that probably does affect existing public usage, but the refactoring should be minimal.
