const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const imageDataUri = require('image-data-uri');

const limit = '50mb'; // Raise the default allowable body size
const outDir = 'generated';

const generateImage = (req, res) => {
  const { uri, hash, width, height, targetPixelRatio } = req.body;

  const highDensity = targetPixelRatio === 2 ? '_hi': '';
  const filename = `${hash}_${width}x${height}${highDensity}.png`;
  const filePath = path.join(__dirname, outDir, filename);

  imageDataUri.outputFile(uri, filePath)
    .then(data => res.send({ success: true }));
};

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit }));
app.use(bodyParser.urlencoded({ extended: true, limit }));

app.post('/api/generate', generateImage);

app.listen(port, () => console.log(`Backend listening on port ${port}...`));
