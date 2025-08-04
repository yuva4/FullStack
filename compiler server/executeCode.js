const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');

const executeCpp = (code) => {
  return new Promise((resolve, reject) => {
    const fileId = uuid();
    const filePath = path.join(__dirname, `temp/${fileId}.cpp`);
    const outputPath = `${filePath}.out`;

    fs.writeFileSync(filePath, code);

    // First compile the code
    exec(`g++ "${filePath}" -o "${outputPath}"`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return reject(stderr);
      }

      // Then run the compiled output
      exec(`"${outputPath}"`, (runErr, runOut, runErrOut) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

        if (runErr) {
          return reject(runErrOut);
        }

        resolve(runOut);
      });
    });
  });
};

module.exports = executeCpp;
