
var config = require( './config');
var rabbit = config.rabbit;

var EventCatcher = require( '../library/event-catcher' );
        
function event( msg ) {
    var body = msg.content.toString();
    return new Promise( function( resolve, reject ) {
            console.log( 'Process this message : ' + body );
            console.log( 'Acknowledge following tag : ' + msg.fields.deliveryTag );
            resolve( 'ok' );
    } );
}

var worker = new EventCatcher( rabbit.url, rabbit.exchange );
worker.connect()
    .then( function() {
        worker.catch( event );
    } )
    .catch( function( err ) {
        console.log( err );
    } );
