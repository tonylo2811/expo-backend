Development Notes: handlebars to render HTML

## Installation
* Requires Node.js 18.17.0
```
npm install
```

## localhosting and port forwarding
* React Native application require https and a sign certificate to make API calls, so using port forwarding to localhost the API calls to the server is needed
1. npm start to start the server
2. Click on "PORTS" tab in VS Code, or "Ctrl +P" and ">PORTS"
3. Click on "Forward a Port" button
4. Enter 5000 for the port number
5. Right click on the port and choose visibility as "Public"
6. Copy the URL and paste it in the "host" variable in the "./src/utils/api.jsx" in the frontend

## To stop server creating virtual environment on startup
* Commond out line 38 in index.js
```
// venvSetup(()=>pyInstall());
```

## To add route to the server
  1. Add logic to controller
  2. Map route name and function name to /routes/{ControllerName}.js