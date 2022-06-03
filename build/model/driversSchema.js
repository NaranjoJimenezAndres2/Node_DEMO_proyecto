"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drivers = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    stop: {
        type: Number,
    },
    year: {
        type: Number,
    },
    duration: {
        type: String,
    },
});
exports.Drivers = (0, mongoose_1.model)('Drivers', driverSchema);
