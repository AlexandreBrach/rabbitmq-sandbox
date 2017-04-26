var config = require( './config');
var rabbit = config.rabbit;

var eventDispatcher = require( './event-dispatcher' );
var dispatcher = new eventDispatcher( rabbit.url, rabbit.queueName );
var dateformat = require( 'dateformat' );

dispatcher.connect().then( function(msg) {
    console.log( 'dispatcher returned : ' + msg );
    main();
} )
.catch( function( err ) {
    console.log( 'dispatcher creation failed !' );
    console.error( err );
} );

function main() {
    setInterval( function() {
        var now = dateformat( new Date(), 'MM:ss' );
        dispatcher.sendMessage( rabbit.routingKey, `Hello World ! (at ${now})` );
    }, 100 );
}
