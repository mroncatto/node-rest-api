'use strict';

module.exports = function (async, User, validator) {

    return {
        setRouting: function (router) {

            //Obtiene todos los usuarios
            router.get('/api/v1/user', function (req, res) {
                User.find(function (err, doc) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).send(doc);
                    }
                });
            });

            // Obtiene un usuario especifico
            router.get('/api/v1/user/:id', function (req, res) {
                function getUser(callback) {
                    User.findById(req.params.id
                        , (err, result) => {
                            callback(err, result);
                        });
                }

                async.parallel([getUser], (err, results) => {
                    const res1 = results[0];
                    if (err) {
                        res.status(404).send({
                            "message": "Usuario no encontrado!",
                            "error": err
                        });
                    } else {
                        res.status(200).send(res1);
                    }
                });
            });

            //Cadastra usuario
            router.post('/api/v1/user',
                [
                    validator.check('fullname').not().isEmpty().isLength({ min: 5 })
                        .withMessage('El nombre es obligatorio y debe contener mínimo 5 caracteres!'),
                    validator.check('email').not().isEmpty().isEmail()
                        .withMessage('El correo es obligatorio y no puede repetirse!'),
                    validator.check('password').not().isEmpty().isLength({ min: 6 })
                        .withMessage('La contraseña es obligatoria y debe contener mínimo 5 caracteres!')
                ], this.postValidation, function (req, res) {
                    const u = new User(req.body);
                    u.save(function (err, user) {
                        if (err) {
                            switch (err.code) {
                                case 11000: res.status(400).send({ "error": "Los datos informados ya existen en la base de datos!", "Err": err })
                                    break;
                                default: res.status(500).send({ "error": err })
                            }
                        } else {
                            res.status(201).send({
                                "message": "Usuario registrado con éxito!",
                                "user": user
                            });
                        }
                    });
                });

            // Altera un usuario especifico
            router.put('/api/v1/user/:id', function (req, res) {
                function updateUser(callback) {
                    User.findByIdAndUpdate(req.params.id, {
                        "fullname": req.body.fullname
                    }, {
                        new: true
                    }, (err, result) => {
                        callback(err, result);
                    });
                }

                async.parallel([updateUser], (err, results) => {
                    const res1 = results[0];
                    if (err) {
                        res.status(500).send({ "error": err });
                    } else {
                        res.status(201).send({
                            "message": "Usuario alterado con éxito!",
                            "user": res1
                        });
                    }
                });

            });


            // Inactiva usuario especifico
            router.delete('/api/v1/user/:id', function (req, res) {
                function deleteUser(callback) {
                    User.findByIdAndUpdate(req.params.id, {
                        "enable": false
                    }, {
                        new: true
                    }, (err, result) => {
                        callback(err, result);
                    });
                }

                async.parallel([deleteUser], (err, results) => {
                    const res1 = results[0];
                    if (err) {
                        res.status(500).send({ "error": err });
                    } else {
                        res.status(201).send({
                            "message": "Usuario inactivado con éxito!",
                            "user": res1
                        });
                    }
                });
            });


            // Altera roles al usuario
            router.put('/api/v1/user/:id/role', function (req, res) {
                function updateRoles(callback) {
                    User.findByIdAndUpdate({
                        "_id": req.params.id
                    }, {
                        "roles": req.body
                    }, {
                        new: true
                    }, (err, result) => {
                        callback(err, result)
                    });
                }

                async.parallel([updateRoles], (err, results) => {
                    const res1 = results[0];
                    if (err) {
                        res.status(500).send({ "error": err });
                    } else {
                        res.status(201).send({
                            "message": "Roles actualizados con éxito!",
                            "user": res1
                        });
                    }
                });

            });

        },

        postValidation: function (req, res, next) {
            const err = validator.validationResult(req);
            const reqErros = err.array();
            const errors = reqErros.filter(e => e.msg !== 'Invalid value');
            let messages = [];
            errors.forEach((error) => {
                messages.push(error);
            });
            if (messages.length == 0) {
                return next();
            } else {
                res.status(400).send(messages);
            }
        }
    }
}