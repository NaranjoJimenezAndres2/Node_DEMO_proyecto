import {Request, Response, Router } from 'express'
import { disconnect } from 'process'

import { db } from '../database/database'
import { Users } from '../models/userSchema'
import { iUser } from '../models/userSchema'


const { v1: uuidv1 } = require('uuid')
const bcyrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }



    private postUser = async (req: Request, res: Response) => {

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
                
            /*    const token = jwt.sign({ userSaved}, 'secretkey', {expiresIn: 60*24})

                res.json(token)*/

            }
            else {
                res.send('error')
            }

            //})
            /*.catch((err: any) => {
                res.send('error')
            })*/

        }

    }


    //comprobar si coinciden el email y la contraseña del usuario recibido

    private loginUser = async (req: Request, res: Response) => {

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
                const token = jwt.sign( {user}, ' secretkey',  {expiresIn: 60*24})
                
               res.json({token}) 
            }
            else{
            res.send('error')
            }
        }
        else{
            res.send('error')
        }}
        )
    }

 


    
    
















    misRutas() {
        this._router.post('/user', this.postUser)
        this._router.post('/loginUser', this.loginUser)
    }



}




const obj = new Routes()
obj.misRutas()
export const routes = obj.router

