
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3031;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoUrl = 'mongodb+srv://gabrielporfiriodev:32614930@cluster0.j9yte0g.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err);
});
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

const ItemSchema = new mongoose.Schema({
  nome: String,
  id: String,
  logo: String,
  forma: String,
  gols: Object,
  big: Object,
  clean: Object,
});

const Item = mongoose.model('Teams', ItemSchema);



// Rota POST para adicionar um item ao banco de dados
app.post('/api/teams', async (req, res) => {
  try {
    const newItem = new Item({
      nome: req.body.nome,
      id: req.body.id,
      logo: req.body.logo,
      forma: req.body.forma,
      gols: req.body.gols,
      big: req.body.big,
      clean: req.body.clean,
    });

    const itemSalvo = await newItem.save();
    res.json({ message: 'Item adicionado com sucesso', item: itemSalvo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota GET para obter todos os times do banco de dados
app.get('/api/teams', async (req, res) => {
  try {
    const times = await Item.find();
    res.json(times);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
