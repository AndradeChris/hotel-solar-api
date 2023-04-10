import express, { Request, Response } from 'express'
import signUp from './signUp'


const routes = (app) => {
    app.route('/').get((req: Request, res: Response) => {
        res.status(200).send({ message: "Solar API default is runnign :)" })
    })

    app.use(
        express.json(),
        signUp
    )
}

export default routes;