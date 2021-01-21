'use strict';

module.exports = function(){

    return {
        setRouting: function(router) {
            router.get('/api', function(req, res){
                res.render('index');
            });
        }
    }
}