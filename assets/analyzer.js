import { versionHash64 } from './hash.js';

export function checkSignature(magicNumber) {
  return magicNumber >>> 16 === 0xc0de;
}

export function findVersions(hash) {
  const candidates = versions.filter(release => release.hash === hash);
  return {
    v8: candidates[0]?.v8,
    node: candidates.filter(v => v.type === 'node'),
    electron: candidates.filter(v => v.type === 'electron'),
  };
}

const versions = await hashVersions();

async function hashVersions() {
  const [nodeVersions, electronVersions] = await Promise.all([
    fetch('https://nodejs.org/dist/index.json').then(res => res.json()),
    fetch('https://releases.electronjs.org/releases.json').then(res =>
      res.json()
    ),
  ]);
  const versions = [];

  nodeVersions.forEach(({ v8, version }) => {
    const hash = versionHash64(...v8.split('.').map(Number));
    versions.push({
      type: 'node',
      version,
      v8,
      hash,
    });
  });

  electronVersions.forEach(({ version, v8, node }) => {
    const hash = versionHash64(...v8.replace(/-.+/, '').split('.').map(Number));
    versions.push({
      type: 'electron',
      version,
      node,
      v8,
      hash,
    });
  });

  return versions;
}
