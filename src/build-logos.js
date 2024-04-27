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


fs.readdir('dist/images/logos', (err, files) => {
    if (err) {
        console.error("Error reading directory:", err);
        return;
    }
    const logoDict = {};
    files.forEach(filename => {
        const [name, ext] = filename.split('.');
        logoDict[name] = ext;
    });

    writeFile('dist/logos.js', 'export const logos = ' + JSON.stringify(logoDict));

});