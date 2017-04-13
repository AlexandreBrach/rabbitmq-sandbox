/*jslint node: true this: true es6: true */
/*global this */

module.exports = {
    server: {
        port: 80
    },
    rabbit: {
        url: "amqp://rabbit:rabbit@message-bus",
        queueName: 'the.bus'
    }
};
