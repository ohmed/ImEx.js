/*
 * author: ohmed
*/

var fs = require("fs");
var path = require("path");
var argparse =  require( "argparse" );
var uglify = require("uglify-js2");
var spawn = require('child_process').spawn;

function process ( fileName, inCode ) {

    var output = '\n// ' + fileName + '\n\n';
    var exportParams = [];
    var importParams = [];
    var namespace = '';
    var parts;
    var i, il;

    if ( !inCode.split('namespace ')[1] || !inCode.split('namespace ')[1].split(';')[0] ) {

        output += '( function ( scope ) {\n\n';
        output += inCode;
        output += '\n}) ( false );\n';

        return output;

    }

    namespace = inCode.split('namespace ')[1].split(';')[0];
    inCode = inCode.replace( 'namespace ' + namespace + ';', '' );

    output += '( function ( scope ) {\n\n';

    //

    parts = inCode.split('import ');
    var importText, param;

    for ( i = 1, il = parts.length; i < il; i ++ ) {

        param = parts[ i ].split(';')[0];

        importText = 'import ' + param + ';';

        var impoerReplaceCode = ''
        + 'var ' + param + ' = scope.' + param + ';\n'
        + 'if ( !' + param + ' ) {\n'
        + '   scope.__' + param + ' = scope.__' + param + ' || [];\n'
        + '   scope.__' + param + '.push( function ( obj ) { ' + param + ' = obj; } );\n'
        + '}\n';

        inCode = inCode.replace( importText, impoerReplaceCode );

    }

    output += '\n';

    //

    parts = inCode.split('export ');

    for ( i = 1, il = parts.length; i < il; i ++ ) {

        exportParams.push({
            name: parts[ i ].split(' ')[0]
        });

    }

    //

    inCode = '    ' + inCode.replace( /export /g, 'var ' );
    inCode = inCode.replace( /\n/g, '\n    ' );

    output += inCode;

    for ( i = 0, il = exportParams.length; i < il; i ++ ) {

        output += '\n';

        output += '    scope.' + exportParams[ i ].name + ' = '  + exportParams[ i ].name + ';\n';

        output += '    if ( scope.__' + exportParams[ i ].name + ' ) {\n'
        output += '        for ( var i = 0, il = scope.__' + exportParams[ i ].name + '.length; i < il; i ++ ) {\n'
        output += '            scope.__' + exportParams[ i ].name + '[ i ]( ' + exportParams[ i ].name + ' );\n';
        output += '        }\n';
        output += '        delete scope.__' + exportParams[ i ].name + ';\n';
        output += '    }\n\n';

    }

    output += '\n}) ( ' + namespace + ' );';

    return output;

}

function main () {

    "use strict";

    var parser = new argparse.ArgumentParser();
    parser.addArgument( ['--include'], { action: 'append', required: true } );
    parser.addArgument( ['--externs'], { action: 'append', defaultValue: ['./externs/common.js'] } );
    parser.addArgument( ['--minify'], { action: 'storeTrue', defaultValue: false } );
    parser.addArgument( ['--output'], { defaultValue: '../../build/NWE.min.js' } );
    parser.addArgument( ['--sourcemaps'], { action: 'storeTrue', defaultValue: false } );
    
    var args = parser.parseArgs();
    
    var output = args.output;
    console.log( ' * Building ' + output );
    
    var sourcemap = '';
    var sourcemapping = '';

    if ( args.sourcemaps ) {

        sourcemap = output + '.map';
        sourcemapping = '\n//@ sourceMappingURL=' + sourcemap;

    }

    var buffer = [],
        sources = [],

        contents, files, file,

        i, il,
        j, jl;

    for ( i = 0, il = args.include.length; i < il; i ++ ){
        
        contents = fs.readFileSync( './includes/' + args.include[i] + '.json', 'utf8' );
        files = JSON.parse( contents );
        var data = '';

        for ( j = 0, jl = files.length; j < jl; j ++ ){

            file = '../../' + files[ j ];
            sources.push( file );
            data = fs.readFileSync( file, 'utf8' );

            buffer.push( process( files[ j ], data ) + '\n\n' );

        }

    }

    console.log( buffer.length );
    var temp = buffer.join( '' );
    
    if ( !args.minify ){

        fs.writeFileSync( output, temp, 'utf8' );

    } else {

        var result = uglify.minify( sources, { outSourceMap: sourcemap } );
        
        fs.writeFileSync( output, result.code + sourcemapping, 'utf8' );

        if ( args.sourcemaps ) {

            fs.writeFileSync( sourcemap, result.map, 'utf8' );

        }

    }

}

main();
