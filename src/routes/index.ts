import express, { Request, Response } from 'express'
import signUp from './signUp'
import login from './login'
import user from './user'
import booking from './booking'


const routes = (app) => {
    app.route('/').get((req: Request, res: Response) => {
        res.status(200).send({ message: "Solar API default is runnign :)" })
    })

    app.use(
        express.json(),
        signUp,
        login,
        user,
        booking
    )
}

export default routes;