export const stableBase = '/sqlite-vector-wasm/';
export const previewBase = stableBase + 'preview/';

export function previewIdentity(branch, commit) {
  if (typeof branch !== 'string' || !branch || /[\x00-\x1f\x7f]/.test(branch) ||
      !/^[a-f0-9]{40}$/.test(commit ?? '')) throw Error('Preview requires a branch and full lowercase commit SHA.');
  return { branch, commit };
}

export function buildOptions(preview) {
  return { base: preview ? previewBase : stableBase,
    preview: preview ? previewIdentity(preview.branch, preview.commit) : null };
}
