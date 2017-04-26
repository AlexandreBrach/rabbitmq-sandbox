/*jslint node: true this: true es6: true */
/*global this */

var config = {
    rabbit: {
        url : 'amqp://rabbit:rabbit@message-bus',
        queueName : process.env.QUEUE_NAME,
    }
};

module.exports = config;
