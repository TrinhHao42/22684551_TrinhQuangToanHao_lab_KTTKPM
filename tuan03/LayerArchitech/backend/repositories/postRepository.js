let posts = [];
let id = 1;

exports.create = (data) => {
    const post = { id: id++, ...data };
    posts.push(post);
    return post;
};

exports.findAll = () => {
    return posts;
};

exports.update = (postId, data) => {
    const post = posts.find(p => p.id == postId);
    Object.assign(post, data);
    return post;
};

exports.remove = (postId) => {
    posts = posts.filter(p => p.id != postId);
};