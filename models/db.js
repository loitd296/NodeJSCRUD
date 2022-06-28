const mongoose = require('mongoose');
const url = "mongodb+srv://loipi879:LYiqGJT81YY3Iber@cluster0.exo72.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url,{useNewUrlParser:true},(err) => {
    if(!err){ console.log("MongoDB Connection Succeeded");}
    else{
        console.log("An Error Occured");
    } 
})

require('./employee.model');
