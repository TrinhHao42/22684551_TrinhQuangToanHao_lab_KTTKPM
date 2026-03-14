let menus = [];
let id = 1;

exports.create = (data) => {
    const menu = { id: id++, ...data };
    menus.push(menu);
    return menu;
};

exports.findAll = () => {
    return menus;
};