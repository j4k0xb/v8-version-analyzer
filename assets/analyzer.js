import { versionHash64 } from "./hash.js";

export function checkSignature(magicNumber) {
  return magicNumber >>> 16 === 0xc0de;
}

export function findVersions(hash) {
  const result = { node: [], electron: [] };

  for (const candidate of versions.filter((release) => release.hash === hash)) {
    result[candidate.type].push(candidate);

    if (candidate.type === "electron") {
      const nodeCandidate = versions.find(
        (release) =>
          release.type === "node" && release.version === "v" + candidate.node
      );
      if (nodeCandidate) {
        candidate.v8Node = nodeCandidate.v8;
      }
    }
  }

  return result;
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
