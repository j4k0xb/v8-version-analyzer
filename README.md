# v8-version-analyzer

A quick way to get the v8/Node.js/Electron version of a v8-bytecode file, typically produced by [bytenode](https://github.com/bytenode/bytenode).

Electron uses different v8 versions for Chromium and Node.js.
In this case, the bytecode file will have the hash from Chromium's v8 but it is actually built with Node.js's v8.

## Changes of this fork

- Pure JS implementation, no rust/wasm
- Always up-to-date by fetching Node.js/Electron and the corresponding v8 versions

## Credits

- <https://github.com/xcf-t/nv-crack> - The original project
