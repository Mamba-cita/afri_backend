const mongoose = require('mongoose')


const ClientSchema = new mongoose.Schema({

name:{
    type: 'string',
},
email:{
    type: 'string',
},
phone:{
    type: 'string',
},
payment:{
    type: 'string',
},
kra_pin:{
    type: 'string',
},
location:{
    type: 'string',
}
});

module.exports = mongoose.model('Client', ClientSchema);