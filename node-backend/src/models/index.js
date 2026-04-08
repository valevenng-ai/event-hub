const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

const User = require('./User')(sequelize, Sequelize.DataTypes);
const Event = require('./Event')(sequelize, Sequelize.DataTypes);
const Participant = require('./Participant')(sequelize, Sequelize.DataTypes);
const Registration = require('./Registration')(sequelize, Sequelize.DataTypes);

// Associations
Event.belongsToMany(Participant, { through: Registration, foreignKey: 'event_id' });
Participant.belongsToMany(Event, { through: Registration, foreignKey: 'participant_id' });

Registration.belongsTo(Event, { foreignKey: 'event_id' });
Registration.belongsTo(Participant, { foreignKey: 'participant_id' });

module.exports = { sequelize, User, Event, Participant, Registration };
