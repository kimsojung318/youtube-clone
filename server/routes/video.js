const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

// Storage Multer Config Option
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file")

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
    // 비디오 Server 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({
            success: true,
            url: res.req.file.path,
            fileName: res.req.file.filename
        })
    })
});

router.post('/thumbnail', (req, res) => {
    // 썸네일 생성 후 비디오 러닝타임 가져오기

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        //console.log(metadata.format.duration);

        fileDuration = metadata.format.duration; // 영상 재생 시간
    })

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) { // 썸네일 파일 이름 생성
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () { // 썸네일 생성 후 무엇을 할 것인 지 정의
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3, // 썸네일 수
            folder: 'uploads/thumbnails',
            size: '320x240',
            // %b input basename ( filename w/o extension )
            filename: 'thumbnail-%b.png'
        });
});


router.post('/uploadVideo', (req, res) => {
    // 비디오 정보들을 DB 저장

    const video = new Video(req.body) // 모든 정보가 담긴다.

    video.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.get('/getVideos', (req, res) => {
    // 비디오를 DB에서 가져와서 client에 전달함

    // Video 컬렉션에 있는 모든 비디오를 가져온다.
    Video.find()
        .populate('writer') // 하지 않으면 비디오 ID만 가져오게 된다.
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos })
        })
});

router.post('/getVideoDetail', (req, res) => {

    Video.findOne({ "_id": req.body.videoId })
        .populate('writer') // 사용자의 모든 정보를 가져오기 위해 사용
        .exec((err, VideoDetail) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, VideoDetail })
        })
});

module.exports = router;