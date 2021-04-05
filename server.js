const express = require('express');
const connectDB = require('./config/db');
const app = express();

//Connect DB
connectDB();

//nit MiddleWare
app.use(express.json({extended: false}));

app.get('/', (req,res) => res.send('API RUnning'));

//Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/owner', require('./routes/api/owner'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/group', require('./routes/api/group'));
app.use('/api/dailywork', require('./routes/api/dailywork'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started`));