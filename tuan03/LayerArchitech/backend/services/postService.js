const postRepository = require("../repositories/postRepository");

exports.createPost = (data) => {
    return postRepository.create(data);
};

exports.getPosts = () => {
    return postRepository.findAll();
};

exports.updatePost = (id, data) => {
    return postRepository.update(id, data);
};

exports.deletePost = (id) => {
    return postRepository.remove(id);
};