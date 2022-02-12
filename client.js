const path = require("path")
const fs = require("fs")
const reader = require("./readerHanlder")
const net = require("net")

const HOST = "0.0.0.0"
const PORT = 8888

const client = net.Socket();

client.connect(PORT, HOST, () => {})

async function listFiles(){
  const event = {
    type: "list files",
  }
  return new Promise(resolve => {
    client.write(JSON.stringify(event))
    client.on("data", async (result) => {
      result = JSON.parse(Buffer.from(result).toString("utf-8"))
      if(result.type == "list files result"){
        const files = result.payload;
        console.log("\nArquivos existentes: \n")
        files.forEach(file => console.log("- " + file));
        console.log("\n")
        resolve();
      }
    })
  })
}

async function uploadFile(){
  const event = {
    type: "save file"
  }
  return new Promise(async resolve => {
    try {
      const answer = await reader.question("Insira o caminho do arquivo que você deseja subir: ");
      const filePath = path.resolve(__dirname, answer);
      const data = await fs.readFileSync(filePath, {encoding: "utf-8"});
      const filename = path.basename(filePath)
      event.payload = {
        data,
        filename
      }
      client.write(JSON.stringify(event))
      
    client.on("data", async (result) => {
      result = JSON.parse(Buffer.from(result).toString("utf-8"))
      if(result.type == "save file result"){
        console.log(result.payload)
        resolve("Arquivo salvo com sucesso")
      }
    })
    } catch (error) {
      if(error.code == "ENOENT"){
        console.log("Não foi possível encontrar o arquivo, verifique se o nome está correto!")
      }else{
        console.log("Não foi possível subir o arquivo!")
      }
      resolve();
    }
  })
}

async function downloadFile(){
  const event = {
    type: "recover file",
  }
  return new Promise(async resolve => {
    const filename = await reader.question("Insira o nome do arquivo que você deseja recuperar: ");
    const filepath = path.resolve(__dirname,"src","downloads", filename)
    event.payload = filename
    client.write(JSON.stringify(event))  
    // socket.emit("recover file", filename)
    client.on("data", async (result) => {
      result = JSON.parse(Buffer.from(result).toString("utf-8"))
      if(result.type == "recover file result"){
        if(result.payload.success){
          await fs.writeFileSync(filepath, result.payload.data.data)
          console.log("Arquivo salvo com sucesso")
          resolve()
        }else{
          console.log(result.payload.message)
          resolve();
        }
      }
    })
  })
}

async function run(){

  let menu = -1;
  do{
    menu = await reader.question(`Selecione uma das opções a seguir:\n1 - Listar arquivos\n2 - Subir um arquivo\n3 - Recuperar um arquivo\n0 - Sair\n`)
    if(menu == 1){
      await listFiles();
    }else if(menu == 2){
      await uploadFile()
    }else if(menu == 3){
      await downloadFile();
    }else if(menu != 0){
      console.log("Insira uma entrada válida!")
    }
  }while(menu != 0);
  client.destroy();
  reader.closeReader()
  process.exit()
}

run();