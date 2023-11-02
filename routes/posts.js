const express = require("express");
const router = express.Router();

const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

// 게시글 작성
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

    const posts = await Posts.find({}).sort({ "postsId": -1 });

    const postsId = posts.length === 0 ? 1 : Number(posts[0].postsId) + 1
    const createdPosts = await Posts.create({ postsId, user, password, title, content });

    res.json({ post: createdPosts });
});

// // 게시글 조회
router.get("/posts", async (req, res) => {
    const posts = await Posts.find({}).sort({ "postsId": -1 });
    res.json({ posts: posts });
});

// // 게시글 상세 조회
router.get("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const posts = await Posts.find({ postsId: Number(_postId) });
    res.json({ posts: posts });
});

// // 게시글 수정
router.put("/posts/:_postId", async (req, res) => {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const posts = await Posts.find({ postsId: Number(_postId) });
  
    if (password == posts[0].password) {
      await posts[0].updateOne({ postsId: _postId, $set: { title, content } });
      res.send({ message: "게시글을 수정하였습니다." });
    } 
    else res.status(400).json({ errorMessge: "비밀번호가 맞지 않습니다" });
  });

// // 게시글 삭제
router.delete("/posts/:_postId", async(req, res) => {
    const { _postId } = req.params;
    const existsCarts = await Posts.find({ postsId: Number(_postId) });
    if (existsCarts.length) {
        await Posts.deleteOne({ postsId: Number(_postId)  })
    }
    res.json({ success: true });
});

module.exports = router;