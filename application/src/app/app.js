var rabbit = {
    url : "amqp://rabbit:rabbit@message-bus",
    queueName : 'the.bus'
}

var messageBus = require( './message-bus' );
var theBus = new messageBus( rabbit.url, rabbit.queueName );
var dateformat = require( 'dateformat' );

theBus.connect().then( function(msg) {
    console.log( 'bus returned : ' + msg );
    main();
} )
.catch( function( err ) {
    console.log( 'bus creation failed !' );
    console.error( err );
} );

function main() {
    setInterval( function() {
        var now = dateformat( new Date(), 'MM:ss' );
        theBus.sendMessage( `Hello World ! (at ${now})` );
    }, 500 );
}
