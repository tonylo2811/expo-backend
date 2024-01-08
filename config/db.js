const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://roy1:Roy1Password@roy1-db.kgprkwv.mongodb.net/', 
{ useNewUrlParser: true, 
    useUnifiedTopology: true 
});

//need further research for the following DB config
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

module.exports = mongoose;
