const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const executeCpp = require('./executeCode');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/run', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const output = await executeCpp(code);
    res.json({ output });
  } catch (err) {
    res.json({ error: err });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`⚙️  Compiler server running at http://localhost:${PORT}`);
});
