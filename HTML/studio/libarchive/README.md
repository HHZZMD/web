# libarchive.js runtime assets

These files are vendored from `libarchive.js@2.0.2` so the browser can load the
WASM archiver from a stable same-origin path:

- `worker-bundle.js`
- `libarchive.wasm`

`libarchive.js` is MIT licensed; libarchive itself is BSD-2-Clause.
Source: https://github.com/nika-begiashvili/libarchivejs

The ZIP writer uses the upstream ZIP format + GZIP filter workaround documented
in `src/export/zip.ts` and then unwraps the gzip envelope in the browser.
