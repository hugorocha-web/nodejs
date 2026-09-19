import express, { response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
//importando primeiro o express e a ferramenta pra conectar 
//com o banco de dados



const port = 3000
const app = express()

//depois inicio o express colocando na variavel app
process.loadEnvFile()
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('banco conectado com sucesso'))
.catch(()=> console.log('erro ao conectar o banco'))

//isso cria um formato de arquivo pro banco
const usuarioSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    idade: {type: Number, required: true},
    email: {type: String, required: true, unique:true}
}, {timestamps: true}
)

//criei o usuario agora é mandar pra ele modelar
const Usuario = mongoose.model('Usuario', usuarioSchema)

//agora conectei o bando e adicionei o then 

app.use(cors())
app.use(express.json())
//avisando que vou usar json



//agora defino rotas
//vamos usar os promises(promessa)
app.get('/users', async (req, res) => {//mandar os usuarios
    let usuariosBanco = await Usuario.find()
    res.json(usuariosBanco)

})
app.post('/users', async (req, res) => {//cadastrar novos usuarios
    try {
        let novouser = req.body
        let usuarioCriado = await Usuario.create(novouser)
        res.json(usuarioCriado)
    } 
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                erro: 'Este e-mail já está cadastrado'
            })
        }
        res.status(500).json({
            erro: 'Erro interno do servidor'
        })
    }

})
app.delete('/users/:email', async (req, res) => {
    const email = req.params.email

    const usuario = await Usuario.findOneAndDelete({ email: email })

    if (!usuario) {
        return res.status(404).json({
            erro: 'Usuário não encontrado'
        })
    }

    res.json({
        mensagem: 'Usuário deletado'
    })


})



// servidor precisa saber qual a porta esperar requisições
app.listen(port, ()  => {
    console.log('servidor rodando na porta 3000')
})

