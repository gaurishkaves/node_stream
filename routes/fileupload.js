var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* GET users listing. */
router.get('/', function(req, res, next) {
    const videoPath = path.resolve(__dirname,"../public/videos/0.mp4");
    const readStream = fs.createReadStream(videoPath);
    readStream.on('data',(data)=>{
        console.log("data")
        res.write(data)
    });

    readStream.on('end',(data)=>{
        console.log("data end")
        res.status(200).send()
    });
});




router.get('/pipe', function(req, res, next) {
    const videoPath = path.resolve(__dirname,"../public/videos/0.mp4");
    const readStream = fs.createReadStream(videoPath);
    readStream.pipe(res);
    readStream.on('error',(data)=>{
        console.log("Error in read stream...")

    });

    res.on('error',(data)=>{
         console.log("Error in read stream...")
    });
    readStream.on('end',(data)=>{
        console.log("data end")
        //readStream.unpipe(res);
        res.status(200).send()
    });

    //readStream.emit('end')
});

router.get('/fileupload',(req,res)=>{
    res.render('fileupload')


})

router.post('/fileupload',async (req,res)=>{
    console.log(req.files)
    console.log(req.file)
    //const uploadFilePath = req.files.imageupload.tempFilePath;
    const filePath = path.join(__dirname, '../public/'+req.files.imageupload.name);


    await uploadFile(req,filePath)
        //.then((path)=>res.send({status:'success',path}))
        //.catch((err)=>res.send({status:'error',err}))
        res.send("test")

})

const uploadFile = async (req,filePath)=>{
    console.log("1"+filePath)
    console.log(req.files)
    //return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(req.files.imageupload.tempFilePath)
      const stream = fs.createWriteStream(filePath);
        console.log("2")
      stream.on('open', () => {
          console.log("3")
           console.log('Stream open ...  0.00%');
           readStream.pipe(stream);
      });


      stream.on('drain', () => {
      console.log("4")
       const written = parseInt(stream.bytesWritten);
       const total = parseInt(req.headers['content-length']);
       const pWritten = ((written / total) * 100).toFixed(2);
       console.log(`Processing  ...  ${pWritten}% done`);
      });


      stream.on('close', () => {
        console.log("5")
        console.log('Processing  ...  100%');
       //resolve(filePath);
       return true
      });
       // If something goes wrong, reject the primise
      stream.on('error', err => {
      console.log("6")
       console.error(err);
       //reject(err);
      });
    // })

}



module.exports = router;
