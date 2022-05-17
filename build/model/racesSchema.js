"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Races = void 0;
const mongoose_1 = require("mongoose");
const racesSchema = new mongoose_1.Schema({
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
});
exports.Races = (0, mongoose_1.model)('Races', racesSchema);
