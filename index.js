const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();

const port = process.env.PORT || 8760;

router.get('/assets/:id/info', (req, res) => {
  let result = fs.readFileSync(
    path.join(__dirname, `/blockchains/${req.params.id}/info/info.json`)
  );
  result = JSON.parse(result.toString());
  res.status(200).json({ result });
});

router.get('/assets/:id/image', (req, res) => {
  res.sendFile(
    path.join(__dirname, `/blockchains/${req.params.id}/info/logo.png`)
  );
});

router.get('/assets/bep20/:address/info', (req, res) => {
  let result = fs.readFileSync(
    path.join(
      __dirname,
      `/blockchains/binance/assets/${req.params.address}/info/info.json`
    )
  );
  result = JSON.parse(result.toString());
  res.status(200).json({ result });
});

app.use(require('morgan')('dev'));
app.use('/', router);

app.listen(port, () => console.log(`App is running om port ${port}`));
