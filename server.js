
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://trae1:maddoxmadison@cluster0.zrdyp4m.mongodb.net/?retryWrites=true&w=majority'



MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')

    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.put('/quotes',(req, res)=>{
        quotesCollection.findOneAndUpdate(
            {name: 'yoda'},
            {
                $set: {
                    name:req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert:true
            }
           
        )
        .then(results => {
            console.log(results)
            res.json('success')
        })
        .catch(error => console.error(error))
    })
    app.listen(3000, function(){
        console.log('listening on 3000')
    })
    
    app.get('/', (req, res) =>{
        quotesCollection.find().toArray()
            .then(results =>{
                console.log(results)
                res.render('index.ejs',{quotes: results})
            })
            .catch(error => console.error(error))
        
    })
    
    app.post('/quotes', (req, res)=> {
        quotesCollection.insertOne(req.body)
        .then(result =>{
           res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes',(req,res) =>{
        quotesCollection.deleteOne(
        {name: req.body.name}
        )
        .then(result => {
            if (result.deletedCount === 0){
                return res.json('No quote to delete')
            }
            res.json("Delete Darth Vader's quote")
        })
        .catch(error => console.error(error))
    })
    
  })
  .catch(error => console.error(error))
  




