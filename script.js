const menu = document.getElementById("menu")
const basketBtn = document.getElementById("basket-btn")
const basketModal = document.getElementById("basket-modal")
const basketItemsContainer = document.getElementById("basket-items")
const basketTotal = document.getElementById("basket-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const basketCounter = document.getElementById("basket-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let basket = [];

//Abrir o Modal do carrinho
basketBtn.addEventListener("click", function(){
    updateBasketModal()
    basketModal.style.display = "flex"
})

//Fechar o Modal quando clicar fora
basketModal.addEventListener("click", function(event){
    if (event.target === basketModal) {
        basketModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    basketModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-basket-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToBasket(name, price)

    }

})

//Função para adicionar no carrinho
function addToBasket(name, price){
    const existingItem = basket.find(item => item.name === name)

    if (existingItem){
        //Se o item já existe, aumenta apenas a quantidade +1
        existingItem.quantity += 1;

    }else{

        basket.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateBasketModal()
}

//Atualiza o carrinho
function updateBasketModal(){
    basketItemsContainer.innerHTML = "";
    let total = 0;

    basket.forEach(item => {
        const basketItemElement = document.createElement("div");
        basketItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        basketItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                    </div>

                <button class="remove-from-basket-btn", data-name="${item.name}"> 
                    Remover 
                </button>
            
                 </div>
                                        
            </div>
                        
        `
        total += item.price * item.quantity

        basketItemsContainer.appendChild(basketItemElement)

    })

    basketTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    basketCounter.innerHTML = basket.length;

}

//Função para remover item do carrinho
basketItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-basket-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemBasket(name);
    }
});

function removeItemBasket(name){
    const index = basket.findIndex(item => item.name === name);

    if(index!== -1){
        const item = basket[index];

        if (item.quantity > 1){
            item.quantity -= 1;
            updateBasketModal();
            return;
        }

        basket.splice(index,1);
        updateBasketModal();

    }

}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//Finalizar Pedido
checkoutBtn.addEventListener("click",function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o Restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }
   
    if(basket.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

     //Enviar o pedido para app whats
     const basketItems = basket.map((item) => {
        return ( `${item.name} Quantidade: (${item.quantity} Preço: R$${item.price}) |`
     )   
    }).join("")

    const message = encodeURIComponent(basketItems)
    const phone = "0000000000"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")

    basket=[];
    updateBasketModal();

})
   
// Verificar a hora e manipular o card horário
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 12  && hora < 23;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span")
const isOpen =  checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-yellow-600")
}else{
    spanItem.classList.remove("bg-yellow-600")
    spanItem.classList.add("bg-red-500")
}