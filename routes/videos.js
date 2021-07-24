var express = require('express');
var router = express.Router();
var videos = require('../public/data/mockdata');
var fs = require('fs');
var path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(videos)
});

router.get('/:id', function(req, res, next) {
      const id = parseInt(req.params.id);
      res.json(videos[id]);
});

router.get('/stream/:id', function(req, res, next) {
   //const videoPath = `../public/videos/${req.params.id}.mp4`;
   const videoPath = path.resolve(__dirname,"../public/videos/"+req.params.id+".mp4")
   const videoStat = fs.statSync(videoPath);
   console.log(videoStat);
   const fileSize = videoStat.size;
   const videoRange = req.headers.range;
    console.log(req.headers)
    console.log(videoRange)

   if(videoRange){
        const parts = videoRange.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1]
                    ? parseInt(parts[1], 10)
                    : fileSize-1;
                const chunksize = (end-start) + 1;


                const file = fs.createReadStream(videoPath, {start, end});
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
   }else{
        const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
   }


});

router.get('/get/:id', function(req, res, next) {
    //const videoPath = `../public/videos/${req.params.id}.mp4`;
    const videoPath = path.resolve(__dirname,"../public/videos/"+req.params.id+".mp4")
    const videoStat = fs.statSync(videoPath);

    const fileSize = videoStat.size;
    const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);


});

module.exports = router;
