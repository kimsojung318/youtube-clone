const { response } = require('express');
const express = require('express');
const router = express.Router();

const { auth } = require("../middleware/auth");

const { Comment } = require("../models/Comment");

//=================================
//            Comment
//=================================

router.post('/saveComment', (req, res) => {
    const comment = new Comment(req.body); // 전체 정보 넣어주기

    comment.save((err, comment) => {
        if(err) return res.json({ success: false, err })

        // "comment"만 쓸 경우 전체 정보를 가져올 수 없음 (Id만 가져오게 됨)
        Comment.find({ '_id' : comment._id })
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    }) // save
});

router.post('/getComments', (req, res) => {
    Comment.find({ "postId" : req.body.videoId })
    .populate('writer')
    .sort({ "createdAt": -1 }) // 날짜 순 내림차순 정렬로 최신 댓글이 먼저 올라온다.
    .exec((err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({ success: true, comments })
    })
});

module.exports = router;