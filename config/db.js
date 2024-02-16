const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://roy1:Roy1Password@roy1-db.kgprkwv.mongodb.net/test?retryWrites=true&w=majority')
// , 
// { 
//     // useNewUrlParser: true, 
//     // useUnifiedTopology: true 
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true
    
// });

//need further research for the following DB config
// mongoose.set('useNewUrlParser', true)
// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)
// mongoose.set('useUnifiedTopology', true)

module.exports = mongoose;
