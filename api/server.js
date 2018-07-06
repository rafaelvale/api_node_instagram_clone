var express = require('express'); 
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var objectID = require('mongodb').ObjectId;

var app = express();

//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),
    {}

);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/', function(req, res){
    res.send({msg: 'Olá'});

});

app.post('/api', function(req, res){

    var dados = req.body;

    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.insert(dados, function(err, records){
                if(err){
                    res.statusCode(400).json(err);

                }else{
                    res.statusCode(200).json(records);;
                }
                mongoClient.close();
            });

        });
    });

});

app.get('/api', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find().toArray(function(err, results){
                if(err){
                    res.statusCode(400).json(err);
                }
                else{
                    res.statusCode(200).json(results);
                }
                mongoClient.close();

            });

        });
    });

});
//GET by ID(ready)
app.get('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.find(objectID( req.params.id)).toArray(function(err, results){
                if(err){
                    res.statusCode(400).json(err);
                }
                else{
                    res.statusCode(200).json(results);
                }
                mongoClient.close();

            });

        });
    });

});

//PUT by ID(update)
app.put('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.update(
                { _id : objectID( req.params.id) },
                { $set : {titulo : req.body.titulo}},
                {},
                function(err, records){
                    if(err){
                        res.statusCode(400).json(err);
                    }else{
                        res.statusCode(200).json(records);
                    }

                    mongoClient.close();
                }
            );

        });
    });

});

//DELETE by ID
app.delete('/api/:id', function(req, res){
    db.open(function(err, mongoClient){
        mongoClient.collection('postagens', function(err, collection){
            collection.remove({ _id : objectID( req.params.id) }, function(err, records){
                if(err){
                    res.statusCode(400).json(err);
                }else{
                    res.statusCode(200).json(records);
                }
                mongoClient.close();
            });

        });
    });

});