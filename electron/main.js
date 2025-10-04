const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
let mainWindow;
let backendProcess = null;

function startBackend(){
  const backendExe = path.join(__dirname, '..', 'backend', 'dist', process.platform === 'win32' ? 'backend.exe' : 'backend');
  if (!require('fs').existsSync(backendExe)){
    backendProcess = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--port', '8000', '--host', '127.0.0.1'], { cwd: path.join(__dirname, '..', 'backend') });
  } else {
    backendProcess = spawn(backendExe, [], { cwd: path.join(__dirname, '..', 'backend', 'dist') });
  }

  backendProcess.stdout.on('data', (data)=> console.log('[backend]', data.toString()));
  backendProcess.stderr.on('data', (data)=> console.error('[backend-err]', data.toString()));
  backendProcess.on('exit', (code) => { console.log('backend exited', code); });
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
  if (require('fs').existsSync(indexPath)){
    mainWindow.loadFile(indexPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(()=>{
  startBackend();
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
  if (backendProcess) backendProcess.kill();
});
