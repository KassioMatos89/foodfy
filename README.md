<p align="center">
  <img alt="Launchbase" src="/public/assets/LaunchBase.png" width="400" style="max-width:100%;">
</p>

# Foodfy

<p align="center">
  <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=green&style=for-the-badge"/>
  <img src="http://img.shields.io/static/v1?label=STATUS&message=CONCLUIDO&color=GREEN&style=for-the-badge"/>
</p>

### Tópicos 

:small_blue_diamond: [Visão Geral](#visão-geral)

:small_blue_diamond: [Funcionalidades](#funcionalidades)

:small_blue_diamond: [Pré-requisitos](#pré-requisitos)

:small_blue_diamond: [Como rodar a aplicação](#como-rodar)

## Visão Geral
<p align="justify">
  Foodfy é um projeto criado para cadastro de receitas por usuários cadastrados, onde qualquer visitante da página pode acessa-las e se divertir tentando reproduzir as receitas!
</p>

## Funcionalidades
:heavy_check_mark: Cadastro de usuário

:heavy_check_mark: Cadastro de chefs

:heavy_check_mark: Cadastro de receitas

:heavy_check_mark: Busca por receitas

:heavy_check_mark: Email de cadastro de usuário

:heavy_check_mark: Reset de senha

## Pré-requisitos
:warning: Ter acesso a um banco de dados <strong>Postgresql</strong>

## <a name="como-rodar">Como rodar a aplicação :arrow_forward:<a/>
Neste momento, vamos seguir algumas instruções para que você consiga clonar o projeto foodfy e executa-lo!

1- No terminal de comandos do Visual Studio Code, acesse o diretório onde você hospedará o projeto.

Exemplo do comando para entrar no diretório desejado.
```
cd "caminho do diretório"
```


2- Ainda no terminal de comandos, clonar o projeto com o comando:

```
git clone https://github.com/KassioMatos89/foodfy.git
```

3- Criando Banco de Dados.
Em seguida, vamos criar o banco de dados que o sistema utilizará, para isso, 
é necessário abrir o Database.sql que está na raiz do projeto que foi clonado.
Ao abrir o arquivo, temos uma serie de instruções SQL que devem ser executadas no console de querys de seu BD exatamente na ordem que estão no arquivo.
Para se certificar, abra a base "foodfy" que foi criada e verifique se foram criadas tabelas.

IMPORTANTE: O arquivo cria uma base com o nome "foodfy". Então, antes de executar o script certifique-se 
que não exista nenhuma base com este nome em seu SGBD.

4- Agora vamos instalar o pacote do node com as bibliotecas que são necessárias para o correto funcionamento do foodfy.
Para isso, executar o comando abaixo.

```
npm install
```
5- Pronto, estamos quase prontos para executar o foodfy! 
Para ficar mais interessante, vamos executar o comando abaixo  NA RAIZ DO PROJETO para popularmos a base de dados com informações iniciais para utilização do sistema.

```
node seed.js
```

6- Agora, vamos configurar o serviço de emails, para que você consiga simular o envio e recebimento de emails quando cadastrar novos usuários no foodfy e precisar utilizar o email de reset de senha. Para isso, acesse o site do <a href="https://mailtrap.io/">mailtrip</a>, se cadastre e faça login com sua conta. Em seguida, siga o passo a passo das imagens abaixo para criar um Inbox, pegar seus dados de acesso e configurar o projeto para a autenticação.

<p align="center">
  <p>Criando caixa de emails.</p>
  <img alt="Launchbase" src="/public/assets/1-Mailtrip.png" width="400" style="max-width:100%;">
</p>
<p align="center">
  <p>Acessando as configurações da caixa.</p>
  <img alt="Launchbase" src="/public/assets/2-Mailtrip.png" width="400" style="max-width:100%;">
</p>
<p align="center">
  <p>Selecionar a opção <strong>Nodemailer</strong> e copiar os dados</p>
  <img alt="Launchbase" src="/public/assets/3-Mailtrip.png" width="400" style="max-width:100%;">
</p>
<p align="center">
  <p>
    Com dos dados em mãos, vamos editar o arquivo do projeto que faz autenticação com o mailtrip. Abra o arquivo <strong>mailer.js</strong> que fica em <strong>src/lib</strong> e insira seus dados de autenticação, assim você recebera neste Inbox os emails do <strong>Foodfy</strong>.
  </p>
  <img alt="Launchbase" src="/public/assets/4-Mailtrip.png" width="400" style="max-width:100%;">
</p>

7- Pronto! execute o comando abaixo no terminal de comandos do Visual Studio para iniciar o projeto e assim que o servidor estiver no ar, acesse este URL em seu navegador http://localhost:3000/

```
npm start
```



