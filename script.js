/***************************************/                  
/*       JAVASCRIPT LISTA DE QUIZZES  */
/*************************************/
const app = document.querySelector(".container-app");
buscandoEexibirOsQuizzes();
 
let userQuizzes = [];
let allQuizzes = [];
 
function buscandoEexibirOsQuizzes(){
    const requisição = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
 
    requisição.then(renderizarEseparar);
    requisição.catch(erro);
 
}
// Renderizando e separando os Quizzes
function renderizarEseparar(resposta){
    const Qservidor = resposta.data;
    const Qseparados = separarQDoUser(Qservidor);
 
    userQuizzes = Qseparados.user;
    allQuizzes = Qseparados.all;
 
    renderizarQuizzes();
}
 
// Alerta de erro ao carregar
function erro(){
    alert("Erro ao buscar quizzes! Por favor, recarregue a página");
}
 
// Separando os Quizzes do Usuario
function separarQDoUser(listQuizzes) {
    const Qseparados = {
      user: [],
      all: []
    };
 
    for (let i = 0; i < listQuizzes.length; i++) {
      const Quizz = listQuizzes[i];
 
      if (EsteQPertenceAoUser(Quizz)) {
        Qseparados.user.push(Quizz);
      } else {
        Qseparados.all.push(Quizz);
      }
    }
 
    return Qseparados;
  }
 
  function EsteQPertenceAoUser(Quizz) {
    const userQuizzes = pegarQuizzesDoUser();
 
    for (let i = 0; i < userQuizzes.length; i++) {
      if (userQuizzes[i].id === container-Quizz.id) {
        return true;
      }
    }
 
    return false;
  }
 
function pegarQuizzesDoUser (){
    let dados = localStorage.getItem("Quizzes");
 
    if (dados !== null) {
      const DadosDeserializados = JSON.parse(dados);
      return DadosDeserializados;
    } else {
      return [];
    }
}
 
function renderizarQuizzes(){
    let userQuizzesHTML = "";
 
    if (userQuizzes.length === 0){
        userQuizzesHTML = CardCriarQuizz();
    } else {
        userQuizzesHTML = CardsQuizzesDoUser();
    }
 
    let allQuizzesHTML = "";
    allQuizzes.forEach(function (Quizz) {
        allQuizzesHTML += gerarCardQuizz(Quizz);
    });
   
    app.innerHTML =  `
            <div class="page-list-Quizzes">
            <div class="Quizzes User">
              ${userQuizzesHTML}
            </div>

            <div class="basic-info esconder">
                <h1>Começe pelo começo</h1>
                <div class = "container-perguntas">
                    <input type="text" id="title" placeholder="Título do seu quizz"/>
                    <input type="text" id ="url" placeholder="URL da imagem do seu quizz"/>
                    <input type="text" id="number-questions" placeholder="Quantidade de perguntas do quizz"/>
                    <input type="text" id="number-levels" placeholder="Quantidade de níveis do quizz"/>
                </div>
                <div class="button-div">
                    <button class="prosseguir" onclick="prosseguirPerguntas()">Prosseguir para criar perguntas</button>
                </div>
            </div>
     
            <div class="Quizzes all">
              <div class="header">
                <h1>Todos os Quizzes</h1>
              </div>
              <div class="list-Quizzes">
                ${allQuizzesHTML}
              </div>
            </div>
          </div>
        `;
}
 
function CardCriarQuizz(){
    return `
    <div class="criar-Quizz">
        <span>Você não criou nenhum<br> quizz ainda :(</span>
        <button onclick="criarQuizz()">Criar Quizz</button>
    </div>
  `;
}
 
function CardsQuizzesDoUser(){
    let listQuizzes = "";
 
  userQuizzes.forEach(function (Quizz) {
    listQuizzes += gerarCardQuizz(Quizz);
  });
 
  return `
    <div class="header">
        <h1>Seus Quizzes</h1>
        <button><ion-icon class="add_quizz_icon" name="add-circle" onclick="criarQuizz()"></ion-icon></button>
    </div>
    <div class="list-Quizzes">
      ${listQuizzes}
    </div>
  `;
}
 
function gerarCardQuizz(Quizz){
    return `
        <div class="container-Quizz" onclick="exibirQuizz(${Quizz.id})">
            <img src="${Quizz.image}">
            <div class="overlay">
                <div class="title">${Quizz.title}</div>
            </div>
        </div>
  `;
}


