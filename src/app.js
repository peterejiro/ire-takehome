const dotenv = require("dotenv");
const express = require('express');

const logger =require('morgan');

//setting up express app

const app = express();

//pass incoming requests data
app.use(express.json());
app.use(express.urlencoded({extended : false}))
dotenv.config();


const customerRouter = require('./routes/customer')
app.use('/customer', customerRouter)

const paymentRouter = require('./routes/payment')
app.use('/payment', paymentRouter)

app.get('/',  async function(req, res) {

    res.send('you got here. so get out')
});

let port;


if(process.env.NODE_ENV === 'DEVELOPMENT' || process.env.NODE_ENV === 'PRODUCTION' ){
    port = process.env.PORT || 8000
}

if(process.env.NODE_ENV === 'TEST'){
    port = 0
}


const server =   app.listen(port, ()=>{
    console.log(`Listening on ${port}`);
})


module.exports = server

