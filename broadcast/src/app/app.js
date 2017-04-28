var config = require( './config');
var rabbit = config.rabbit;

var MessageBroadcast = require( '../library/message-broadcast' );
var broadcast = new MessageBroadcast( rabbit.url, rabbit.exchange );
var dateformat = require( 'dateformat' );

broadcast.connect().then( function(msg) {
    console.log( 'broadcast returned : ' + msg );
    main();
} )
.catch( function( err ) {
    console.log( 'broadcast creation failed !' );
    console.error( err );
} );

function main() {
    setInterval( function() {
        var now = dateformat( new Date(), 'MM:ss' );
        broadcast.sendMessage( `Hello World ! (at ${now})` );
    }, 1000 );
}
