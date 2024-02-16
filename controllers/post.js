const fs = require('fs');
const path = require('path');
const {User, Garment} = require('../model');
const { spawn } = require('child_process');
const {v4: uuidv4} = require('uuid');

const sharp = require('sharp');
const { Rembg}= require('rembg-node');


const testPostController = async (req, res) => {
    console.log('get request from POST controller')
    obj = {success: true, message: "POST controller success"};
    return res.send(JSON.stringify(obj));
}


const tagReader = async (req, res) => {
    try{
        const tagImageInBase64 = req?.body?.base64img

        //call python script in a promise
        const readlabel = new Promise(async(resolve, reject) => {
            await readerScript(tagImageInBase64,resolve,reject)
        })

        await readlabel.then((data)=>{
            //output should be an array of class index like["30", "40", "6", "8", "1", "0"]
            console.log('data: ', data.predictedClass)
            console.log('filePath: ', data.filePath)

            //delete the image file
            fs.unlinkSync(data.filePath)

            obj = {success: true, prediction: data.predictedClass};
            return res.send(JSON.stringify(obj));

        }).catch((err)=>{
            console.log(err)
            obj = {success: false, message: "tag reader failed"};
            return res.send(JSON.stringify(obj));
        })
        
    }
    catch(err){
        console.log(err)
        obj = {success: false, message: "Tag reader handler failed"};
        return res.send(JSON.stringify(obj));
    }
}


//python script function
const readerScript = async (base64String,resolve,reject) =>{
    try{   
        const fileID = uuidv4()
        //convert received base64 string to a jpeg file
        fs.writeFile(`./uploads/${fileID}.jpeg`, base64String, {encoding: 'base64'}, async function(err) {
            //fail to create file
            if(err){
                console.log(err);
                reject(err)
            } 
            //successfully created the file, calling python script with the file path as argument
            console.log('File created, calling Python Script...');


            let cmd=''
            let shell=''
            //linux/mac command
            if(process.platform=='linux'||process.platform=='darwin'){
                cmd = `source ./env/bin/activate && python ./python/irScript.py ./uploads/${fileID}.jpeg`
                shell = '/bin/bash'
            }
            //windows command
            if(process.env.OS=='Windows_NT'||process.platform=='win32'){
                cmd = `./env/Scripts/Activate.ps1 ; python ./python/irScript.py ./uploads/${fileID}.jpeg`
                shell = 'powershell.exe'
            }
            const activate = spawn(cmd, { shell: shell });
            
            //output from the script, keep this line for debugging
            //activate.stdout.on('data', function (data) {console.log(data.toString());});
            
            //completed and shell closed
            activate.on('close', (code) => {
                if(code!=0) reject(code)
                console.log(`Script execution finished with ${code}`);
                
                //if code 0, read prediction result, delete file and resolve
                fs.readFile(`./runs/detect/predict/labels/${fileID}.txt`, 'utf8', function(err, data) {
                    if (err) throw err;

                    let predictedClass = []
                    data.split('\n').forEach(function(line) {
                        if(line.split(' ')[0] != '') predictedClass.push(line.split(' ')[0])
                    });

                    //delete the prediction output
                    fs.rmSync('./runs/detect/',{ recursive: true, force: true })
                    obj = {predictedClass: predictedClass,filePath: `./uploads/${fileID}.jpeg`};
                    resolve(obj)
                });
            });
        });
    }
    catch(err){
        console.log(err)
        reject(err)
    }
}


