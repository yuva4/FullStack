const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirInputs = path.join(__dirname, 'inputs');

// if inputs folder not exist, create it
if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobID = uuid();
    const filename = `${jobID}.txt`;
    const filePath = path.join(dirInputs, filename);

    await fs.writeFileSync(filePath, input);
    return filePath;
};

module.exports = { generateInputFile };
