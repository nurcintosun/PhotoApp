
const Photo=require('../models/Photo')
const fs=require('fs')

exports.getAllPhoto=async(req,res)=>{ //yine asenkron yapı yapmalıyız
    
    const page=req.query.page || 1; //eğer page yoksa 1. sayfayı göster
    const photosPerPage=3; //her sayfada 3 foto göster

    const totalPhotos=await Photo.find().countDocuments();//toplam foto sayısı

    const photos=await Photo.find({})
    .sort('-dateCreated')
    .skip((page-1)*photosPerPage)
    .limit(photosPerPage)

    res.render('index',{
        photos:photos,
        current:page,
        pages:Math.ceil(totalPhotos / photosPerPage)
    });
    //Cektiğimiz fotoları index.ejs'ye göderiyoruz.
  /*  const photos=await Photo.find({})//Dataları veri tabanaından cekiyoruz
  res.render('index',{
        photos:photos
    });
    */
};

exports.getPhoto=async(req,res)=>{
   // console.log(req.params.id);
   // res.render('photo')
   const photo=await Photo.findById(req.params.id)
   res.render('photo',{
   photo:photo
   })
}

exports.createPhoto=async(req,res)=>{ //async ile asenkron yapı
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
      let uploadPath=__dirname+'/../public/uploads/'+uploadedImage.name
      //yeni klasör yolu olusturduk onun içine resimler

   
      uploadedImage.mv(uploadPath,async()=>{
       await Photo.create({
           ...req.body,
           image:'/uploads/'+uploadedImage.name
            })
            res.redirect('/');
      })
   };


   //UPDATE işleminde foto değiştirmeyi kaldıracağız UNUTMA

   exports.updatePhoto=async(req,res)=>{
    const photo=await Photo.findOne({_id: req.params.id});
photo.title=req.body.title 
photo.description=req.body.description
await photo.save();

res.redirect(`/photos/${req.params.id}`)
}


exports.deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findOne({ _id: req.params.id })
        
        // __dirname 'controllers' klasörünü verir. 
        // Bir üst klasöre çıkmak için başına '../' ekliyoruz
        let deletedImage = __dirname + '/../public' + photo.image;
        
        // Dosya diskte gerçekten var mı kontrol et, varsa sil (Çökmeyi önler)
        if (fs.existsSync(deletedImage)) {
            fs.unlinkSync(deletedImage);
        }
        
        await Photo.findByIdAndDelete(req.params.id)
        res.redirect('/');
    } catch (error) {
        // Bir hata oluşursa sunucunun çökmesini engellemek için hata mesajı dönüyoruz
        res.status(500).send("Fotoğraf silinirken bir hata oluştu.");
    }
}