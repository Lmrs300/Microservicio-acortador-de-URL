require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require("body-parser")

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(data=>{
  console.log("Conexion establecida")
})

const urlSchema=mongoose.Schema({
  original_url : String, 
  short_url : String
})

const Url=mongoose.model("Url",urlSchema)




// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', (req,res,next)=>{
var {url}=req.body
if(!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)){
  res.json({ error : 'invalid url'});
}else{
  req.params.longUrl=url

  Url.countDocuments().then(count=>{
    console.log(count)
    req.params.shortUrl=String(count+1)
    next()
  })
  
}
}, (req, res)=>{
  const urlObj={ original_url : req.params.longUrl, short_url : req.params.shortUrl}
  
  const newUser=new Url(urlObj)
  newUser.save()
  res.json(urlObj);
});


app.get("/api/shorturl/:url",(req,res)=>{
  Url.findOne({short_url:req.params.url}).then(doc=>{
    
    if(doc!=null){
      if(req.params.url==doc.short_url){
        res.redirect(doc.original_url)
      }else{
        res.redirect("/api/shorturl")
      }
    }
    
  })
  
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
