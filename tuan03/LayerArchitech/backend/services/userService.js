const userRepository = require("../repositories/userRepository");

exports.createUser = (data) => {
    return userRepository.create(data);
};

exports.getUsers = () => {
    return userRepository.findAll();
};