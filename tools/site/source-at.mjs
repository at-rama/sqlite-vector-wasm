import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {root} from '../package/package.mjs';

function api(repository) { return `https://api.github.com/repos/${repository}`; }

export async function sourceAt({repository,commit,path,get,localCommit,directory=root,optional=false}) {
 if(commit===localCommit){try{return await readFile(join(directory,path),"utf8");}catch(error){if(optional&&error.code==="ENOENT")return null;throw error;}}
 const r=await get(`${api(repository)}/contents/${path}?ref=${commit}`);if(optional&&r.status===404)return null;
 assert.equal(r.status,200,`Stable source unavailable: ${path}`);const f=r.data;assert.equal(f.type,"file");assert.equal(f.path,path);assert.equal(f.encoding,"base64");
 const b=Buffer.from(f.content,"base64");assert.equal(b.length,f.size);return b.toString("utf8");
}

