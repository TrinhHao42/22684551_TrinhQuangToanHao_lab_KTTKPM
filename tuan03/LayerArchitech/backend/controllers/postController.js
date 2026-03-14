const postService = require("../services/postService");

exports.createPost = async (req, res) => {
    const post = await postService.createPost(req.body);
    res.json(post);
};

exports.getPosts = async (req, res) => {
    const posts = await postService.getPosts();
    res.json(posts);
};

exports.updatePost = async (req, res) => {
    const post = await postService.updatePost(req.params.id, req.body);
    res.json(post);
};

exports.deletePost = async (req, res) => {
    await postService.deletePost(req.params.id);
    res.json({ message: "Post deleted" });
};