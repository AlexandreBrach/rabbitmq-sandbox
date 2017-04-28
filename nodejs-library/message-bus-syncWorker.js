
//var messageBus = require( './message-bus' );
var amqp = require('amqplib');

var syncWorker = function( rabbitUrl, rabbitQueueName ) {
    this.url = rabbitUrl;
    this.queue = rabbitQueueName;
    //this.bus = new messageBus( rabbitUrl, rabbitQueueName );
}

/**
* @TODO
* 
* @param {}  -  
* @returns {}
*/
syncWorker.prototype.createExchange = function(  )
{
    self.createExchange( channelName )
        .then( function(message) {
            resolve( `connected : ${message}` );
        } )
        .catch( function( err ) { reject( err ); } );
}

/**
* set a function to be called at every received message
* 
* @param {function} callback - working function
* @returns {Promise}
*/
syncWorker.prototype.work = function( callback )
{
    /**
    * Consume the message and send an unshift from the queue
    * 
    * @returns {Promise}
    */
    consumeMessage = function( channel, queue, callback )
    {
        return channel.assertQueue(
            queue,
            {durable: false}
        )
        .then( function(_qok) {
            channel.consume( 
                queue, 
                callback,
                {noAck:false}
            )
        } );
    }

    var busy = false;

    consumeMessage( this.channel, this.queue, function( msg ) {
        if( busy ) return; 
        busy = true;
        this.channel.ack( msg );
        (callback)( msg ).then( function() {
            this.channel.recover().then( function() {
                busy = false;
            });
        }.bind( this ));
    }.bind(this) ).catch( function( err ) { 
        console.error( err ) 
    } );
}

/**
* Connect to the server and create channel
* 
* @returns {Promise}
*/
syncWorker.prototype.connect = function()
{
    var self = this;

    var p = new Promise(function( resolve, reject) {
        amqp.connect( this.url )
            .then( function( connection ) {
                self.connection = connection;

                self.connection.createChannel()
                    .then( function( channel ) {
                        self.channel = channel;
                        resolve( `channel to ${self.url} created.`)})
                    } )
                    .catch( function( err ) { reject( err ); } );
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
    return p;
}

module.exports = syncWorker;
