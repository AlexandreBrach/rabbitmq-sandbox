/*jslint node: true this: true es6: true */
/*global this */

var config = {
    rabbit: {
        url : 'amqp://rabbit:rabbit@message-bus',
        exchange : process.env.EXCHANGE_NAME
    }
};

module.exports = config;
