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

  const view = new Uint32Array(data, 0, 2);

  const valid = checkSignature(view[0]);
  if (!valid) {
    status.textContent = "Invalid file signature";
    return;
  }
  const versions = findVersions(view[1]);
  hashDiv.textContent = view[1].toString(16).padStart(8, "0");

  status.textContent =
    versions.length > 0
      ? "Success"
      : "No Node or Electron versions found for this V8 version.";

  for (const version of versions) {
    const row = document.createElement("tr");
    const nodeCell = document.createElement("td");
    const nodeV8Cell = document.createElement("td");
    const electronCell = document.createElement("td");
    const chromiumV8Cell = document.createElement("td");

    nodeCell.textContent = version.node;
    nodeV8Cell.textContent = version.nodeV8;
    electronCell.textContent = version.electron;
    chromiumV8Cell.textContent = version.electronV8;
    row.append(nodeCell, nodeV8Cell, electronCell, chromiumV8Cell);
    outputRows.appendChild(row);
  }
});
