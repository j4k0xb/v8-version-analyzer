import { checkSignature, findVersions } from "./analyzer.js";

const fileInput = document.getElementById("file-input");
const status = document.getElementById("status");
const hashDiv = document.getElementById("hash");
const outputRows = document.getElementById("output-rows");

fileInput.addEventListener("change", async (event) => {
  outputRows.innerHTML = "";
  hashDiv.textContent = "";

  const [file] = event.target.files;
  if (!file) return;

  status.textContent = "Processing...";

  const data = await file.arrayBuffer();

  if (data.byteLength <= 8) {
    status.textContent = "File is too small (incomplete header)";
    return;
  }

  const [magic, hash] = new Uint32Array(data, 0, 2);
  const valid = checkSignature(magic);

  if (!valid) {
    status.textContent = "Invalid file signature";
    return;
  }

  const versions = findVersions(hash);
  hashDiv.textContent = hash.toString(16).padStart(8, "0");

  status.textContent =
    versions.length > 0
      ? "Success"
      : "No Node or Electron versions found for this V8 version.";

  for (const version of versions) {
    const row = document.createElement("tr");
    const v8Cell = document.createElement("td");
    const nodeCell = document.createElement("td");
    const electronCell = document.createElement("td");

    v8Cell.textContent = version.v8;
    nodeCell.textContent = version.node;
    electronCell.textContent = version.electron;
    row.append(v8Cell, nodeCell, electronCell);
    outputRows.appendChild(row);
  }
});
