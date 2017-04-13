var rabbit = {
    url : "amqp://rabbit:rabbit@message-bus",
    queueName : 'the.bus'
}

var messageBus = require( './message-bus' );
var bus = new messageBus( rabbit.url, rabbit.queueName );
var syncWorker = require( './message-bus-syncWorker' );
var worker = new syncWorker();
        
worker.connect( bus, function( msg ) {
    var body = msg.content.toString();
    return new Promise( function( resolve, reject ) {
        setTimeout( function() {
            console.log( 'Process this message : ' + body );
            console.log( 'Acknowledge following tag : ' + msg.fields.deliveryTag );
            resolve( 'ok' );
        }
        ,10 );
    });
} );
