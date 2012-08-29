if (typeof STREAMPI == "undefined" || !STREAMPI) { var STREAMPI = {}; }

STREAMPI.namespace = function( ns, object ) {
    var pkg = window.STREAMPI;
    var cPkg = null;
    var pkgs = ns.split('.');

    // Initial "netflix" is implied.
    if(pkgs[0] === 'STREAMPI') { pkgs.shift(); }

    var len = pkgs.length;
    for ( var i = 0; i < len; ++i ) {
        cPkg = pkgs[i].toString();
        if ( !! cPkg ) {
            pkg = pkg[cPkg] = pkg[cPkg] || {};
        }
    }
    return pkg;
};
