const dependable = require('dependable');
const path = require('path');
const container = dependable.container();

const simpleDependencies = [
    ['_', 'lodash'],
    ['async', 'async'],
    ['validator', 'express-validator'],
    ['jwt', 'jsonwebtoken'],
    ['formidable', 'formidable'],
    ['User','./app/model/user']
]

simpleDependencies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    })
});

//Load the controllers
container.load(path.join(__dirname, './app/controller'));

container.register('container', function(){
    return container;
});

module.exports = container;