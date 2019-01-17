const socket = require('../socket');
const {EventType} = require('../types/types');

module.exports = {
    type: EventType,
    subscribe: () => socket.asyncIterator('EVENT_CREATED')
};