
var amqp = require('amqplib');

var messageBus = function( url, queueName ) {
    this.url = url;
    this.queue = queueName;
}

/**
* Queue creation
* 
* @returns {Promise}
*/
messageBus.prototype.createQueue = function(  )
{
    var self = this;
    return new Promise( function( resolve, reject ) {
        self.channel.assertQueue(
            self.queue,
            {durable: false}
        ).then( function(_qok) {
            resolve( 'queue created, ready to be used.');
        } )
        .catch( function( err ) {
            reject( err );
        });
    } );
}

/**
* Channel creation
* 
* @returns {Promise}
*/
messageBus.prototype.createChannel = function(  )
{
    var self = this;
    return new Promise( function( resolve, reject ) {
        self.connection.createChannel()
            .then( function( channel ) {
                console.log( 'channel creation' );
                self.channel = channel;
                self.createQueue()
                    .then( function() {
                        resolve( 'connected' );
                    } )
                    .catch( function( err ) { reject( err ); } );
            } )
            .catch( function( err ) { reject( err ); } );
    } );
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
                console.log( 'connected to : ' + self.url );
                self.connection = connection;
                self.createChannel()
                    .then( function() { resolve( 'channel + queue "' + self.queue + '" successfully created.')})
                    .catch( reject );
            }.bind( self ) )
            .catch( function( err ) {
                reject( err );
            } );
    });

    return p;
};

messageBus.prototype.sendMessage = function( message ) {
    this.channel.checkQueue(
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
messageBus.prototype.consumeMessage = function( callback )
{
    this.channel.consume( 
        this.queue, 
        callback,
        {noAck:false}
    );
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

/**
* recover unknownledged messages from the bus
* 
*/
messageBus.prototype.recover = function(  )
{
    return this.channel.recover();
}

module.exports = messageBus;
