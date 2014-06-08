/*
 * animal base object
*/

namespace World;

export Animal = function ( name, legNum ) {

    this.name = name;
    this.legNum = legNum;

    this.status = 'alive';

};

Animal.prototype = {

    kill: function () {

        this.status = 'dead';

    }

};
