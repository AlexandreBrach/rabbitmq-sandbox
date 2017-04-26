
var amqp = require('amqplib');

var eventDispatcher = function( url, queueName ) {
    this.url = url;
    this.exchange = queueName;
}

/**
* Exchange creation
* 
* @param {string} name - the name of the exchange
* @returns {Promise}
*/
eventDispatcher.prototype.createExchange = function( name )
{
    var self = this;
    return new Promise( function( resolve, reject ) {
        self.channel.assertExchange(
            name,
            'topic',
            {durable: false}
        ).then( function(_qok) {
            resolve( 'exchange created, ready to be used.');
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
eventDispatcher.prototype.createChannel = function( channelName )
{
    var self = this;
    return new Promise( function( resolve, reject ) {
        self.connection.createChannel()
            .then( function( channel ) {
                console.log( 'channel creation' );
                self.channel = channel;
                self.createExchange( channelName )
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
eventDispatcher.prototype.connect = function()
{
    var url = this.url;
    var self = this;

    var p = new Promise(function( resolve, reject) {
        amqp.connect( url )
            .then( function( connection ) {
                console.log( 'connected to : ' + self.url );
                self.connection = connection;
                self.createChannel( this.exchange )
                    .then( function() { resolve( 'channel + exchange "' + self.exchange + '" successfully created.')})
                    .catch( reject );
            }.bind( self ) )
            .catch( function( err ) {
                console.log( 'Unable to connect !' );
                console.log( err );
                console.log( 'Retry in 3 seconds' );
                setTimeout( function() {
                    self.connect()
                        .then( resolve )
                        .catch( reject );
                }, 3000 );
            } );
    });

    return p;
};

eventDispatcher.prototype.sendMessage = function( routingKey, message ) {
    this.channel.publish( this.exchange, routingKey, new Buffer( message ) );
}

module.exports = eventDispatcher;
