"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
const userSchema = new mongoose_1.Schema({
    _userId: {
        type: String,
        required: true,
        unique: true,
    },
    _nombre: {
        type: String,
    },
    _password: {
        type: String,
    },
    _email: {
        type: String,
        unique: true,
    },
    _fechaNacimiento: {
        type: Date,
    },
    _fechaRegistro: {
        type: Date,
    }
});
userSchema.plugin(uniqueValidator, { message: 'Error, el email ya existe' });
exports.Users = (0, mongoose_1.model)('Users', userSchema);
