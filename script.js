
/***************************************/                   
/*       JAVASCRIPT CRIAR QUIZZ       */
/*************************************/

//Variáveis importantes que serão adicionadas no objeto 'quizz' mais tarde
let titleQuizz;
let urlImage;
let questionsNumber;
let levelsNumber;

//Passar da página inicial para a de criar quizz
function criarQuizz(){
    const pageListQuizzes = document.querySelector('.page-list-Quizzes');
    pageListQuizzes.classList.add('esconder');
    const infoBasica = document.querySelector('.basic-info');
    infoBasica.classList.remove('esconder')

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
            <input type="text" class="title-question first" placeholder="Texto da pergunta"/>
            <input type="text" class="color-question" placeholder="Cor de fundo da pergunta"/>
            <div class="correct">
                <h2>Resposta correta</h2>
                <input type="text" class="correct-answer answer" placeholder="Resposta correta"/>
                <input type="text" class="url urlCorrect" placeholder="URL da imagem"/>
            </div>
            <div class="incorrect">
                <h2>Respostas incorretas</h2>
                <input type="text" class="incorrect-answer1 incorrect" placeholder="Resposta incorreta 1"/>
                <input type="text" class="url urlIncorrect1" placeholder="URL da imagem 1"/>

                <input type="text" class="incorrect-answer2 icorrect" placeholder="Resposta incorreta 2"/>
                <input type="text" class="url urlIncorrect2" placeholder="URL da imagem 2"/>

                <input type="text" class="incorrect-answer3 incorrect" placeholder="Resposta incorreta 3"/>
                <input type="text" class="url urlIncorrect3" placeholder="URL da imagem 3"/>
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
function prosseguirNiveis(){
    
    for(let i =1; i <= questionsNumber; i++){
        const questions = document.querySelector(`.questions .pergunta${[i]}`);
    }
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
