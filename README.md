# Projeto de Redes de Computadores

-- Artur Felipe Ribeiro 

## Objetivo
Implementar um servidor Socket e criar uma aplicação cliente para consumir esse servidor

## Requisitos
Para executar este projeto é necessário ter instalado o [NodeJS](https://nodejs.org/en/).

## Instrução para execução
Após a instalação, é necessário executar o comando `npm install` dentro da pasta raiz do projeto.

Para executar o projeto é necessário iniciar um terminal na pasta raiz e rodar o comando `node server.js` e em outra aba rodar o comando `node client.js`, onde você poderá executar funções no servidor.

Obs.: é necessário rodar o comando `node server.js` antes de rodar o comando `client.js`, pois senão o cliente não conseguirá se conectar ao servidor.

## Restrições
- O programa servidor e cliente rodam no mesmo diretório.
- O programa cliente somente lê arquivos na raiz do projeto para fazer o upload do arquivo.
- Os arquivos que foram subidos para o servidor são salvos na pasta src/upload.
- Os arquivos que foram baixados pelo cliente são salvos na pasta src/download