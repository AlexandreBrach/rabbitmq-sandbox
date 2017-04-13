
var amqp = require('amqplib');

var messageBus = function( url, queueName ) {
    this.url = url;
    this.queue = queueName;
}

/**
* Connection to the message bus
* 
* @returns {Promise}
*/
messageBus.prototype.connect = function()
{
    var url = this.url;
    var self = this;

    var p = new Promise(function( resolve, reject) {
        amqp.connect( url )
            .then( function( connection ) {
                connection.createChannel()
                    .then( function( channel ) {
                        this.channel = channel;
                        resolve( 'connected' );
                    }.bind( self ) )
                    .catch( function( err ) {
                        reject( err );
                    } );
            } )
            .catch( function( err ) {
                reject( err );
            } );
    });

    return p;
};

messageBus.prototype.sendMessage = function( message ) {
    this.channel.assertQueue(
        this.queue,
        {durable: false}
    ).then( function(_qok) {
        this.channel.sendToQueue( this.queue, new Buffer( message ) );
    }.bind( this ));
}

/**
* Consume the message and send an unshift from the queue
* 
* @returns {Promise}
*/
messageBus.prototype.consumeMessage = function()
{
    return new Promise( function( resolve, reject ) {
        this.channel.consume( this.queue, function( msg ) {
            resolve( msg );
        },
            {noAck:false}
        );
    }.bind( this ));
}

/**
* Message acknowledge
* 
* @param {object} message - Original message object to acknowledge 
* @returns {void}
*/
messageBus.prototype.acknowledge = function( message )
{
    this.channel.ack( message );
} 
module.exports = messageBus;
