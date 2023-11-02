const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

// 게시글 작성
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

    const posts = await Posts.find({}).sort({ "postId": -1 });
    console.log(posts.length);
    const postId = posts.length === 0 ? 1 : Number(posts[0].postId) + 1
    console.log(postId);
    try {
        await Posts.create({ postId: postId, user, password, title, content, createdAt: new Date });
    } catch (err) {
        console.log(err);
        res.status(400).json({ "message": '데이터 형식이 올바르지 않습니다.' });
    }
    res.send({ "message": "게시글을 생성하였습니다." });
});

// // 게시글 조회
router.get("/posts", async (req, res) => {
    const posts = await Posts.find({}).sort({ "postId": -1 });
    const result = posts.map((data) => {
        return {
            postId: data.user,
            user: data.postId,
            title: data.title,
            content: data.content,
            createdAt: data.createdAt
        };
    });
    res.json({ date: result });
});

// // 게시글 상세 조회
router.get("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const posts = await Posts.find({ postId: Number(_postId) });
    try {
        const result = posts.map((data) => {
            return {
                postId: data.user,
                user: data.postId,
                title: data.title,
                content: data.content,
                createdAt: data.createdAt
            };
        });
        res.json({ date: result });
    } catch (err) {
        res.status(400).json({ "message": '데이터 형식이 올바르지 않습니다.' });
    }
});

// // 게시글 수정
router.put("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const posts = await Posts.find({ postId: Number(_postId) });
    if (!posts.length) {
        res.status(404).json({ "message": "게시글 조회에 실패하였습니다." });
    } else if (password !== posts[0].password) {
        res.status(400).json({ "message": "비밀번호가 맞지 않습니다." });
    } else {
        try {
            await posts[0].updateOne({ postId: _postId, $set: { title, content } });
            res.send({ "message": "게시글을 수정하였습니다." });
        } catch (err) {
            res.status(400).json({ "message": '데이터 형식이 올바르지 않습니다.' });
        }
    }
});

// // 게시글 삭제
router.delete("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password } = req.body;
    const existsCarts = await Posts.find({ postId: Number(_postId) });
    if (!existsCarts.length) {
        res.status(404).json({ "message": "게시글 조회에 실패하였습니다." });
    } else if (password !== existsCarts[0].password) {
        res.status(400).json({ "message": "비밀번호가 맞지 않습니다." });
    } else {
        try {
            await Posts.deleteOne({ postId: Number(_postId) });
            res.json({ "message": "게시글을 삭제하였습니다." });
        } catch (err) {
            res.status(400).json({ "message": '데이터 형식이 올바르지 않습니다.' });
        }
    }
});

module.exports = router;