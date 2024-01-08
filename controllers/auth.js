const testAuthController = (req, res) => {
    console.log('get request from AUTH controller')
    obj = {success: true, message: "AUTH controller success"};
    return res.send(JSON.stringify(obj));
}

module.exports = {
    testAuthController
}