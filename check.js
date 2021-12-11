const fs = require('fs');
const path = require('path');

// Check consistency
function consistencyCheck() {
  // Blockchain folder should have 1 or 2 sub-folders
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

    if (o.length < 1 || o.length > 2)
      throw new Error(
        'Invalid number of sub-folders: [expected 1 or 2 sub-folders]'
      );

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