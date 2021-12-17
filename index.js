const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();

const port = process.env.PORT || 8760;

router.get('/assets/:id/info', (req, res) => {
  try {
    let result = fs.readFileSync(
      path.join(__dirname, `/blockchains/${req.params.id}/info/info.json`)
    );
    result = JSON.parse(result.toString());
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/assets/:id/image', (req, res) => {
  res.sendFile(
    path.join(__dirname, `/blockchains/${req.params.id}/info/logo.png`)
  );
});

router.get('/assets/tokens/:network/:address/info', (req, res) => {
  try {
    let result = fs.readFileSync(
      path.join(
        __dirname,
        `/blockchains/${req.params.network}/assets/${req.params.address}/info.json`
      )
    );
    result = JSON.parse(result.toString());
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/assets/tokens/:network/:address/image', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      `blockchains/${req.params.network}/assets/${req.params.address}/logo.png`
    )
  );
});

router.get('/assets/tokens/:network/addresses', (req, res) => {
  try {
    const result = fs.readdirSync(
      path.join(__dirname, `blockchains/${req.params.network}/assets`)
    );
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/health', (req, res) => {
  return res.status(200).json({
    url: req.url,
    status: 'HEALTHY'
  });
});

app.use(require('morgan')('dev'));
app.use('/', router);

app.listen(port, () => console.log(`App is running on port ${port}`));
