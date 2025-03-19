import { checkSignature, findVersions } from './analyzer.js';

const file_input = document.getElementById('file_input');
const submit = document.getElementById('submit');
const output = document.getElementById('output');

submit.addEventListener('click', async () => {
  output.value = '';

  const [file] = file_input.files;
  if (!file) return;

  const data = await file.arrayBuffer();

  if (data.byteLength <= 0x4) {
    output.value = 'File is too small (incomplete header)';
    return;
  }

  let view;
  try {
    view = new Uint32Array(data, 0, 2);
  } catch (e) {
    console.error(e);
    output.value = 'Invalid file';
    return;
  }

  const valid = checkSignature(view[0]);
  const versions = findVersions(view[1]);
  const hashStr = view[1].toString(16).padStart(8, '0');

  output.value += `File signature is ${valid ? 'valid' : 'invalid'}!\n\n`;
  output.value += `V8 Version: ${versions.v8} (hash: ${hashStr})\n\n`;

  if (versions.node.length) {
    output.value += `Possible Node Versions:\n${versions.node
      .map(v => `- ${v.version}`)
      .join('\n')}\n`;
  } else if (versions.electron.length) {
    output.value += `Possible Electron Versions:\n${versions.electron
      .map(v => `- ${v.version} (Node ${v.node})`)
      .join('\n')}\n`;
  } else {
    output.value += `No Node or Electron versions found for this V8 version.\n`;
  }
});
