let users = [];
let id = 1;

exports.create = (data) => {
    const user = { id: id++, ...data };
    users.push(user);
    return user;
};

exports.findAll = () => {
    return users;
};