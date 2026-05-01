# v8-version-analyzer

A quick way to get the v8/Node.js/Electron version of a v8-bytecode file, typically produced by [bytenode](https://github.com/bytenode/bytenode).

## Changes of this fork

- Pure JS implementation, no rust/wasm
- Always up-to-date by fetching Node.js and Electron releases
- Handles [reversed hashes](https://github.com/v8/v8/commit/47f71031cbcf83d28f929bcd7447f2a827ab1405) of v8 12.1.8 and later

## Credits

- <https://github.com/xcf-t/nv-crack> - The original project
