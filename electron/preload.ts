import { contextBridge, ipcRenderer } from 'electron'

export const api = {

  selectFolder: (): Promise<string | null> =>
    ipcRenderer.invoke('dialog:openDirectory'),

  listFiles: (folderPath: string): Promise<string[]> =>
    ipcRenderer.invoke('files:listFiles', folderPath),

  readFile: (filePath: string): Promise<string | null> =>
    ipcRenderer.invoke('files:readFile', filePath),

  saveFile: (args: {
    filePath: string
    content: string
  }): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('files:saveFile', args),

  getPathSep: (): Promise<string> => ipcRenderer.invoke('util:get-path-sep'),
}

contextBridge.exposeInMainWorld('api', api)
