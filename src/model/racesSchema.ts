import { Schema, model } from 'mongoose';

const racesSchema = new Schema({
    raceId: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: Number,
    },
    round: {
        type: Number,
    },
    circuitId: {
        type: String,
    },
    name: {
        type: String,
    },
    date: {
        type: String,
    }
})


export const Races = model('Races', racesSchema);