/***************************************/                   
/*       JAVASCRIPT CRIAR QUIZZ       */
/*************************************/

//Variáveis importantes que serão adicionadas no objeto 'quizz' mais tarde
let titleQuizz;
let urlImage;
let questionsNumber;
let levelsNumber;

let objQuizz = {title: "",
                image: "",
                questions: [],
                levels: []
                }

//Passar da página inicial para a de criar quizz
function criarQuizz(){
    const pageListQuizzes = document.querySelector('.Quizzes.User');
    pageListQuizzes.classList.add('esconder');

    const pageListQuizzesAll = document.querySelector('.Quizzes.all');
    pageListQuizzesAll.classList.add('esconder');

    const infoBasica = document.querySelector('.basic-info');
    infoBasica.classList.remove('esconder');
}

//Passar da tela de informações básicas (3.1) para a de perguntas (3.2)
function prosseguirPerguntas(){
    const url = document.getElementById('url').value
    
    //Só passa para a próxima tela se estiver tudo certo
    if(verifyBasicInfo(url)){
        
        //Armazena título, url do quizz, número de questões e níveis em variáveis
        titleQuizz = document.getElementById('title').value;
        urlImage = document.getElementById('url').value;
        questionsNumber = document.getElementById('number-questions').value;
        levelsNumber = document.getElementById('number-levels').value;
      
        objQuizz.title = titleQuizz;
        objQuizz.image = urlImage;

        const infoBasica = document.querySelector('.basic-info');
        infoBasica.classList.add('esconder');
        const questions = document.querySelector('.questions');
        questions.classList.remove('esconder');
        renderizarPerguntas(questionsNumber);
    }
}

//Renderiza as perguntas na tela
function renderizarPerguntas(numero){
    const container = document.querySelector('.questions');
    for(let i =1; i<= numero; i++){
        container.innerHTML += 
        `<div class = "container-perguntas pergunta${[i]}">
        <div class="numero-pergunta">
            <h2>Pergunta ${[i]}</h2>
            <ion-icon class="outline" name="create-outline" onclick="expand(this)"></ion-icon>
        </div>
        <div class ="answers esconder">
            <input id="text${[i]}" type="text" class="title-question first" placeholder="Texto da pergunta"/>
            <input id="color${[i]}" type="text" class="color-question" placeholder="Cor de fundo da pergunta"/>
            <div class="correct">
                <h2>Resposta correta</h2>
                <input type="text" class="correct-answer answer" placeholder="Resposta correta"/>
                <input type="text" class="url urlCorrect" placeholder="URL da imagem"/>
            </div>
            <div class="incorrect">
                <h2>Respostas incorretas</h2>
                <input type="text" class="incorrect-answer1 incorrect-answer answer" placeholder="Resposta incorreta 1"/>
                <input type="text" class="url-incorrect urlIncorrect1" placeholder="URL da imagem 1"/>

                <input type="text" class="incorrect-answer2 incorrect-answer answer" placeholder="Resposta incorreta 2"/>
                <input type="text" class="url-incorrect urlIncorrect2" placeholder="URL da imagem 2"/>

                <input type="text" class="incorrect-answer3 incorrect-answer answer" placeholder="Resposta incorreta 3"/>
                <input type="text" class="url-incorrect urlIncorrect3" placeholder="URL da imagem 3"/>
            </div>
        </div>
    </div>`
    }
    container.innerHTML += 
    `<div class="button-div">
    <button class="prosseguir" onclick="prosseguirNiveis()">Prosseguir para criar níveis</button>
    </div>`
}

//PAREI AQUI
let valid;
function prosseguirNiveis(){
    
    //Faz a verificação das perguntas
    for(let i =1; i <= questionsNumber; i++){
        const questions = document.querySelector(`.questions .pergunta${[i]}`);
        if(verifyQuestions(questions)){
            console.log('ok')
            valid = true
        } else{
            console.log('b')
            valid = false
            break;
        }
    }
    //Se estiver tudo certo, adiciona as coisas no objQuizz e vai para a criação de níveis
    if (valid === true){
        console.log('allvalid')
        criarObj();
        //Ir para a criação de níveis
        //criarNiveis()
    }
}

let arrayQuestions = [];
let objQuestions = {};
let arrayAnswers = []
let objAnswers = {}
let objAnserCorrect={}

