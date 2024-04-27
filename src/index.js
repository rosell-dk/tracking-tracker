

const fs = require('fs');

function writeFile(outputPath, content) {
    fs.writeFile(outputPath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JavaScript file:', err);
            return;
        }
        console.log("JavaScript file " + outputPath + " has been created successfully");
    });
}

fs.readFile('src/trackerdb.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    try {
        const trackerDb = JSON.parse(data);

        delete trackerDb["organizations"];
        delete trackerDb["filters"];
        for (pattern in trackerDb.patterns) {
            delete trackerDb.patterns[pattern]["ghostery_id"];
            delete trackerDb.patterns[pattern]["domains"];
        }

        writeFile('dist/trackerdb.js', 'export const trackerDb = ' + JSON.stringify(trackerDb));
        

    } catch (err) {
        console.error('Error parsing JSON data:', err);
    }
});
