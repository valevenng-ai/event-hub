module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: '' },
    date: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'upcoming',
    },
  }, {
    tableName: 'events',
  });
};