function criarObj(){
    objQuizz.questions = this.addQuestions();
    console.log(objQuizz)
}

//Adiciona as perguntas no objQuizz
function addQuestions(){
    for(let i =1; i <= questionsNumber; i++){
        const questions = document.querySelector(`.questions .pergunta${[i]}`);
        objQuestions.title = document.getElementById(`text${[i]}`).value
        objQuestions.color = document.getElementById(`color${[i]}`).value
        objQuestions.answers = addAnswers(questions);
        arrayQuestions.push(objQuestions);
        objQuestions = {};
        objAnswers = {};
        arrayAnswers = [];
    }
   return arrayQuestions;
}


//Adiciona as respostas das questões no objQuizz
function addAnswers(perguntas){
   // enquanto tiver respostas na tela na tela para esta pergunta

    const allAvailableAnswers = perguntas.querySelectorAll(".answer")
    const validAnswers = []
   
    for(let i = 0; i < allAvailableAnswers.length; i++){
        if (allAvailableAnswers[i].value.length !== 0){
            validAnswers.push(allAvailableAnswers[i])
        }
    }
   console.log(validAnswers.length)
                            
   for(let i =1; i <= validAnswers.length; i++){
     if(i === 1){
        objAnswers.text = perguntas.querySelector(".correct-answer").value
        objAnswers.image = perguntas.querySelector(".urlCorrect").value
        objAnswers.isCorrectAnswer = true
     } else{
        objAnswers.text = perguntas.querySelector(`.incorrect-answer${i-1}`).value
        objAnswers.image = perguntas.querySelector(`.urlIncorrect${i-1}`).value
        objAnswers.isCorrectAnswer = false

     }
     arrayAnswers.push(objAnswers);
     objAnswers={}
    } 

    return arrayAnswers;

}


//Fazer a validação das perguntas
function verifyQuestions(pergunta){
    
    if(!verifyEmptyQuestions(pergunta)){
        return false
    }
     if(!verifyTitleQuestion(pergunta)){
        return false
    }
    if(!verifyColor(pergunta)){
        return false
    }
    if(!verifyCorrectUrl(pergunta)){
        return false
    } 
    if(!verifyIncorrect(pergunta)){
        return false
    }
    if(!verifyFirstIncorrect(pergunta)){
        return false
    }  
    if(!verifySecondIncorrect(pergunta)){
        return false
    } 
    if(!verifyThirdIncorrect(pergunta)){
        return false
    } 
    return true 
}    
    
function verifyEmptyQuestions(pergunta){
    const text = pergunta.querySelector('.title-question')
    const color = pergunta.querySelector('.color-question')
    const correct = pergunta.querySelector('.correct-answer')
    const urlCorrect = pergunta.querySelector('.urlCorrect')
    const incorrects = pergunta.querySelectorAll('.incorrect-answer')
    console.log(incorrects)
    if (text.value.length === 0 || color.value.length === 0 || correct.value.length === 0 || urlCorrect.value.length === 0){
        alert('Cada pergunta deve conter: texto, cor, resposta correta e pelo menos 1 resposta incorreta')
        return false
    }
    
    if (incorrects[0].value.length === 0 && incorrects[1].value.length === 0 && incorrects[2].value.length === 0){
        alert('Cada pergunta deve conter: texto, cor, resposta correta e pelo menos 1 resposta incorreta')
        return false
    } 
    return true
}

function verifyTitleQuestion(pergunta){
    const title = pergunta.querySelector('.title-question')
    if (title.value.length < 20){
       alert("O texto da pergunta deve conter no mínimo 20 caracteres")
       return false
    }
    return true
}

function verifyColor(pergunta){
    const color = pergunta.querySelector('.color-question').value
    const regex = /#[0-9A-Fa-f]{6}/g;
    if (color.match(regex) && color.length <8){
        console.log ("String is hex");
        return true
    }else{
        console.log("String is not hex");
        alert("As cores devem estar no formato hexadecimal")
        return false
    }
}

function verifyCorrectUrl(pergunta){
    const correctUrl = pergunta.querySelector('.urlCorrect').value
    if(!verifyURL(correctUrl)){
        return false
    }
    return true
}