const garmentRegistration = async (req, res) => {
    try{
        const {
            category,
            season,
            occasion,
            size,
            colour,
            brand,
            price,
            remarks,
          } = req?.body || {};
        const garmentImageInBase64 = req?.body?.garmentImg //this name should be the same as the name in the frontend form
        const labelImageInBase64 = req?.body?.labelImg

        let promoiseArray = []

        promoiseArray.push(new Promise((resolve, reject) => {
            bgrm(garmentImageInBase64,resolve,reject)
        }))
        promoiseArray.push(new Promise((resolve, reject) => {
            readerScript(labelImageInBase64,resolve,reject)
        }))
        await Promise.all(promoiseArray).then(([bgrmed, readlabel]) => {
            console.log('bgrmed: ', bgrmed.base64String)
            console.log('readlabel: ', readlabel.predictedClass)
            const bgrmedBase64String = bgrmed.base64String
            const readLabelClass = readlabel.predictedClass
            //delete the image file
            fs.unlinkSync(bgrmed.filePath)
            fs.unlinkSync(readlabel.filePath)

            //create a Garment object and save to DB
            const garment  = new Garment({
                categories: category,
                season: season,
                occasion: occasion,
                size: size,
                colour: colour,
                brand: brand,
                price: price,
                remarks: remarks,
                labels: readLabelClass,
                image: bgrmedBase64String,
            })
            garment.save()
                .then((newGarment) => {
                    console.log('garment saved successfully')
                    console.log('newGarment: ', newGarment)
                    obj = {success: true, message:'garment registered successfully'};
                    return res.send(JSON.stringify(obj));
                })
                .catch((err) => {
                    console.log('err saving garment info to DB', err)
                    obj = {success: false, message: 'garment registration failed'};
                    // return res.send(JSON.stringify(obj));
                    return res.status(500).send(JSON.stringify(obj));
                })

            //for testing only
            // obj = {success: true, message:'garment registered successfully'};
            // res.send(JSON.stringify(obj));
        }).catch((err)=>{
            console.log(err)
            obj = {success: false, message: 'garment registration failed'};
            // return res.send(JSON.stringify(obj));
            return res.status(500).send(JSON.stringify(obj));
        })
    }
    catch(err){
        console.log(err)
        obj = {success: false, message: 'unspecified error happened'};
        // return res.send(JSON.stringify(obj));
        return res.status(500).send(JSON.stringify(obj));
    }
}


const bgrm = async(labelImageInBase64, resolve, reject) =>{
    try{
        const fileID = uuidv4()
        fs.writeFile(`./uploads/${fileID}.jpeg`, labelImageInBase64, {encoding: 'base64'}, async function(err) {
            //fail to create file
            if(err){
                console.log(err);
                reject(err)
            } 

            const filenamewithdir = `./uploads/${fileID}.jpeg`
            const input = sharp(filenamewithdir)
            const rembg = new Rembg({ 
                logging: true,
            });

            const output = await rembg.remove(input);
            await output.trim().webp({quality:30}).toBuffer().then((data)=>{
                obj = {base64String: data.toString('base64'),filePath: `./uploads/${fileID}.jpeg`};
                resolve(obj)

                //for debugging: save the output base64 string to a txt file in uploads folder
                // const base64Data = data.toString('base64');
                // fs.writeFile(`./uploads/${fileName}.txt`, base64Data, async function(err) {
                //     resolve();
                // })
            })
        })
    }
    catch(err){
        console.log(err)
        reject(err)
    }
}


//this handler is for testing the background removal function only
//integrate the background removal function into the garment registration handler
//command out the tagreader handler above before using this 
// const tagReader = async (req, res) => {
//     try{
//         const garmentImageInBase64 = req?.body?.base64img

//         //convert received base64 string to a jpeg file
//         fs.writeFile('./uploads/garment.jpeg', garmentImageInBase64, {encoding: 'base64'}, async function(err) {
//             const bgrmed = new Promise(async(resolve, reject) => {
//                 await bgrm('garment',resolve,reject)
//             })

//             await bgrmed.then((data)=>{
//                 //delete the image file
//                 fs.unlinkSync('./uploads/garment.jpeg')
                
//                 //output should be a base64 string
//                 //create a Garment object and save to DB
//                 // const garment  = new Garment({
//                 //     //other field.....
//                 //     image: data
//                 // })
//                 // garment.save()
//                 //     .then((newGarment) => {
//                 //         console.log('garment saved successfully')
//                 //         console.log('newGarment: ', newGarment)
//                 //         //respond logic here
//                 //     })
//                 //     .catch((err) => {
//                 //         console.log('err saving garment info to DB', err)
//                 //     })

//                 obj = {success: true, message:'background removed successfully'};
//                 return res.send(JSON.stringify(obj));
//             }).catch((err)=>{
//                 console.log(err)
//                 obj = {success: false, message: "tag reader failed"};
//                 return res.send(JSON.stringify(obj));
//             })
//         });
//     }
//     catch(err){
//         console.log(err)
//         obj = {success: false, message: "Tag reader handler failed"};
//         return res.send(JSON.stringify(obj));
//     }
// }


module.exports = {
    testPostController,
    tagReader,
    garmentRegistration
}