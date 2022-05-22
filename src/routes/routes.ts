import {Request, Response, Router } from 'express'
import { Users } from '../model/userSchema'
import { Races } from '../model/racesSchema'
import { db } from '../database/database'
import { verifyToken } from '../middleware/authtoken'



class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }






    private postUser = async (req: Request, res: Response) => {

        const { v1: uuidv1 } = require('uuid')
        const bcyrpt = require('bcrypt')
        const jwt = require('jsonwebtoken')

        const hashedPassword = await bcyrpt.hash(req.body._password, 10)
        const sanitizedEmail = req.body._email.toLowerCase()

        let user = new Users ({  //traemos la informacion desde Angular y ajustamos en Node
            _userId: uuidv1(),
            _nombre: req.body._nombre,
            _password: hashedPassword,
            _email: sanitizedEmail ,
            _fechaNacimiento: req.body._fechaNacimiento,
            _fechaRegistro: req.body._fechaRegistro
            })

        console.log(user)

            //comprobar si el email ya existe en la base de datos
        await db.conectarBD()
            

            const emailExist = await Users.findOne({_email: sanitizedEmail})

            if(emailExist){
                res.send("duplicado")
            }
            else{
                const userSaved = await user.save()
            //.then(() => {
                if (userSaved) { 
                res.send("guardado")
                }
                else {
                    res.send('error')
                }

            //})
            /*.catch((err: any) => {
                res.send('error')
            })*/

            }
        db.desconectarBD()

    }

    private loginUser = async (req: Request, res: Response) => {

        const bcyrpt = require('bcrypt')
        const jwt = require('jsonwebtoken')

        const { email, password } = req.body
        
        console.log(email)

        const sanitizedEmail = email.toLowerCase()
        //const hashedPassword = await bcyrpt.hash(password, 10)

        await db.conectarBD()
        .then(async () => {
            const user = await Users.findOne({_email: sanitizedEmail})
            console.log(user)

            if(user){
                console.log("entro")
                const isPasswordValid = await bcyrpt.compare(password, user._password)
                console.log(isPasswordValid)
                if(isPasswordValid){
                    const token = jwt.sign( {user: user._nombre}, process.env.TOKEN_SECRET,  {expiresIn: 60*24})
                
                res.header('authorization', token).send(token)
                }
                else{
                    res.send('error')
                }
            }
            else{
                res.send('error')
            }}
            )
        .catch((err: any) => {
            db.desconectarBD()
            res.send('error')
        })
    }


    private getCircuitos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then(async () => {
            const year = parseInt(req.params.year) 
            console.log(year)
            const circuitos = await Races.aggregate([
                {"$match":{
                    "year": year
                    }
                },
                {
                    $lookup:{
                        "localField":"circuitId",
                    "from":"circuits",
                    "foreignField":"circuitId",
                    "as":"circuitDetail"
                    }
                },{
                    $unwind:"$circuitDetail"
                },   {
                    $project:{
                        _id:0,
                        name: "$circuitDetail.name",
                    }
                }
            
            ])
            console.log(circuitos)
            res.json(circuitos)
        

    })
    .catch((err: any) => {
        db.desconectarBD()
        res.send('error')
    })
}


private capado = async (req: Request, res: Response) => {
    
    res.json("entra")
}












    misRutas(){
        this._router.post('/user', this.postUser)
        this._router.post('/loginUser', this.loginUser)
        this._router.get('/carreras/:year', this.getCircuitos)
        this._router.get('/capado', verifyToken, this.capado)
    }
}

const obj = new DatoRoutes()
obj.misRutas()
export const routes = obj.router