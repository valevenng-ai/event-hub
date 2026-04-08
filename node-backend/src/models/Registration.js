module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Registration', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    participant_id: { type: DataTypes.INTEGER, allowNull: false },
    registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'registrations',
    indexes: [
      { unique: true, fields: ['event_id', 'participant_id'] },
    ],
  });
};
