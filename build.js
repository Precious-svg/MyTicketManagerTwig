const fs = require('fs-extra');
const Twig = require('twig');

fs.ensureDirSync('dist');

Twig.renderFile('templates/index.twig', { title: 'My Twig Site' }, (err, html) => {
  if (err) throw err;
  fs.writeFileSync('dist/index.html', html);
  console.log('Site built to dist/index.html');
});

