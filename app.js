const express=require('express');
const app=express();
const ejs=require('ejs');
const mongoose=require('mongoose');
const fileUpload=require('express-fileupload');
const methodOverride=require('method-override');
const photoControllers = require('./controllers/photoControllers');
const pageControllers=require('./controllers/pageControllers');
//Mongoose bağlama
mongoose.connect('mongodb://localhost/PhotoApp-test-db')

//Middleware
app.use(fileUpload({
    createParentPath: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method',{
methods:['POST','GET']
}));


//Template Engine
app.set("view engine","ejs");
 

//ROUTES
//Ana Sayfama foto eklemek istediğimde index 
//Fotografımızı buraya eklemek istiyoruz
app.get('/',photoControllers.getAllPhoto);
app.get('/photos/:id',photoControllers.getPhoto);
app.post('/photos',photoControllers.createPhoto);
app.put('/photos/:id',photoControllers.updatePhoto);
app.delete('/photos/:id',photoControllers.deletePhoto);
app.get('/photos/edit/:id',pageControllers.getEditPage);
app.get('/add',pageControllers.getAddPage);
app.get('/about',pageControllers.getAboutPage);

const port=3000;
app.listen(port,()=>{
    console.log('Port 3000 de çalışmaya başladı...');
})