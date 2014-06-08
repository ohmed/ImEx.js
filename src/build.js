/*
 * author: ohmed
*/

var fs = require( 'fs' );
var path = require( 'path' );
var argparse =  require( 'argparse' );
var uglify = require( 'uglify-js2' );

function processor ( fileName, inCode ) {

    var output = '\n// ' + fileName + '\n\n';

    var exportParams = [];
    var importParams = [];
    var namespace = '';

    var parts;
    var importBlock, param, paramScope;
    var importReplaceBlock;
    var i, il;

    //

    if ( !inCode.split('namespace ')[1] || !inCode.split('namespace ')[1].split(';')[0] ) {

        output += '( function ( scope ) {\n\n';
        output += inCode;
        output += '\n}) ( false );\n';

        return output;

    }

    //

    namespace = inCode.split('namespace ')[1].split(';')[0];
    inCode = inCode.replace( 'namespace ' + namespace + ';', '' );

    output += '( function ( scope ) {\n\n';

    // process import directive

    parts = inCode.split('import ');

    for ( i = 1, il = parts.length; i < il; i ++ ) {

        param = parts[ i ].split(';')[0];

        importBlock = 'import ' + param + ';';
        paramScope = param.replace( '.' + param.split('.')[ param.split('.').length - 1 ], '' );
        param = param.split('.')[ param.split('.').length - 1 ];

        importReplaceBlock = ''
        + 'var ' + param + ' = ' + paramScope + '.' + param + ';\n'
        + 'if ( !' + param + ' ) {\n'
        + '   ' + paramScope + '.__' + param + ' = ' + paramScope + '.__' + param + ' || [];\n'
        + '   ' + paramScope + '.__' + param + '.push( function ( obj ) { ' + param + ' = obj; } );\n'
        + '}\n';

        inCode = inCode.replace( importBlock, importReplaceBlock );

    }

    output += '\n';

    // process export directive

    parts = inCode.split('export ');

    for ( i = 1, il = parts.length; i < il; i ++ ) {

        exportParams.push( parts[ i ].split(' ')[0] );

    }

    //

    inCode = '    ' + inCode.replace( /export /g, 'var ' );
    inCode = inCode.replace( /\n/g, '\n    ' );

    output += inCode;

    for ( i = 0, il = exportParams.length; i < il; i ++ ) {

        param = exportParams[ i ];

        output += '\n';

        output += '    scope.' + param + ' = '  + param + ';\n';

        output += '    if ( scope.__' + param + ' ) {\n'
        output += '        for ( var i = 0, il = scope.__' + param + '.length; i < il; i ++ ) {\n'
        output += '            scope.__' + param + '[ i ]( ' + param + ' );\n';
        output += '        }\n';
        output += '        delete scope.__' + param + ';\n';
        output += '    }\n\n';

    }

    output += '\n}) ( ' + namespace + ' );';

    return output;

}

function main () {

    var parser = new argparse.ArgumentParser();
    parser.addArgument( ['--include'], { action: 'append', required: false } );
    parser.addArgument( ['--minify'], { action: 'storeTrue', defaultValue: false } );
    parser.addArgument( ['--output'], { defaultValue: '../build/out.js' } );
    
    var args = parser.parseArgs();
    
    var output = args.output;
    console.log( ' * Building ' + output );

    var buffer = [],
        sources = [],

        contents, files, file, data,

        i, il,
        j, jl;

    args.include = args.include || [ 'common' ];

    for ( i = 0, il = args.include.length; i < il; i ++ ) {

        if ( args.include[i].indexOf('/') !== -1 ) {

            contents = fs.readFileSync( args.include[i], 'utf8' );

        } else {

            contents = fs.readFileSync( './includes/' + args.include[i] + '.json', 'utf8' );

        }

        files = JSON.parse( contents );

        for ( j = 0, jl = files.length; j < jl; j ++ ){

            filepath = args.include[i].split('/');
            filepath.pop();
            filepath = './' + filepath.join('/') + '/';

            file = filepath + files[ j ];
            sources.push( file );
            data = fs.readFileSync( file, 'utf8' );

            buffer.push( processor( files[ j ], data ) + '\n\n' );

        }

    }

    console.log( 'Processed ' + buffer.length + ' files' );
    var temp = buffer.join( '' );
    
    if ( !args.minify ){

        fs.writeFileSync( output, temp, 'utf8' );

    } else {

        var result = uglify.minify( sources, { outSourceMap: undefined } );
        
        fs.writeFileSync( output.split('.js')[0] + '.min.js', result.code, 'utf8' );

    }

}

main();
