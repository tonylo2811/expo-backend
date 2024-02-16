const {User, Garment} = require('../model')

const testGetController = async (req, res) => {
    console.log('get request from GET controller')
    obj = {success: true, message: "GET controller success"};
    return res.send(JSON.stringify(obj));
}

const getUser = async(req,res) =>{
    // const {id} = req.params;
    // handcode this value later when register function is finished
    // const id = '';
    User.findOne({_id:id},{password:0},async(err,user)=>{
        if(err||!user){
            return res.send({success:false,message:'User not found'})
        }
        return res.send({success:true,user})
    }).exec()
}

const getImage = async (req, res) => {
    console.log('received request for POST controller->testGetImage')
    const {userid} = req.params;

    await Garment.find({owner: userid})
        .then((response) => {
            console.log('Number of item found: ', response.length)
            console.log('found record, sending response....')
            return res.send({success: true, message: 'Successfully retrieved images', data: response})
        })
        .catch((err) => {
            console.log('err', err)
            return res.send({success: false, message: 'Error while retrieving images'})
        })
}

const getImageID = async (req,res) =>{
    const {userid} = req.params;
    console.log('getting image ids for ', userid)

    await Garment.find({owner:userid},{_id:1})
        .then((response)=>{
            console.log('Number of item found: ', response.length)
            console.log(response)
            console.log('found record, sending response....')
            return res.send({success:true,message:'Successfully retrieved images',data:response})
        })
        .catch((err)=>{
            console.log('err',err)
            return res.send({success:false,message:'Error while retrieving images'})
        })
}

//only return image
const getGarment = async (req,res) =>{
    const {id} = req.params;
    Garment.findOne({_id:id}, {image:1})
        .then((response)=>{
            console.log(response)
            console.log('found record, sending response....')
            return res.send({success:true,message:'Successfully retrieved garment',data:response})
        })
        .catch((err)=>{
            console.log('err',err)
            return res.send({success:false,message:'Error while retrieving garment'})
        })
}

module.exports = {
    testGetController,
    getUser,
    getImage,
    getImageID,
    getGarment
}