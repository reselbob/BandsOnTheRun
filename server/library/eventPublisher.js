const socket = require('../socket');
const Event = require('../models/event');

module.exports = {
    eventPublisher: {
        publish: async (topic, eventName, payload) => {
            const createdAt = Date.now();
            const event = new Event({
                name: eventName,
                payload: JSON.stringify(payload),
                createdAt
            });
            const data = await event.save();

            await socket.publish(topic, {eventAdded: data});
            console.log(data);
            return data;
        }
    }
};