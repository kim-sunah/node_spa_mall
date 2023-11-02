const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

// 댓글 생성
router.post("/posts/:_postsId/comments", async (req, res) => {
    const { user, password, title, content } = req.body;
    const { _postsId } = req.params;
    const comments = await Comments.find({}).sort({ "commentsId": -1 });
    const date = new Date() ;

    const commentsId = comments.length === 0 ? 1 : comments(comments[0].commentsId) + 1
    const createdComments = await Comments.create({ commentsId, postsId: Number(_postsId) , user, password, content, date:new Date() });

    res.json({ comments: createdComments });
});
// 댓글 목록 조회
router.get("/posts/:_postsId/comments", async (req, res) => {
    const { _postsId } = req.params;
    const comments = await Comments.find({postsId: Number(_postsId)}).sort({ "commentsId": -1 });
    res.json({ comments: comments });
});
// 댓글 수정
router.put("/posts/:_postsId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    const comments = await Comments.find({ commentsId: Number(_commentId) });

    if (password == comments[0].password) {
        await comments[0].updateOne({ commentsId: Number(_commentId) , $set: { content } });
        res.send({ message: "게시글을 수정하였습니다." });
    }
    else res.status(400).json({ errorMessge: "비밀번호가 맞지 않습니다" });
});
// 댓글 삭제
router.delete("/posts/:_postsId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const existsCarts = await Comments.find({ commentsId: Number(_commentId) });
    if (existsCarts.length) {
        await Comments.deleteOne({ commentsId: Number(_commentId) })
    }
    res.json({ success: true });
});
module.exports = router;