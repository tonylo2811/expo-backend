const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const {mongoose} = require('./config');

const {venvSetup, pyInstall} = require('./helpers');

var cors = require('cors');

// change to https
// var https = require('https');
// const fs = require('fs');
// var options = {
//     key: fs.readFileSync('./cert/localhost.key'),
//     cert: fs.readFileSync('./cert/localhost.crt')
// };
// const server = https.createServer(options, app);

const server = require('http').Server(app);
const io = require('socket.io')(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;
var db = mongoose.connection
db.on('error',(err)=>{
    console.log(err);
})

db.once('open', async ()=>{
    console.log('DB running!');

    //create Python venv and library check, comment out if already done
    venvSetup(()=>pyInstall());
})

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

app.use(bodyParser.json());
app.use(cors())
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// })

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./routes'));

//following lines need further research
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}))

app.use(express.json());

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})