function verifyIncorrect(pergunta){
    const incorrecturls = pergunta.querySelectorAll('.url-incorrect')
    const incorrects = pergunta.querySelectorAll('.incorrect-answer')
    if (incorrects[0].value.length === 0 && (incorrects[1].value.length !== 0 || incorrects[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false
    } 
    if (incorrecturls[0].value.length === 0 && (incorrecturls[1].value.length !== 0 || incorrecturls[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false
    } 
    if (incorrects[1].value.length === 0 && (incorrects[0].value.length !== 0 && incorrects[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false
    } 
    if (incorrecturls[1].value.length === 0 && (incorrecturls[0].value.length !== 0 && incorrecturls[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false
    } 
    return true
}

function verifyFirstIncorrect(pergunta){
   
    const urlIncorrect1 = pergunta.querySelector('.urlIncorrect1').value
    
    if(!verifyURL(urlIncorrect1)){
        return false
    }
    return true
}

function verifySecondIncorrect(pergunta){
    const incorrect2 = pergunta.querySelector('.incorrect-answer2')
    const urlIncorrect2 = pergunta.querySelector('.urlIncorrect2')
    if (incorrect2.value.length === 0 && urlIncorrect2.value.length === 0){
        return true
    }
    if ((incorrect2.value.length === 0 && urlIncorrect2.value.length !== 0) || 
    (incorrect2.value.length !== 0 && urlIncorrect2.value.length === 0)){
        alert("Preencha os campos de resposta corretamente")
        return false
    }
    if(!verifyURL(urlIncorrect2.value)){
        console.log('aaaaaa')
        return false
    }
    return true
}
function verifyThirdIncorrect(pergunta){
    const incorrect3 = pergunta.querySelector('.incorrect-answer3')
    const urlIncorrect3 = pergunta.querySelector('.urlIncorrect3')
    if (incorrect3.value.length === 0 && urlIncorrect3.value.length === 0){
        return true
    }
    if ((incorrect3.value.length === 0 && urlIncorrect3.value.length !== 0) || 
    (incorrect3.value.length !== 0 && urlIncorrect3.value.length === 0)){
        alert("Preencha os campos de resposta corretamente")
        return false
    }
    if(!verifyURL(urlIncorrect3.value)){
        console.log('aaaaaa')
        return false
    }
    return true
}


//Fazer a validadação das informações básicas
function verifyBasicInfo(link){
    if (!verifyEmptyBasicInfo()){
        return false
    }
    if (!verifyTitle()){
        return false
    }
    if (!verifyURL(link)){
        return false
    } 
     if (!verifyQuestionsNumber()){
        return false
    }  
    
    if (!verifyLevelsNumber()){
        return false
    } 
    return true
}

function verifyEmptyBasicInfo(){
    const inputs =document.querySelectorAll('.basic-info input')
    for (let i = 0; i < inputs.length; i++){
        if (inputs[i].value.length == 0){
            alert('Não pode haver campos vazios!')
            return false
        }
   }
    return true
}

function verifyTitle(){
    const title = document.getElementById('title').value
   
   if (title === ""){
    alert('O título deve ser informado')
    return false
   } 
    if(title.length < 20 || title.length >65 ){
        alert('O título do quizz deve ter no mínimo 20 e no máximo 65 caracteres')
         return false
    }
    return true  
}

function verifyURL(string){
    try {
        let url = new URL(string)
        console.log("Valid URL!")
        return true
     
      } catch(err) {
          console.log("Invalid URL!")
          alert('Digite uma URL válida!')
        return false  
      }
}

function verifyQuestionsNumber(){
    const numberQuestions = Number(document.getElementById('number-questions').value)
    if (isNaN(numberQuestions)){
        alert('Digite um número de perguntas válido!')
        return false
    }
    if(numberQuestions < 3){
        alert('Seu quizz deve possuir no mínimo 3 perguntas')
        return false
    }
    return true
}

function verifyLevelsNumber(){
    const numberLevels = Number(document.getElementById('number-levels').value)
    if (isNaN(numberLevels)){
        alert('Digite um número de níveis válido!')
        return false
    }
    if(numberLevels < 2){
        alert('Seu quizz deve possuir no mínimo 2 níveis')
        return false
    }
    return true
}

//Mostrar todos os campos para responder ao clicar no ion-icon
function expand(icone){
    const container = icone.parentNode.parentNode;
    const children = container.children;
    const firstChild = children.item(1);
    firstChild.classList.remove('esconder');
    icone.classList.add('esconder');
}
