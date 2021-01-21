const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: [true, "El nombre es obligatorio!"]
    },
    email: {
        type: String,
        min: [5, "Correo inválido"],
        unique: [true, "Ya existe un usuario con el correo informado!"],
        trim: true,
        lowercase: true,
        required: [true, "El correo es obligatorio!"]
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        role: {
            type: String,
            required: true
        }
    }],
    enable: {
        type: Boolean,
        default: true
    },
    lastconnect: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next){
    if (!this.isModified('password')) return next();
    const user = this;
    
    bcrypt.genSalt(10, function(err, salt){
        if (err){ return next(err) }

        bcrypt.hash(user.password, bcrypt.genSaltSync(10), null, function(err, hash){
            if(err){return next(err)}

            user.password = hash;
            next();
        })
   })
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);