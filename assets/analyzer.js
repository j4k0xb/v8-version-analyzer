import { versionHash64 } from "./hash.js";

export function checkSignature(magicNumber) {
  return magicNumber >>> 16 === 0xc0de;
}

export function findVersions(hash) {
  const candidates = versions.filter((release) => release.hash === hash);
  return {
    v8: [...new Set(candidates.map((v) => v.v8))],
    node: candidates.filter((v) => v.type === "node"),
    electron: candidates.filter((v) => v.type === "electron"),
  };
}

const versions = await hashVersions();

async function hashVersions() {
  const [nodeVersions, electronVersions] = await Promise.all([
    fetch("https://nodejs.org/dist/index.json").then((res) => res.json()),
    fetch("https://releases.electronjs.org/releases.json").then((res) =>
      res.json()
    ),
  ]);
  const versions = [];

  nodeVersions.forEach(({ v8, version }) => {
    const versionParts = v8.split(".").map(Number);
    const hash = versionHash64(...versionParts);
    const reverseHash = versionHash64(...versionParts.reverse());
    versions.push({ type: "node", version, v8, hash });
    versions.push({ type: "node", version, v8, hash: reverseHash });
  });

  electronVersions.forEach(({ version, v8, node }) => {
    const versionParts = v8.replace(/-.+/, "").split(".").map(Number);
    const hash = versionHash64(...versionParts);
    const reverseHash = versionHash64(...versionParts.reverse());
    versions.push({ type: "electron", version, node, v8, hash });
    versions.push({ type: "electron", version, node, v8, hash: reverseHash });
  });

  return versions;
}
