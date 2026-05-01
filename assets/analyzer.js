import { versionHash64 } from "./hash.js";

/**
 * @typedef {{ type: "node" | "electron", version: string, v8: string, hash: number }} VersionInfo
 */

/**
 * @param {number} magicNumber
 * @returns {boolean}
 */
export function checkSignature(magicNumber) {
  return magicNumber >>> 16 === 0xc0de;
}

/**
 * @param {number} hash
 * @returns {VersionInfo[]}
 */
export function findVersions(hash) {
  return versions.filter((release) => release.hash === hash);
}

const versions = await hashVersions();

/**
 *
 * @returns {Promise<{ type: "node" | "electron", version: string, v8: string, hash: number }[]>}
 */
async function hashVersions() {
  const [nodeVersions, electronVersions] = await Promise.all([
    fetch("https://nodejs.org/dist/index.json").then((res) => res.json()),
    fetch("https://releases.electronjs.org/releases.json").then((res) =>
      res.json(),
    ),
  ]);
  const versions = [];

  nodeVersions.forEach(({ v8, version }) => {
    const versionParts = v8.split(".").map(Number);
    const hash = versionHash64(...versionParts);
    const reverseHash = versionHash64(...versionParts.reverse());
    versions.push({
      type: "node",
      version: version.replace(/^v/, ""),
      v8,
      hash,
    });
    versions.push({
      type: "node",
      version: version.replace(/^v/, ""),
      v8,
      hash: reverseHash,
    });
  });

  electronVersions.forEach(({ version, v8 }) => {
    const versionParts = v8.replace(/-.+/, "").split(".").map(Number);
    const hash = versionHash64(...versionParts);
    const reverseHash = versionHash64(...versionParts.reverse());
    versions.push({ type: "electron", version, v8, hash });
    versions.push({ type: "electron", version, v8, hash: reverseHash });
  });

  return versions;
}
