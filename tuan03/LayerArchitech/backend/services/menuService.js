const menuRepository = require("../repositories/menuRepository");

exports.createMenu = (data) => {
    return menuRepository.create(data);
};

exports.getMenus = () => {
    return menuRepository.findAll();
};