const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
// 连接到 MySQL 数据库
const sequelize = new Sequelize('test', 'thekid', '114514aA', {
  host: 'localhost',
  dialect: 'mysql'
});

// 定义用户模型
const Users = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // 在设置密码时进行哈希
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashedPassword);
    }
  },
}, {
  timestamps: true // 添加 createdAt 和 updatedAt 字段
});

module.exports = Users;