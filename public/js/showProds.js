const socket =  io()

socket.on('connection', () => {
    console.log('Connected to SV')
})

socket.on('allProds', (products) =>{
    const url = 'http://localhost:8000/showProducts.hbs';
    fetch(url).then((res) => {
        console.log(res)
        return res.text()
    }).then((text) => {
        const template = Handlebars.compile(text)
        const html = template({products: products})
        document.querySelector('#products').innerHTML = html
    })
})

const addProd = () =>{
    const newObj = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,

    }
    socket.emit('newProd', newObj)
}

