const fs = require('fs');
const path = require('path');

// // for image background removal function
// process.env['U2NET_HOME'] = path.join(__dirname, 'u2net');
// const sharp = require('sharp');
// const { Rembg}= require('rembg-node');

const testPostController = async (req, res) => {
    console.log('get request from POST controller')
    obj = {success: true, message: "POST controller success"};
    return res.send(JSON.stringify(obj));
}

module.exports = {
    testPostController
}