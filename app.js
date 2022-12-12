import express from 'express';
import mongoose from 'mongoose';
import stuffRouter from './routes/stuff.js';
import userRouter from './routes/user.js';

mongoose.connect("mongodb+srv://backendcourse:<password>@atlascluster.t4rh7co.mongodb.net/?retryWrites=true&w=majority", 
{useNewUrlParser: true,
    UseUnifiedTopology: true})
    .then(() => console.log('Connexion réussie'))
    .catch(() => console.log('Connexion échouée'))

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static('../backend/images'))
app.use('/api/stuff', stuffRouter)
app.use('/api/auth', userRouter)

export default app;