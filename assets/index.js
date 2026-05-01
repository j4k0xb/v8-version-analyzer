import { checkSignature, findVersions } from "./analyzer.js";

const fileInput = document.getElementById("file-input");
const fileError = document.querySelector("#file-error");
const hashInput = document.getElementById("hash");
const v8VersionDiv = document.getElementById("v8-version");
const nodeVersionsList = document.getElementById("node-versions");
const electronVersionsList = document.getElementById("electron-versions");

fileInput.addEventListener("change", async (event) => {
  fileError.textContent = "";
  fileInput.classList.remove("file-input-error");

  const [file] = event.target.files;
  if (!file) return;

  const data = await file.arrayBuffer();

  if (data.byteLength <= 8) {
    fileInput.classList.add("file-input-error");
    fileError.textContent = "Invalid file signature";
    return;
  }

  const [magic, hash] = new Uint32Array(data, 0, 2);
  const valid = checkSignature(magic);

  if (!valid) {
    fileInput.classList.add("file-input-error");
    fileError.textContent = "Invalid file signature";
    return;
  }

  hashInput.value = hash.toString(16).padStart(8, "0");

  displayVersions(hash);
});

hashInput.addEventListener("input", () => {
  const hash = parseInt(hashInput.value, 16);
  displayVersions(hash);
});

/**
 * @param {number} hash
 */
function displayVersions(hash) {
  const result = findVersions(hash);
  if (result.length > 0) {
    v8VersionDiv.textContent = result[0].v8;
    nodeVersionsList.innerHTML = "";
    electronVersionsList.innerHTML = "";

    for (const item of result) {
      const listItem = document.createElement("li");
      listItem.textContent = item.version;
      listItem.className =
        "px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition";
      if (item.type === "node") {
        nodeVersionsList.appendChild(listItem);
      } else if (item.type === "electron") {
        electronVersionsList.appendChild(listItem);
      }
    }
  } else {
    v8VersionDiv.textContent = "—";
    nodeVersionsList.innerHTML = `<li class="opacity-50">No versions found</li>`;
    electronVersionsList.innerHTML = `<li class="opacity-50">No versions found</li>`;
  }
}
