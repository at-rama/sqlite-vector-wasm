const output = document.querySelector('#result');
const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

worker.onmessage = ({ data }) => {
  output.textContent = data.error ?? JSON.stringify(data, null, 2);
  worker.terminate();
};
worker.onerror = event => {
  output.textContent = event.message;
  worker.terminate();
};
worker.postMessage('search');
