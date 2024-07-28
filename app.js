const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.listen(4000,()=>{
    console.log('server started at ',4000);
    mongoose.connect('mongodb://127.0.0.1/webhook')
    .then(()=>console.info('connected to db'))
    .catch((err)=>console.error("error ",err));
})

const webhookSchema = new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    event:{
        type:String,
        required:true
    }
});
const webhookModel = mongoose.model('webhook',webhookSchema)
app.post('/webhook',async (req,res)=>{
    const {url,event}= req.body;
    try{
        const webhook = new webhookModel({url,event})
        await webhook.save();
        res.status(201).json({
            msg:'webhook created'
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            msg:'failed to create webhhok'
        })
    }
})

app.post('/trigger-webhook',async(req,res)=>{
    const {event} = req.body;
    try{
        const webhooks = await webhookModel.find({event});
        webhooks.forEach(async(webhook)=>{
            try{
    
                console.log("webhook",webhook.url)
                const data=await axios.get(`${webhook.url}`);
                console.log("data:::::".data);
            }
          catch(err){
            throw err
          }
          
        })
        res.status(200).json({
            msg:'webhook trigerred'
        })
    }catch(err){
        res.status(500).json({
            msg:'failed to trigger webhhok'
        })
    }
})
app.get('/',(req,res)=>{
    res.send('app is up')
})
