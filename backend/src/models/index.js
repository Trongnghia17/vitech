const sequelize = require('../config/sequelize');
const Contact = require('./Contact');
const AdminUser = require('./AdminUser');
const Category = require('./Category');
const Product = require('./Product');
const Post = require('./Post');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

const db = {
  sequelize,
  Contact,
  AdminUser,
  Category,
  Product,
  Post,
};

module.exports = db;
