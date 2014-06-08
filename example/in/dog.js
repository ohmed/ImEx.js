/*
 * Dog object, child of Animal class
*/

namespace World;

import Animal;

export Dog = function ( name, legNum ) {

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

