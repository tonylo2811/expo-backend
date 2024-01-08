const testGetController = async (req, res) => {
    console.log('get request from GET controller')
    obj = {success: true, message: "GET controller success"};
    return res.send(JSON.stringify(obj));
}

module.exports = {
    testGetController
}