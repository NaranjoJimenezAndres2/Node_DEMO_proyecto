import { Schema, model } from 'mongoose';

var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    _userId:
    {
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
    }});

    export type iUser = {
        _userId: string,
        _nombre: string,
        _password: string,
        _email: string,
        _fechaNacimiento: Date,
        _fechaRegistro: Date
    }   


    userSchema.plugin(uniqueValidator, { message: 'Error, el email ya existe' });


    export const Users = model('Users', userSchema);


