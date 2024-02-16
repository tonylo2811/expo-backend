// common functions across the app
const { spawn } = require('child_process');
const fs = require('fs');

const pythonVersion = 'python3' //change according to your python version and source, e.g. 'python3/python

//create Python venv
const venvSetup = (callback) => {
    console.log('Creating venv')
    const venv = spawn(pythonVersion, ['-m', 'venv', 'env']);
    venv.stdout.on('data', function (data, err) { console.log(data.toString()); });
    venv.on('close', (code) => {
        console.log(`Venv created with code ${code}`);
        callback();
    });
    venv.on('error', (err) => { console.log(`Venv creation failed with error ${err}`);});
}

// Activate venv and install libraries
const pyInstall = () => {
    console.log('Running setup script')
    let installLib=null
    //mac or linux
    if(process.platform=='linux'||process.platform=='darwin'){
        installLib = spawn('source ./env/bin/activate && pip install ultralytics', { shell: '/bin/bash' });
    }
    //windows with powershell
    if(process.env.OS=='Windows_NT'||process.platform=='win32'){
        installLib = spawn('./env/Scripts/Activate.ps1 ; pip install ultralytics', { shell: 'powershell.exe' });
    }
    // installLib.stdout.on('data', function (data) {console.log(data.toString());});
    installLib.on('close', (code) => {
        console.log(`Installations finished with code ${code}`);

        //run Python script once to load model in memory
        console.log('Loading model in memory')
        let loadModel=null
        // mac or linux
        if(process.platform=='linux'||process.platform=='darwin'){
            loadModel = spawn('source ./env/bin/activate && python ./python/irScript.py ./uploads/img.jpg', { shell: '/bin/bash' });
        }
        // windows with powershell
        if(process.env.OS=='Windows_NT'||process.platform=='win32'){
            loadModel = spawn(`./env/Scripts/Activate.ps1 ; python ./python/irScript.py ./uploads/img.jpg`, { shell: 'powershell.exe' });
        }
        // loadModel.stdout.on('data', function (data) {console.log(data.toString());});
        loadModel.on('close', (code) => {
            fs.rmSync('./runs/detect/',{ recursive: true, force: true })
            console.log(`Model loaded with code ${code}`);
        });
    });
}

module.exports = {
    venvSetup,
    pyInstall
}