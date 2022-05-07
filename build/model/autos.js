"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autos = void 0;
const mongoose_1 = require("mongoose");
// Definimos el Schema
const automovilSchema = new mongoose_1.Schema({
    _tipoObjeto: {
        type: String //Valores "A, "T"...
    },
    _precioBase: {
        type: Number
    },
    _potenciaMotor: {
        type: Number
    },
    _traccion: {
        type: String
    },
});
// La colecciรณn de la BD (Plural siempre)
exports.Autos = (0, mongoose_1.model)('automoviles', automovilSchema);
