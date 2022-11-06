/***************************************/                  
/*       JAVASCRIPT LISTA DE QUIZZES  */
/*************************************/

//Pega o que estava armazenado no local storage
const quizzesUsuarioSerializada = localStorage.getItem("id");
const listaUsuario = JSON.parse(quizzesUsuarioSerializada);

const app = document.querySelector(".container-app");
let listQuizzesUser = document.querySelector(".user")
const listQuizzes = document.querySelector(".list-Quizzes");

buscandoEexibirOsQuizzes();
 

//Pegar quizzes do servidor
function buscandoEexibirOsQuizzes(){
    app.scrollTo(0, 0);
    const requisição = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    requisição.then(receberQuizzes);
    requisição.catch(erro);
 
}

function erro(){
    alert("Erro ao buscar quizzes! Por favor, recarregue a página");
}

let allQuizzes = []
function receberQuizzes(resposta){
    const todos = resposta.data;
    allQuizzes = resposta.data
    renderizarQuizzes(todos)
}

function semQuizzCriarquizz(){
    return `<div class="criar-Quizz">
    <span>Você não criou nenhum<br> quizz ainda :(</span>
    <button onclick="criarQuizz()">Criar Quizz</button>
    </div>`
}

function comQuizzAddQuizz(){
    return ` <div class="header">
    <h1>Seus Quizzes</h1>
    <button><ion-icon class="add_quizz_icon" name="add-circle" onclick="criarQuizz()"></ion-icon></button>
</div>
<div class="list-Quizzes"></div>`

}

function renderizarQuizzes(lista){
    
    if(listaUsuario === null){
        listQuizzesUser.innerHTML = semQuizzCriarquizz();
        
        for(let i = 0; i < lista.length; i++){
            const objeto = lista[i]; 
            listQuizzes.innerHTML += cardQuizzServer(objeto);
        }
    } else{
        listQuizzesUser.innerHTML = comQuizzAddQuizz();
        const listUser = document.querySelector(".user .list-Quizzes")
        for(let i = 0; i < lista.length; i++){
            const objeto = lista[i]; 
            let encontrou = false
           
            for(let j = 0; j< listaUsuario.length; j++){
                if(lista[i].id=== listaUsuario[j]){
                    encontrou = true
                    break;
                } 
            }
            if(encontrou){
                listUser.innerHTML += cardQuizzUser(objeto)
            } else{
                listQuizzes.innerHTML += cardQuizzServer(objeto);
            }
        }
    }
}

function cardQuizzUser(quizz){
    return  `
                    <div class="container-Quizz" onclick="exibirQuizz(${quizz.id})">
                        <img src="${quizz.image}">
                        <div class="overlay">
            <div class="title">${quizz.title}</div>
                        </div>
                    </div>`
            
}

function cardQuizzServer(quizz){
   return `<div class="container-Quizz" onclick="exibirQuizz(${quizz.id})">
                <img src="${quizz.image}">
                <div class="overlay">
                    <div class="title">${quizz.title}</div>
                </div>
        </div>`;
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
                };

//Passar da página inicial para a de criar quizz
function criarQuizz(){
   
    const telaInicial = document.querySelector(".page-list-Quizzes");
    telaInicial.classList.add("esconder");

    const infoBasica = document.querySelector('.basic-info');
    infoBasica.classList.remove('esconder');
}

