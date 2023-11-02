const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

// 댓글 생성
router.post("/posts/:_postId/comments", async (req, res) => {
    const { user, password, content } = req.body;
    const { _postId } = req.params;
    const comments = await Comments.find({}).sort({ "commentId": -1 });
    const message = content = "" || null ? "댓글 내용을 입력해주세요" : "";
    const commentId = comments.length === 0 ? 1 : comments(comments[0].commentId) + 1
    console.log(content ==null)
    try {
        await Comments.create({ commentId, postId: Number(_postId), user, password, content, date: new Date() });
        message = "댓글을 생성하였습니다."
    } catch (err) {
        message = "데이터 형식이 올바르지 않습니다."
    }

    res.json({ massage: message });
});
// 댓글 목록 조회
router.get("/posts/:_postId/comments", async (req, res) => {
    const { _postId } = req.params;
    const comments = await Comments.find({ postId: Number(_postId) }).sort({ "commentId": -1 });
    try {
        const result = comments.map((data) => {
            return {
                commentId: data.commentId,
                user: data.postId,
                content: data.content,
                createdAt: data.createdAt
            };
        });
        res.json({ comments: result });
    } catch {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});
// 댓글 수정
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    const comments = await Comments.find({ commentId: Number(_commentId) });
    let message = !comments.length ? "댓글 조회에 실패하였습니다." : "";

    if (content == "" || content == null) {
        message = "댓글 내용을 입력해주세요";
    } else if (password !== comments[0].password) {
        message = "비밀번호가 맞지 않습니다";
    } else {
        try {
            await comments[0].updateOne({ commentId: Number(_commentId), $set: { content } });
            message = "댓글을 수정하였습니다."
        } catch (err) {
            message = "데이터 형식이 올바르지 않습니다."
        }
    }
    res.send({ message: message });
});
// 댓글 삭제
router.delete("/posts/:_postId/comments/:_commentId", async (req, res) => {
    const { _commentId } = req.params;
    const existsCarts = await Comments.find({ commentId: Number(_commentId) });
    let message = !existsCarts.length?"댓글 조회에 실패하였습니다." : "";
    try{
        await Comments.deleteOne({ commentId: Number(_commentId) })
        message = "댓글을 삭제하였습니다."
    }catch(err){
        message = "데이터 형식이 올바르지 않습니다."
    }
    res.json({ message: message });
});
module.exports = router;