import express from 'express'

export const app = express();


app.get('/', (req, res)=>{
    res.send('Server is working fine')
})
