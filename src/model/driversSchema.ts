import { Schema, model } from 'mongoose';


const driverSchema = new Schema({
    code: {
        type: String,
    },
    name: {
        type: String,        
    },
    stop:{
        type: Number,
    },
    year: {
        type: Number,
    },
    duration: {
        type: String,
    },


})


export const Drivers = model('Drivers', driverSchema);