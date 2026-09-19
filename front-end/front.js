const btn = document.querySelector('#btn')
btn.addEventListener('click', enviar)
let body = document.querySelector('article')
let clonado = document.querySelector('.usuario')

async function enviar(){
    console.log('entrou')
    let nome = document.querySelector('#idnome').value
    if(nome === ''){
        console.log('não tem nome')
        return
    }
    let email = document.querySelector('#idemail').value.trim()
    if(email === ''){
        console.log('não tem email')
        return
    }

    let idade = document.querySelector('#ididade').value
    if(idade === ''){
        console.log('não tem idade')
        return
    }

    let resposta = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            idade: idade,
            email: email
        })
    })
    let dados = await resposta.json()
    if (!resposta.ok) {

        console.log('aq')
        const popup = document.getElementById('popup');
        popup.classList.add('active');
        popup.querySelector('#tit').textContent = dados.erro
        let btnclose = document.querySelector('.popup-close')
        popup.addEventListener('click', (event) => {
            console.log(popup)
            if (event.target === popup) {
                popup.classList.remove('active');
            }
            else if(event.target === btnclose){
                popup.classList.remove('active');
                
            }
        });
    }
    else{
        coisas()
    }




}
async function coisas() {
    body.innerHTML=''
    try {
        

        let dados = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }})


        let json = await dados.json()


        

        for (let i = 0; i < json.length; i++){
            let clone = clonado.cloneNode(true);
            clone.querySelector('#btndelet').addEventListener('click', apagar)
            clone.querySelector(".nome").textContent = "Nome: " + json[i].nome
            clone.querySelector(".email").textContent = "Email: " + json[i].email
            clone.dataset.email = json[i].email
            clone.querySelector(".idade").textContent = "Idade: " + json[i].idade
            clone.style.display = 'flex'

            body.appendChild(clone)

        }






    } 
    catch (error) {
        console.log(error)
    }
    
}
window.onload = function() {
  coisas()
};

async function apagar(event){
    try {
        

        let dados = await fetch(`http://localhost:3000/users/${event.currentTarget.parentElement.dataset.email}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }})


        coisas()






    } 
    catch (error) {
        console.log(error)
    }
}