
var syncWorker = function( worker ) {
    this.worker = worker;
}

/**
* Connect the worker to the bus
* 
* @param {messageBus} bus - the message bus
*/
syncWorker.prototype.connect = function( bus, work )
{
    var busy = false;
    bus.connect().then( function() {
        console.log( 'connected' );
        bus.consumeMessage( function( msg ) {
            if( busy ) {
                return;
            }
            busy = true;
            bus.acknowledge( msg );
            (work)( msg ).then( function() {
                bus.recover().then( function() {
                    busy = false;
                });
            });
        } );
    } )
    .catch( function( err ) {
        console.error( err );
    } );
    
}

module.exports = syncWorker;
