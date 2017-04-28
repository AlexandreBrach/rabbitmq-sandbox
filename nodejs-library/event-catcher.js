
var amqp = require('amqplib');

var eventCatcher = function( rabbitUrl, rabbitExchange ) {
    this.url = rabbitUrl;
    this.exchange = rabbitExchange;
}

/**
* set a function to be called at every received message
* 
* @param {function} callback - working function
* @returns {Promise}
*/
eventCatcher.prototype.catch = function( callback )
{
    /**
    * Consume the message and send an unshift from the queue
    * 
    * @returns {Promise}
    */
    consumeMessage = function( channel, queue, callback )
    {
        channel.consume( 
            queue, 
            callback,
            {noAck:false}
        )
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
eventCatcher.prototype.connect = function()
{
    var self = this;

    var p = new Promise(function( resolve, reject) {
        // Connection to server
        amqp.connect( this.url )
            .then( function( connection ) {
                self.connection = connection;
                // Channel creation
                self.connection.createChannel()
                    .then( function( channel ) {
                        self.channel = channel;
                        // Queue creation
                        channel.assertQueue(
                            self.queue,
                            {
                                durable: false,
                                autoDelete: true,
                                exclusive: true
                            }
                        ).then( function( data ) {
                            self.queue = data.queue;
                            // Queue binding to exchange
                            self.channel.bindQueue( self.queue, self.exchange, '' )
                            .then( function() {
                                resolve( `channel to ${self.url} created, queue name : ${self.queue}.`)
                            } )
                            .catch( reject );
                        } )
                        });
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

module.exports = eventCatcher;
