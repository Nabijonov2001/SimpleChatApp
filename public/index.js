
const chatarea = document.querySelectorAll('.chatarea')
const listGroupItem = document.querySelectorAll('.list-group-item')
const parentListGroupItem = document.querySelector('.list-group')

function hideChatArea(){
    chatarea.forEach(element => {
        element.style.display = 'none'
    })
    listGroupItem.forEach(element=>{
        element.classList.remove('active')
    })
}

function showChatArea(i = 0){
   chatarea[i].style.display = 'block'
   listGroupItem[i].classList.add('active')
}

hideChatArea()
showChatArea()


parentListGroupItem.addEventListener('click', (e)=>{
    if(e.target && e.target.classList.contains('list-group-item')){
        listGroupItem.forEach((item, index)=>{
            if(e.target == item){
                console.log(e.target)
                hideChatArea()
                showChatArea(index)
            }
            
        })
    }  
})

