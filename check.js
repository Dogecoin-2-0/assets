/**
 * Do not edit this file.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Check consistency
function consistencyCheck() {
  const mainFolder = 'blockchains';
  const blockchainFolders = fs.readdirSync(path.join(__dirname, mainFolder), {
    withFileTypes: true
  });
  const filteredFolders = blockchainFolders
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const f of filteredFolders) {
    const o = fs
      .readdirSync(path.join(__dirname, mainFolder, f), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Blockchains folder must contain 1 or 2 sub-folders
    assert.ok(
      o.length === 1 || o.length === 2,
      'Invalid number of sub-folders: [expected 1 or 2 sub-folders]'
    );

    // Must include 'info' folder
    assert.ok(o.includes('info'), 'Info folder is necessary');

    // Run check for files in info folder
    const x = fs
      .readdirSync(path.join(__dirname, mainFolder, f, 'info'), {
        withFileTypes: true
      })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    for (const name of x)
      assert.ok(
        ['info.json', 'logo.png'].includes(name),
        `Invalid file name: expected [info.json | logo.png] but found: ${name}`
      );

    const blockchainInfoFile = fs.readFileSync(
      path.join(__dirname, mainFolder, f, 'info', 'info.json')
    );
    const blockchainInfoFileContent = JSON.parse(blockchainInfoFile.toString());

    // JSON must contain necessary properties
    assert.ok(
      'name' in blockchainInfoFileContent,
      'Blockchain info must contain name'
    );
    assert.ok(
      'website' in blockchainInfoFileContent,
      'Blockchain info must contain website'
    );
    assert.ok(
      'symbol' in blockchainInfoFileContent,
      'Blockchain info must contain symbol'
    );
    assert.ok(
      'explorer' in blockchainInfoFileContent,
      'Blockchain info must contain explorer'
    );
    assert.ok(
      'links' in blockchainInfoFileContent,
      'Blockchain info must contain links'
    );

    // JSON properties must be of certain types
    assert.ok(
      typeof blockchainInfoFileContent.name === 'string',
      'Name must be string'
    );
    assert.ok(
      typeof blockchainInfoFileContent.website === 'string',
      'Website must be string'
    );
    assert.ok(
      typeof blockchainInfoFileContent.symbol === 'string',
      'Symbol must be string'
    );
    assert.ok(
      typeof blockchainInfoFileContent.explorer === 'string',
      'Explorer must be string'
    );
    assert.ok(
      Array.isArray(blockchainInfoFileContent.links),
      'Links must be an array'
    );

    for (const obj of blockchainInfoFileContent.links) {
      assert.ok(typeof obj === 'object', 'Link info must be object');
      assert.ok('name' in obj, "Link object must contain 'name' key");
      assert.ok('url' in obj, "Link object must contain 'url' key");
      assert.ok(typeof obj.name === 'string', 'Link name must be string');
      assert.ok(typeof obj.url === 'string', 'Link url must be string');
    }

    if ('chainlinkUSDId' in blockchainInfoFileContent)
      assert.ok(
        typeof blockchainInfoFileContent.chainlinkUSDId === 'string',
        'ChainlinkUSDId must be string'
      );

    // Check is run if one of these folders is named 'assets'
    if (o.includes('assets')) {
      const v = fs
        .readdirSync(path.join(__dirname, mainFolder, f, 'assets'), {
          withFileTypes: true
        })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      for (const address of v) {
        if (!/^[a-z0-9]+$/.test(address))
          throw new Error(
            'Invalid address: [must be alphanumeric & lowercase]'
          );

        const z = fs.readdirSync(
          path.join(__dirname, mainFolder, f, 'assets', address),
          { withFileTypes: true }
        );
        const withDirectories = z.filter((dirent) => dirent.isDirectory());

        if (withDirectories.length !== 0)
          throw new Error('Asset folder must not contain directories');

        const files = z
          .filter((dirent) => dirent.isFile())
          .map((dirent) => dirent.name);

        if (files.length !== 2)
          throw new Error('2 files required but found: ' + files.length);

        for (const file of files) {
          if (!/(png|json)/.test(path.extname(file)))
            throw new Error(
              `Unallowed extension: expected [png | json] but found ${path.extname(
                file
              )}`
            );

          if (!['info.json', 'logo.png'].includes(file))
            throw new Error(
              `Invalid file name: expected [info.json | logo.png] but found: ${file}`
            );
        }
      }
    }
  }
  console.log('Check passed!!');
}

consistencyCheck();
