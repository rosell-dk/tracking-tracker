# Updating dist/trackerdb.js

1. Get trackerdb repo  (TODO: why not simply install @ghostery/trackerdb in this repo?)
2. npm install
3. npm run export-json
4. Copy dist/trackerdb.json to this repo (in src) (ps: we should rather move this to vendor...)
5. In this repo: npm run build