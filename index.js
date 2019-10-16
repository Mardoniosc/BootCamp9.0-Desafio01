// facilita a criação de rotas
const express = require('express');

// inicializa o servidor
const server = express();

//Diz a nosso server que ele deve receber informações no formato JSON
server.use(express.json());

const projetos = [{
  id: "1",
  title: "Novo projeto",
  tasks: ["Nova tarefa", "Nova tarefa 2"]
},
{
  id: "2",
  title: "Projeto Node",
  tasks: ["Criar rotas", "Verificar query"]
},
]
let contadorDeRequisicao = 0;

server.use((req, res, next) => {
  contadorDeRequisicao ++;

  console.log(`Numero de requisições: ${contadorDeRequisicao}`)
  next();
})

function checkIdExistente(req, res, next){
  const { id } = req.params;

  const projeto =  projetos.find(p => p.id == id);

  if (!projeto) {
    return res.status(400).json({ error: "Projeto não encontrado!"})
  }
  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projetos);
});

server.post('/projects', (req, res) => {
  const { ...projeto } = req.body;

  projetos.push(projeto);

  return res.json(projetos)
});

server.put('/projects/:id', checkIdExistente, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projetos.forEach(projeto => {
    if(projeto.id === id ){
      projeto.title = title;
    }
  });
  
  return res.json(projetos)
});

server.delete('/projects/:id', checkIdExistente, (req, res) => {
  const { id } = req.params;
  const index = projetos.findIndex(p => p.id == id);
  projetos.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIdExistente, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projetos.forEach(projeto => {
    if(projeto.id === id ){
      projeto.tasks.push(title);
    }
  });

  return res.json(projetos)
});

// Informa em qual porta o software deve ser executado
server.listen(3333);