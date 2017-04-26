
var config = require( './config');
var rabbit = config.rabbit;

var syncWorker = require( './message-bus-syncWorker' );
        
function work( msg ) {
    var body = msg.content.toString();
    return new Promise( function( resolve, reject ) {
        setTimeout( function() {
            console.log( 'Process this message : ' + body );
            console.log( 'Acknowledge following tag : ' + msg.fields.deliveryTag );
            resolve( 'ok' );
        }
        ,1000 );
    } );
}

var worker = new syncWorker( rabbit.url, rabbit.queueName );
worker.connect()
    .then( function() {
        worker.work( work );
    } )
    .catch( function( err ) {
        console.log( err );
    } );
