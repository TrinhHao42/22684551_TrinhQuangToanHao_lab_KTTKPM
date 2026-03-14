const menuService = require("../services/menuService");

exports.createMenu = async (req, res) => {
    const menu = await menuService.createMenu(req.body);
    res.json(menu);
};

exports.getMenus = async (req, res) => {
    const menus = await menuService.getMenus();
    res.json(menus);
};