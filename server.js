const fs = require("fs")
const path = require("path")
const net = require("net")
const server = net.createServer();
const {Buffer} = require("buffer")

const PORT = 8888;

server.on("connection", (socket) => {

  socket.on("data", async (result) => {
    result = JSON.parse(Buffer.from(result).toString("utf-8"))
    if(result.type == "list files"){
      const files = await fs.readdirSync(path.resolve(__dirname, "src", "uploads"));
      const event = {
        type: "list files result",
        payload: files
      }
      socket.write(JSON.stringify(event))

    }else if(result.type == "save file"){
      const event = {
        type: "save file result",
      }
      try {
        await fs.writeFileSync(path.resolve(__dirname, "src", "uploads", result.payload.filename), result.payload.data, "utf-8")
        event.payload = "Arquivo salvo com sucesso"
        socket.write(JSON.stringify(event))
      } catch (error) {
        event.payload = "Não foi possível salvar o arquivo"
        socket.write(JSON.stringify(event))
      }

    }else if(result.type == "recover file"){
      const event = {
        type: "recover file result"
      }
      try {
        const data = await fs.readFileSync(path.resolve(__dirname, "src", "uploads", result.payload),{encoding: "utf-8"})
        event.payload = { 
          success: true,
          data: {
            filename: result.payload,
            data
          }
        }
        socket.write(JSON.stringify(event))
      } catch (error) {
        let message
        if(error.code == "ENOENT"){
          message = "Não foi possível encontrar o arquivo, verifique se o nome está correto!"
        }else{
          message = "Não foi possível recuperar o arquivo!"
        }
        event.payload = {
          success: false, 
          message
        }
        socket.write(JSON.stringify(event))
      }
    }
    
  })
})

server.listen(PORT, () => {
  console.log('Conectado na porta  '+ PORT);
});