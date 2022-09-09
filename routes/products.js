const Container = require('../class.js')
const prodContainer = new Container('products.json')
const {Router} = require('express')
const router = Router()
const multer = require('multer')
const admin = false



//multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+"/public/uploads")
    },
    filename: function (req, file, cb){
        cb(null, file.originalname )
    }
})

router.use(multer({storage}).single("thumbnail"))


 


router.get('/', (req, res) =>{
    res.send(prodContainer.getAllProds())
})

router.get('/:id', (req, res) =>{
    const {id} = req.params
    
    if (prodContainer.getProdById(id) == undefined){
        res.json({error: 'producto no encontrado'})
    } else{
        res.send(prodContainer.getProdById(id))
    }
})

router.post('/', async (req, res) =>{
    if(admin){
        const newObj = req.body
        const objImg = req.file
        newObj.thumbnail = `/uploads/${objImg.filename}`
        prodContainer.save(newObj)
        res.redirect("/")
    } else {
        res.render('error', { error: err, description: "Not Authorized" });
    }
})

router.put('/:id', async (req, res) =>{
    if(admin){
        const {id} = req.params
        const body = req.body
        const objImg = req.file
        newObj.thumbnail = `/uploads/${objImg.filename}`
        if (await prodContainer.getProdById(id) == undefined){
            return res.json({error: 'producto no encontrado'})
        }
        const newObj ={
            title: body.title,
            price: body.price,
            thumbnail: newObj.thumbnail
        }
        prodContainer.updateById(id, newObj)
        res.send(newObj)
    } else {
        res.render('error', { error: err, description: "Not Authorized" });
    }
})

router.delete('/:id', async (req, res) =>{
    if(admin){
        const {id} = req.params
        prodContainer.deleteById(id)
        res.redirect("/")
    } else {
        res.render('error', { error: err, description: "Not Authorized" });
    }
})


module.exports = router