// preload: safe hooks for renderer
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('electron', {});
