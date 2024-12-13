require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require("body-parser")

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
  req.params.shortUrl=1
  next()
}
}, (req, res)=>{
  app.get("/api/shorturl/:url",(req2,res2)=>{
    if(req2.params.url==req.params.shortUrl){
      res2.redirect(req.params.longUrl)
    }else{
      res2.redirect("/api/shorturl")
    }
  })
  
  res.json({ original_url : req.params.longUrl, short_url : req.params.shortUrl});
});





app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
