const express = require('express');
const cors = require('cors');
const { connectToDB } = require('./models/db');
const path = require('path');
const bodyParser = require('body-parser');
const sessionConfig = require('./session');

const addInitialData = require('./initialData');
const adminRouter = require('./routes');
const apiRouter = require('./APIroutes');


const PORT = 5000

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");


app.use(sessionConfig);

app.use('/api', apiRouter);
app.use('/', adminRouter); 

const start = async () => {
    
    try {
        
        await connectToDB()

        // await addInitialData()

        app.listen(PORT, () => console.log(`Server startered on port ${PORT}`));

    } catch (error) {
        console.error('Ошибка:', error);
    } 
    // console.log(process.env.DB_NAME)
    
  
}

start()