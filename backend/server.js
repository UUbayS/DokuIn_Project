const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors()); 
app.use(express.json()); 

// === Definisi Rute (Routes) ===


app.get('/', (req, res) => res.send('API DokuIn Berjalan'));


app.use('/api/auth', require('./routes/auth'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));