const fs = require('fs')

module.exports = class Container {
    constructor (filepath){
        this.filepath = filepath
        this.createFileIfNotExists();
        const data = fs.readFileSync(this.filepath, 'utf-8');
        this.products = JSON.parse(data)
    }

    createFileIfNotExists() {
        if(!fs.existsSync(this.filepath)) {
            fs.writeFileSync(this.filepath, "[]")
        }
    }

    saveAll = async (data) => {
        try{
            const stringData = JSON.stringify(data, null, 2)
            await fs.promises.writeFile(this.filepath, stringData, 'utf-8')
        }catch (err){
            console.log(err)
        }
    }

    save = async (newObj) =>{
        try{
            const lastId = this.products.reduce(
                (acc, el) =>{
                    return el.id > acc ? el.id : acc
                }, 0
            )
            
            const newId = lastId + 1
            
            newObj.id = newId
            
            this.products.push(newObj)
            await this.saveAll(this.products)
            return newId
        } catch (err){
            console.log(err)
        }
    }

    //Get all
    getAllProds = () =>{
        return this.products
    }

    //Get product by id
    getProdById = (id) =>{
       return this.products.find(p => p.id == id)
    }

    deleteAll = () => {
        this.products = [];
        this.saveAll([]);
    }

    deleteById = (id) =>{
        const filter = this.products.filter(prod => prod.id !== id)
        this.products = filter
        this.saveAll(this.products)
    }

    updateById = (id, newObj) =>{
        const index = this.products.findIndex(prod => prod.id === id)
        this.products[index] = newObj
        this.saveAll(this.products)
    }
}