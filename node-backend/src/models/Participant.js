module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Participant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  }, {
    tableName: 'participants',
  });
};
