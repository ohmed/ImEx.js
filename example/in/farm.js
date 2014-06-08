/*
 * farm object
*/

namespace window;

import World.fauna.Dog;

export Farm = {

	animals: []

};

Farm.add = function ( animal ) {

	this.animals.push( animal );

};

Farm.add( new Dog( 'fluffy', 4 ) );
Farm.add( new Dog( 'boxer', 4 ) );
Farm.add( new Dog( 'snobol', 4 ) );

Farm.animals[1].bark();
