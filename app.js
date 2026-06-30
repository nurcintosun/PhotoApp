const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const Photo=require('./models/Photo');
const mongoose=require('mongoose');
const fileUpload=require('express-fileupload');
const fs=require('fs');
const methodOverride=require('method-override');
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
app.get('/',async(req,res)=>{ //yine asenkron yapı yapmalıyız
    const photos=await Photo.find({})//Dataları veri tabanaından cekiyoruz

    //Cektiğimiz fotoları index.ejs'ye göderiyoruz.
    res.render('index',{
        photos:photos
    });
});
app.get('/photos/:id',async(req,res)=>{
   // console.log(req.params.id);
   // res.render('photo')
   const photo=await Photo.findById(req.params.id)
   res.render('photo',{
   photo:photo
   })

});

app.get('/photos/edit/:id',async(req,res)=>{
const photo=await Photo.findOne({_id:req.params.id})
res.render('edit',{
    photo:photo
})
})


app.get('/add',(req,res)=>{
    res.render('add')
});
app.post('/photos',async(req,res)=>{ //async ile asenkron yapı
//console.log(req.files.image); //console.log ile resim dosyasını görebilme
   
    //veri tabanına kaydediyoruz 
    //yeni girdilerimizi
   // await Photo.create(req.body);
   // res.redirect('/'); //ana sayfaya yönlendirme



    const uploadDir='public/uploads';
    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir)
    }


    
   let uploadedImage=req.files.image
   let uploadPath=__dirname+'/public/uploads/'+uploadedImage.name
   //yeni klasör yolu olusturduk onun içine resimler

   uploadedImage.mv(uploadPath,async()=>{
    await Photo.create({
        ...req.body,
        image:'/uploads/'+uploadedImage.name
         })
         res.redirect('/');
   })
})
    
app.put('/photos/:id',async(req,res)=>{
    const photo=await Photo.findOne({_id: req.params.id});
photo.title=req.body.title 
photo.description=req.body.description
await photo.save();

res.redirect(`/photos/${req.params.id}`)
});


    app.delete('/photos/:id',async(req,res)=>{
    const photo=await Photo.findOne({_id:req.params.id})
    let deletedImage=__dirname+'/public'+photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndDelete(req.params.id)
    res.redirect('/');
})


const port=3000;
app.listen(port,()=>{
    console.log('Port 3000 de çalışmaya başladı...');
})