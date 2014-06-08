
// world.js

( function ( scope ) {


    
    
    
    var World = {
    
        fauna: [],
        flora: []
    
    };
    
    scope.World = World;
    if ( scope.__World ) {
        for ( var i = 0, il = scope.__World.length; i < il; i ++ ) {
            scope.__World[ i ]( World );
        }
        delete scope.__World;
    }


}) ( window );


// animal.js

( function ( scope ) {


    /*
     * animal base object
    */
    
    
    
    var Animal = function ( name, legNum ) {
    
        this.name = name;
        this.legNum = legNum;
    
        this.status = 'alive';
    
    };
    
    Animal.prototype = {
    
        kill: function () {
    
            this.status = 'dead';
    
        }
    
    };
    
    scope.Animal = Animal;
    if ( scope.__Animal ) {
        for ( var i = 0, il = scope.__Animal.length; i < il; i ++ ) {
            scope.__Animal[ i ]( Animal );
        }
        delete scope.__Animal;
    }


}) ( World );


// dog.js

( function ( scope ) {


    /*
     * Dog object, child of Animal class
    */
    
    
    
    var Animal = scope.Animal;
    if ( !Animal ) {
       scope.__Animal = scope.__Animal || [];
       scope.__Animal.push( function ( obj ) { Animal = obj; } );
    }
    
    
    var Dog = function ( name, legNum ) {
    
        Animal.call( this, name, legNum );
    
        this.barking = false;
    
    };
    
    Dog.prototype = Object.create( Animal.prototype );
    
    Dog.prototype = {
    
        constructor: Animal,
    
        bark: function () {
    
            this.barking = true;
    
        },
    
        stopBarking: function () {
    
            this.barking = false;
    
        }
    
    };
    
    
    scope.Dog = Dog;
    if ( scope.__Dog ) {
        for ( var i = 0, il = scope.__Dog.length; i < il; i ++ ) {
            scope.__Dog[ i ]( Dog );
        }
        delete scope.__Dog;
    }


}) ( World );


// farm.js

( function ( scope ) {


    /*
     * farm object
    */
    
    
    
    var Dog = scope.Dog;
    if ( !Dog ) {
       scope.__Dog = scope.__Dog || [];
       scope.__Dog.push( function ( obj ) { Dog = obj; } );
    }
    
    
    var Farm = {
    
    	animals: []
    
    };
    
    Farm.add = function ( animal ) {
    
    	this.animals.push( animal );
    
    };
    
    Farm.add( new Dog( 'fluffy', 4 ) );
    Farm.add( new Dog( 'boxer', 4 ) );
    Farm.add( new Dog( 'snobol', 4 ) );
    
    Farm.animals[1].bark();
    
    scope.Farm = Farm;
    if ( scope.__Farm ) {
        for ( var i = 0, il = scope.__Farm.length; i < il; i ++ ) {
            scope.__Farm[ i ]( Farm );
        }
        delete scope.__Farm;
    }


}) ( World );

