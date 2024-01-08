// common functions across the app
const { spawn } = require("child_process");

const pythonVersion = "python"; //change according to your python version and source, e.g. 'python3/python

const isWinPlatform = () => process.platform === "win32";


//create Python venv
const venvSetup = (callback) => {
  console.log("Creating venv");
  const venv = spawn(pythonVersion, ["-m", "venv", "env"]);
  venv.stdout.on("data", function (data, err) {
    console.log(data.toString());
  });
  venv.on("close", (code) => {
    console.log(`Venv created with code ${code}`);
    callback();
  });
  venv.on("error", (err) => {
    console.log(`Venv creation failed with error ${err}`);
  });
};

// Activate venv and install libraries
const pyInstall = () => {
  console.log("Running setup script");


  let installLib;
  if(isWinPlatform){
    //Windows with powershell
    installLib = spawn('./env/Scripts/Activate.ps1 ; pip install ultralytics', { shell: 'powershell.exe' });
  }
  else{
    //Mac or Linux
    installLib = spawn("source ./env/bin/activate && pip install ultralytics", { shell: "/bin/bash" } );
  }

  installLib.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  installLib.on("close", (code) => {
    console.log(`Installations finished with code ${code}`);

    //run Python script once to load model in memory
    console.log("Loading model in memory");

    let loadModel;
    if(isWinPlatform){
      // windows with powershell
      loadModel = spawn(`./env/Scripts/Activate.ps1 ; ${pythonVersion} ./python/irScript.py ./uploads/img.jpg`,{ shell: "powershell.exe" });
    }
    else{
      // Mac or Linux
      loadModel = spawn("source ./env/bin/activate && pip install ultralytics",{ shell: "/bin/bash" });
    }

    loadModel.stdout.on("data", function (data) {
      console.log(data.toString());
    });
    loadModel.on("close", (code) => {
      console.log(`Model loaded with code ${code}`);
    });
  });
};

module.exports = {
  venvSetup,
  pyInstall,
};