//Passar da tela de informações básicas (3.1) para a de perguntas (3.2)
function prosseguirPerguntas(){
    const url = document.getElementById('url').value;
    
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
    </div>`;
    }
    container.innerHTML += 
    `<div class="button-div">
    <button class="prosseguir" onclick="prosseguirNiveis()">Prosseguir para criar níveis</button>
    </div>`;
}


let valid;
function prosseguirNiveis(){
    
    //Faz a verificação das perguntas
    for(let i =1; i <= questionsNumber; i++){
        const questions = document.querySelector(`.questions .pergunta${[i]}`);
        if(verifyQuestions(questions)){
            valid = true;
        } else{
            valid = false;
            break;
        }
    }
    //Se estiver tudo certo, adiciona as coisas no objQuizz e vai para a criação de níveis

    if (valid === true){
        criarObj();
        //Ir para a criação de níveis
        ExibirCriarNivel();
    }
}

let arrayQuestions = [];
let objQuestions = {};
let arrayAnswers = [];
let objAnswers = {};
let objAnserCorrect={};

function criarObj(){
    objQuizz.questions = this.addQuestions();
}

//Adiciona as perguntas no objQuizz
function addQuestions(){
    for(let i =1; i <= questionsNumber; i++){
        const questions = document.querySelector(`.questions .pergunta${[i]}`);
        objQuestions.title = document.getElementById(`text${[i]}`).value;
        objQuestions.color = document.getElementById(`color${[i]}`).value;
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

    const allAvailableAnswers = perguntas.querySelectorAll(".answer");
    const validAnswers = [];
   
    for(let i = 0; i < allAvailableAnswers.length; i++){
        if (allAvailableAnswers[i].value.length !== 0){
            validAnswers.push(allAvailableAnswers[i]);
        }
    }
                            
   for(let i =1; i <= validAnswers.length; i++){
     if(i === 1){
        objAnswers.text = perguntas.querySelector(".correct-answer").value;
        objAnswers.image = perguntas.querySelector(".urlCorrect").value;
        objAnswers.isCorrectAnswer = true;
     } else{
        objAnswers.text = perguntas.querySelector(`.incorrect-answer${i-1}`).value;
        objAnswers.image = perguntas.querySelector(`.urlIncorrect${i-1}`).value;
        objAnswers.isCorrectAnswer = false;

     }
     arrayAnswers.push(objAnswers);
     objAnswers={}
    } 

    return arrayAnswers;

}


//Fazer a validação das perguntas
function verifyQuestions(pergunta){
    
    if(!verifyEmptyQuestions(pergunta)){
        return false;
    }
     if(!verifyTitleQuestion(pergunta)){
        return false;
    }
    if(!verifyColor(pergunta)){
        return false;
    }
    if(!verifyCorrectUrl(pergunta)){
        return false;
    } 
    if(!verifyIncorrect(pergunta)){
        return false;
    }
    if(!verifyFirstIncorrect(pergunta)){
        return false;
    }  
    if(!verifySecondIncorrect(pergunta)){
        return false;
    } 
    if(!verifyThirdIncorrect(pergunta)){
        return false;
    } 
    return true;
}    
    
function verifyEmptyQuestions(pergunta){
    const text = pergunta.querySelector('.title-question');
    const color = pergunta.querySelector('.color-question');
    const correct = pergunta.querySelector('.correct-answer');
    const urlCorrect = pergunta.querySelector('.urlCorrect');
    const incorrects = pergunta.querySelectorAll('.incorrect-answer');
 
    if (text.value.length === 0 || color.value.length === 0 || correct.value.length === 0 || urlCorrect.value.length === 0){
        alert('Cada pergunta deve conter: texto, cor, resposta correta e pelo menos 1 resposta incorreta');
        return false;
    }
    
    if (incorrects[0].value.length === 0 && incorrects[1].value.length === 0 && incorrects[2].value.length === 0){
        alert('Cada pergunta deve conter: texto, cor, resposta correta e pelo menos 1 resposta incorreta');
        return false;
    } 
    return true;
}

function verifyTitleQuestion(pergunta){
    const title = pergunta.querySelector('.title-question');
    if (title.value.length < 20){
       alert("O texto da pergunta deve conter no mínimo 20 caracteres");
       return false;
    }
    return true;
}

function verifyColor(pergunta){
    const color = pergunta.querySelector('.color-question').value;
    const regex = /#[0-9A-Fa-f]{6}/g;
    if (color.match(regex) && color.length <8){
        return true
    }else{
        alert("As cores devem estar no formato hexadecimal");
        return false;
    }
}

function verifyCorrectUrl(pergunta){
    const correctUrl = pergunta.querySelector('.urlCorrect').value;
    if(!verifyURL(correctUrl)){
        return false;
    }
    return true;
}

function verifyIncorrect(pergunta){
    const incorrecturls = pergunta.querySelectorAll('.url-incorrect')
    const incorrects = pergunta.querySelectorAll('.incorrect-answer')
    if (incorrects[0].value.length === 0 && (incorrects[1].value.length !== 0 || incorrects[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false;
    } 
    if (incorrecturls[0].value.length === 0 && (incorrecturls[1].value.length !== 0 || incorrecturls[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false;
    } 
    if (incorrects[1].value.length === 0 && (incorrects[0].value.length !== 0 && incorrects[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false;
    } 
    if (incorrecturls[1].value.length === 0 && (incorrecturls[0].value.length !== 0 && incorrecturls[2].value.length !== 0)){
        alert('As respostas incorretas devem ser preenchidas em ordem')
        return false;
    } 
    return true;
}

function verifyFirstIncorrect(pergunta){
   
    const urlIncorrect1 = pergunta.querySelector('.urlIncorrect1').value;
    
    if(!verifyURL(urlIncorrect1)){
        return false;
    }
    return true;
}

function verifySecondIncorrect(pergunta){
    const incorrect2 = pergunta.querySelector('.incorrect-answer2');
    const urlIncorrect2 = pergunta.querySelector('.urlIncorrect2');
    if (incorrect2.value.length === 0 && urlIncorrect2.value.length === 0){
        return true;
    }
    if ((incorrect2.value.length === 0 && urlIncorrect2.value.length !== 0) || 
    (incorrect2.value.length !== 0 && urlIncorrect2.value.length === 0)){
        alert("Preencha os campos de resposta corretamente");
        return false;
    }
    if(!verifyURL(urlIncorrect2.value)){
        return false;
    }
    return true
}
function verifyThirdIncorrect(pergunta){
    const incorrect3 = pergunta.querySelector('.incorrect-answer3');
    const urlIncorrect3 = pergunta.querySelector('.urlIncorrect3');
    if (incorrect3.value.length === 0 && urlIncorrect3.value.length === 0){
        return true;
    }
    if ((incorrect3.value.length === 0 && urlIncorrect3.value.length !== 0) || 
    (incorrect3.value.length !== 0 && urlIncorrect3.value.length === 0)){
        alert("Preencha os campos de resposta corretamente");
        return false;
    }
    if(!verifyURL(urlIncorrect3.value)){
        return false;
    }
    return true;
}

//Fazer a validadação das informações básicas
function verifyBasicInfo(link){
    if (!verifyEmptyBasicInfo()){
        return false;
    }
    if (!verifyTitle()){
        return false;
    }
    if (!verifyURL(link)){
        return false;
    } 
     if (!verifyQuestionsNumber()){
        return false;
    }  
    if (!verifyLevelsNumber()){
        return false;
    } 
    return true;
}

function verifyEmptyBasicInfo(){
    const inputs =document.querySelectorAll('.basic-info input');
    for (let i = 0; i < inputs.length; i++){
        if (inputs[i].value.length == 0){
            alert('Não pode haver campos vazios!');
            return false;
        }
   }
    return true;
}

function verifyTitle(){
    const title = document.getElementById('title').value;
   
   if (title === ""){
    alert('O título deve ser informado');
    return false;
   } 
    if(title.length < 20 || title.length >65 ){
        alert('O título do quizz deve ter no mínimo 20 e no máximo 65 caracteres');
         return false;
    }
    return true;
}

function verifyURL(string){
    try {
        let url = new URL(string);
        return true;
     
      }catch(err) {
          alert('Digite uma URL válida!');
        return false;
      }
}

function verifyQuestionsNumber(){
    const numberQuestions = Number(document.getElementById('number-questions').value);
    if (isNaN(numberQuestions)){
        alert('Digite um número de perguntas válido!');
        return false;
    }
    if(numberQuestions < 3){
        alert('Seu quizz deve possuir no mínimo 3 perguntas');
        return false;
    }
    return true;
}

function verifyLevelsNumber(){
    const numberLevels = Number(document.getElementById('number-levels').value);
    if (isNaN(numberLevels)){
        alert('Digite um número de níveis válido!');
        return false;
    }
    if(numberLevels < 2){
        alert('Seu quizz deve possuir no mínimo 2 níveis');
        return false;
    }
    return true;
}

//Mostrar todos os campos para responder ao clicar no ion-icon
function expand(icone){
    const container = icone.parentNode.parentNode;
    const children = container.children;
    const firstChild = children.item(1);
    firstChild.classList.remove('esconder');
    icone.classList.add('esconder');
}



function ExibirCriarNivel(){

    const infoBasica = document.querySelector('.questions');
    infoBasica.classList.add('esconder');
    const questions = document.querySelector('.Nivel');
    questions.classList.remove('esconder');
    renderizarNivel(levelsNumber);
}

//Renderizando os niveis

function renderizarNivel(nivel){
    const containernivel = document.querySelector('.Nivel');
    for(let i =1; i<= nivel; i++){
        containernivel.innerHTML += `
        <div class="container-perguntas niveis nivel${[i]}">
        <div class="numero-pergunta">
          <h2>Nivel ${[i]}</h2>
          <ion-icon class="outline" name="create-outline" onclick="expand(this)"></ion-icon>
        </div>
        <div class ="answers esconder">
          <input
            type="text"
            class="nivel-${[i]}-titulo tituloNivel"
            placeholder="Título do nível"
          />
          <input
            type="text"
            class="nivel-${[i]}-acerto acerto"
            placeholder="% de acerto mínima"
          />
          <input
            type="text"
            class="nivel-${[i]}-url nivelUrl"
            placeholder="URL da imagem do nível"
          />
          <input
            type="text"
            class="nivel-${[i]}-descricao nivelDescricao"
            placeholder="Descrição do nível"
          />
        </div>`;
    }
    containernivel.innerHTML += 
    `<div class="button-div">
    <button class="prosseguir" onclick="finalizarQuizz()">
        Finalizar Quizz
    </button>
    </div>`;
   
} 

// finalizar 
let validLevels;
function finalizarQuizz(){
 
    for(let i =1; i <= levelsNumber; i++){
        const levels = document.querySelector(`.Nivel .nivel${[i]}`);
        if(validarDadosNiveis(levels)){
            validLevels = true;
        } else{
            validLevels = false;
            break;
        }
    }
    //Se estiver tudo certo, adiciona os niveis no objQuizz e vai para a tela de sucesso do quizz
    if (validLevels === true){
        objQuizz.levels = this.pegarLevels();
        //Salvar quizz
       salvarQuizz();
    }
}
let arrayLevels = [];
let objLevels = {};

function pegarLevels(){
    for(let i =1; i <= levelsNumber; i++){
        const levels = document.querySelector(`.Nivel .nivel${[i]}`);
        objLevels.title = levels.querySelector(".tituloNivel").value;
        objLevels.image = levels.querySelector(".nivelUrl").value;
        objLevels.text = levels.querySelector(".nivelDescricao").value;
        objLevels.minValue = Number(levels.querySelector(".acerto").value);
        arrayLevels.push(objLevels);
        objLevels = {};
        
    }
   return arrayLevels;
}

function salvarQuizz(){
    const postar = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", objQuizz);
    postar.then(armazenarId);
    postar.catch(erroSalvarQuizz);
    
}
function erroSalvarQuizz(erro){
    alert("Ocorreu um erro ao salvar o seu quizz. Por favor, tente novamente. Se não resolver, recarregue a página.");
}


function armazenarId(resposta){
    const objeto = resposta.data;
    let userQuizzes = JSON.parse(localStorage.getItem('id') || '[]')
    userQuizzes.push(objeto.id);
    const userQuizzesSerializado = JSON.stringify(userQuizzes);
    localStorage.setItem("id", userQuizzesSerializado);
    telaSucesso();
}

function telaSucesso(){
    const nivel = document.querySelector('.Nivel');
    nivel.classList.add('esconder');
    const sucess = document.querySelector('.sucesso');
    sucess.classList.remove('esconder');

    sucess.innerHTML += 
    `<div class="imagem">
        <img src= ${objQuizz.image} alt="imagem URL do quizz" />
        <div class="overlay"></div>
        <div class="title">${objQuizz.title}</div>
    </div>
    <div class="button-div">
        <button onclick="exibirQuizz(${objQuizz.id})" class ="prosseguir">Acessar quizz</button>
        <p onclick="recarregar()">Voltar pra home</p>
    </div>`;
}

function recarregar(){
    window.location.reload();
}

function validarDadosNiveis(nivel){
    if(!verifyEmptyLevels(nivel)){
        return false;
    }
    if(!verifyLevelTitle(nivel)){
        return false;
    }
    if(!verifyMinValue(nivel)){
        return false;
    }
    if(!verifyUrlLevel(nivel)){
        return false;
    }
    if(!verifyDescription(nivel)){
        return false;
    }
    if(!verifyMinValueZero()){
        return false;
    } 
    if(!verifyOrder()){
        return false;
    }
    return true;
}

function verifyOrder(){
    const porcentagens = document.querySelectorAll(".acerto");
    let array = [];
    let array2 = [];
    porcentagens.forEach(element =>{
            array.push(element.value);
    })
    array2 = array.map((x) => x);
    array.sort((a, b) =>{
        if (a >b) return 1;
        if (a < b) return -1;
        return 0;
    })
    if (JSON.stringify(array) === JSON.stringify(array2)){
        return true;
    } else{
        alert("Os níveis devem ser preenchidos em ordem crescente de porcentagem de acertos");
        return false;
    }
}      

function verifyMinValueZero(){
    let temZero = false;
        const values = document.querySelectorAll(".acerto");
        for(let i = 0; i < values.length; i++){
            if(values[i].value === "0"){
                temZero = true;
            }
        }
    if (temZero === true){
        return true;
    } else{
        alert("É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%");
        return false;
    }
}
function verifyEmptyLevels(nivel){
    const inputs = nivel.querySelectorAll('input');
    for(let i =0; i < inputs.length; i++){
        if(inputs[i].value.length === 0){
            alert('Não pode haver campos vazios!');
            return false;
        }
    }
    return true;
}
function verifyLevelTitle(nivel){
    const titleLevel = nivel.querySelector(`.tituloNivel`).value;
    if(titleLevel.length < 10 ){
        alert("O título do nível deve conter pelo menos 10 caracteres!");
        return false;
    }
    return true;
}

function verifyMinValue(nivel){
    const minValue = Number(nivel.querySelector(".acerto").value); 
    if(isNaN(minValue) || Number.isInteger(minValue) === false || minValue < 0 ||
    minValue > 100){
        alert("A porcentagem deve ser um número inteiro entre 0 e 100");
        return false;
    } 
    return true;
}

function verifyUrlLevel(nivel){
    const urlLevel = nivel.querySelector(".nivelUrl").value;
    if(!verifyURL(urlLevel)){
        return false;
    }
    return true;
}

function verifyDescription(nivel){
    const description = nivel.querySelector(".nivelDescricao").value;
    if(description.length < 30){
        alert("A descrição do nível deve possuir no mínimo 30 caracteres!");
        return false;
    }
    return true;
}

/***************************************/                   
/*       JAVASCRIPT EXIBIR QUIZZ      */
/*************************************/
let quizzSelecionado;
let pontuacaoQuizzSelecionado = 0;
let totalDePerguntas = 0;
let quantidadePerguntasRespondidas = 0;
let divQuizSelecionado;
let primeiraVezNoQuiz = true;

function criarDivPageQuizSelecionado(){
    divQuizSelecionado = document.createElement("div");    
    divQuizSelecionado.classList.add('page-quiz-selecionado');
}

function exibirQuizz(quizzId){    

    if(primeiraVezNoQuiz){

        criarDivPageQuizSelecionado();

        for(let i = 0; i < allQuizzes.length; i++){        
            if(quizzId == allQuizzes[i].id){
                quizzSelecionado = allQuizzes[i];            
            }
        }    

        esconderListaQuizzes();

        app.style.backgroundColor = '#e5e5e5'; 
    }else{
        divQuizSelecionado.innerHTML = ``;
    }

    renderizarQuizzSelecionado();

    if(primeiraVezNoQuiz){
        app.appendChild(divQuizSelecionado);
    }
    
    app.scrollTo(0, 0);
}

function esconderListaQuizzes(){
    const pageListQuizzes = document.querySelector('.page-list-Quizzes');
    pageListQuizzes.classList.add('esconder'); 
}

function renderizarQuizzSelecionado(){    

    renderizarTituloQuizzSelecionado();

    renderizarPerguntasRespostasQuizzSelecionado();    
}

function renderizarTituloQuizzSelecionado(){
    divQuizSelecionado.innerHTML +=  `
        <div class="container-quiz">
            <div class="banner-quizz">
                <img src=${quizzSelecionado.image} alt="">
                <div class="overlay">
                    <p>${quizzSelecionado.title}</p>
                </div>
            </div>
        </div>
    `;    
}

function renderizarPerguntasRespostasQuizzSelecionado(){   

    quizzSelecionado.questions.forEach((question) => {        
        criarCardPerguntaQuizzSelecionado(question);
        totalDePerguntas++;
    });    
}

function criarCardPerguntaQuizzSelecionado(question){
    let divPerguntasRespostas = document.createElement("div");    
    divPerguntasRespostas.classList.add('perguntas-respostas');    

    let divRespostas = document.createElement("div");    
    divRespostas.classList.add('respostas');
    
    divPerguntasRespostas.innerHTML += `
            <div class="pergunta" id="div-pergunta" style="background-color:${question.color}"> <p>${question.title}</p></div>
    `;   

    let respostasRandomizadas = question.answers.sort(randomizarRespostas);    

    respostasRandomizadas.forEach((answer, index) => {
        divRespostas.innerHTML += `
            <div class="opcoes" onClick="clicarRespostaQuizzSelecionado(this, ${answer.isCorrectAnswer})" id=${index} data-isCorrectAnswer=${answer.isCorrectAnswer}>
                <img src=${answer.image} alt="">
                <p>${answer.text}</p>            
        `;       
    });

    divPerguntasRespostas.appendChild(divRespostas);
    divQuizSelecionado.appendChild(divPerguntasRespostas);    
}

function clicarRespostaQuizzSelecionado(divSelecionada){
    const elementosOpcoes = divSelecionada.parentNode.children; 

    const idSelecionado = divSelecionada.id;        

    if(divSelecionada.getAttribute('data-iscorrectanswer') === 'true'){
        pontuacaoQuizzSelecionado++;
    }     

    if(!divSelecionada.classList.contains('selecionada')){
        quantidadePerguntasRespondidas++;

        for(let i = 0; i < elementosOpcoes.length; i++){
            let child = elementosOpcoes[i];        
    
            const respostaCorreta = child.getAttribute('data-iscorrectanswer');    
    
            if(idSelecionado != child.id){
                child.classList.add('opacidade');           
            }
            
            if(respostaCorreta === 'true'){
                child.classList.add('correta');
            }else{
                child.classList.add('errada');
            }
    
            child.classList.add('selecionada')
        }    
    
        if(quantidadePerguntasRespondidas === totalDePerguntas){
            criarCardResultado();
        }
        
        moverParaProximaPergunta();        
    }
}

function moverParaProximaPergunta(){
    const elementsPergunta = document.getElementsByClassName('pergunta');
    
    const intervalId = setInterval(() => {
        if(quantidadePerguntasRespondidas < totalDePerguntas){        
            elementsPergunta[quantidadePerguntasRespondidas].scrollIntoView({behavior: 'smooth'});
        }
    }, 2000);

    if(quantidadePerguntasRespondidas === totalDePerguntas){        
        clearInterval(intervalId);
    }
}

function criarCardResultado(){
    const pontuacaoFinal = calcularResultado();

    let levelUsuario;

    quizzSelecionado.levels.forEach((level) => {
        if(pontuacaoFinal >= level.minValue){
            levelUsuario = level;
        }
    });

    divQuizSelecionado.innerHTML += `
        <div class="porcentagem-quizz" id="resultado">

            <div class="qtdadeAcertos">
                <p> ${pontuacaoFinal}% de acerto: ${levelUsuario.title}</p>
            </div> 

            <div class="imagem-e-texto-final">
                <div class="imagem-quizz">
                    <img src=${levelUsuario.image}>
                </div>

                <div class="texto-final">
                    <p>${levelUsuario.text}</p>
                </div>
            </div>

        </div>

        <div class="botoes-retorno">
            <button onClick="reiniciarQuizz()">Reiniciar Quizz</button>
            <a href="#" onclick="retornarParaHome();return false;"><p>Retornar para Home</p></a>
        </div>

    </div>
    `;

    const divCardResultado = document.getElementById('resultado');
    
    divCardResultado.scrollIntoView({behavior: 'smooth'});
}

function reiniciarQuizz(){
    
    pontuacaoQuizzSelecionado = 0;
    totalDePerguntas = 0;
    quantidadePerguntasRespondidas = 0;    
    primeiraVezNoQuiz = false;

    exibirQuizz();
}

function retornarParaHome(){
    divQuizSelecionado.innerHTML = ``;

    const pageListQuizzes = document.querySelector('.page-list-Quizzes');
    pageListQuizzes.classList.remove('esconder'); 
    app.style.backgroundColor = "#FAFAFA"
    app.scrollTo(0, 0);

    return false;
}

function calcularResultado(){
    return Math.ceil((pontuacaoQuizzSelecionado / totalDePerguntas) * 100);
}

function randomizarRespostas(){
    return Math.random() - 0.5;
}

