"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const userSchema_1 = require("../model/userSchema");
const racesSchema_1 = require("../model/racesSchema");
const driversSchema_1 = require("../model/driversSchema");
const database_1 = require("../database/database");
const authtoken_1 = require("../middleware/authtoken");
class DatoRoutes {
    constructor() {
        this.postUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { v1: uuidv1 } = require('uuid');
            const bcyrpt = require('bcrypt');
            const jwt = require('jsonwebtoken');
            const hashedPassword = yield bcyrpt.hash(req.body._password, 10);
            const sanitizedEmail = req.body._email.toLowerCase();
            let user = new userSchema_1.Users({
                _userId: uuidv1(),
                _nombre: req.body._nombre,
                _password: hashedPassword,
                _email: sanitizedEmail,
                _fechaNacimiento: req.body._fechaNacimiento,
                _fechaRegistro: req.body._fechaRegistro
            });
            console.log(user);
            //comprobar si el email ya existe en la base de datos
            yield database_1.db.conectarBD();
            const emailExist = yield userSchema_1.Users.findOne({ _email: sanitizedEmail });
            if (emailExist) {
                res.send("duplicado");
            }
            else {
                const userSaved = yield user.save();
                //.then(() => {
                if (userSaved) {
                    res.send("guardado");
                }
                else {
                    res.send('error');
                }
                //})
                /*.catch((err: any) => {
                    res.send('error')
                })*/
            }
            database_1.db.desconectarBD();
        });
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const bcyrpt = require('bcrypt');
            const jwt = require('jsonwebtoken');
            const { email, password } = req.body;
            console.log(email);
            const sanitizedEmail = email.toLowerCase();
            //const hashedPassword = await bcyrpt.hash(password, 10)
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const user = yield userSchema_1.Users.findOne({ _email: sanitizedEmail });
                console.log(user);
                if (user) {
                    console.log("entro");
                    const isPasswordValid = yield bcyrpt.compare(password, user._password);
                    console.log(isPasswordValid);
                    if (isPasswordValid) {
                        const token = jwt.sign({ user: user._nombre }, process.env.TOKEN_SECRET, { expiresIn: 60 * 24 });
                        res.header('authorization', token).send(token);
                    }
                    else {
                        res.send('error');
                    }
                }
                else {
                    res.send('error');
                }
            }))
                .catch((err) => {
                database_1.db.desconectarBD();
                res.send('error');
            });
        });
        this.getCircuitos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const year = parseInt(req.params.year);
                console.log(year);
                const circuitos = yield racesSchema_1.Races.aggregate([
                    { "$match": {
                            "year": year
                        }
                    },
                    {
                        $lookup: {
                            "localField": "circuitId",
                            "from": "circuits",
                            "foreignField": "circuitId",
                            "as": "circuitDetail"
                        }
                    }, {
                        $unwind: "$circuitDetail"
                    }, {
                        $project: {
                            _id: 0,
                            "name": 1,
                            name2: "$circuitDetail.name",
                        }
                    }
                ]);
                console.log(circuitos);
                res.json(circuitos);
            }))
                .catch((err) => {
                database_1.db.desconectarBD();
                res.send('error');
            });
        });
        this.capado = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json("entra");
        });
        this.getBoxes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const year = parseInt(req.params.year);
                const gp = req.params.gp;
                const code = req.params.code;
                const boxes = yield driversSchema_1.Drivers.aggregate([
                    {
                        $match: {
                            "code": code
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "code": 1,
                            "driverId": 1,
                        }
                    },
                    {
                        $lookup: {
                            "localField": "driverId",
                            "from": "driver_standings",
                            "foreignField": "driverId",
                            "as": "standings"
                        }
                    },
                    {
                        $unwind: "$standings"
                    },
                    {
                        $project: {
                            _id: 0,
                            "code": 1,
                            "driverId": 1,
                            "raceId": "$standings.raceId",
                        }
                    },
                    {
                        $lookup: {
                            "localField": "raceId",
                            "from": "races",
                            "foreignField": "raceId",
                            "as": "races"
                        }
                    },
                    {
                        $unwind: "$races"
                    },
                    {
                        $project: {
                            _id: 0,
                            "code": 1,
                            "driverId": 1,
                            "raceId": 1,
                            "name": "$races.name",
                            "year": "$races.year"
                        }
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    "name": gp,
                                    "year": year
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            "from": "pit_stops",
                            "let": {
                                "driverId": "$driverId",
                                "raceId": "$raceId"
                            },
                            "pipeline": [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                {
                                                    $eq: ["$driverId", "$$driverId"]
                                                },
                                                {
                                                    $eq: ["$raceId", "$$raceId"]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            "as": "pitStops"
                        }
                    },
                    {
                        $unwind: "$pitStops"
                    },
                    {
                        $project: {
                            _id: 0,
                            "stop": "$pitStops.stop",
                            "duration": "$pitStops.duration"
                        }
                    },
                    {
                        $sort: {
                            "stop": 1
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            "duration": 1,
                        }
                    },
                ]);
                console.log(boxes);
                res.json(boxes);
            }))
                .catch((err) => {
                database_1.db.desconectarBD();
                res.send('error');
            });
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.post('/user', this.postUser);
        this._router.post('/loginUser', this.loginUser);
        this._router.get('/carreras/:year', this.getCircuitos);
        this._router.get('/capado', authtoken_1.verifyToken, this.capado);
        this._router.get('/boxes/:year/:gp/:code', authtoken_1.verifyToken, this.getBoxes);
    }
}
const obj = new DatoRoutes();
obj.misRutas();
exports.routes = obj.router;
