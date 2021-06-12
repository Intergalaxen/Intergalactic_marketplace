function updateCart() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/cartnum?user=" + getCookie("user"));
    xhr.onreadystatechange = () => {
        if ((xhr.status = XMLHttpRequest.DONE)) {
            document.getElementById("cart").innerText = xhr.response;
        }
    };
    xhr.send();
}

function buy(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/buy?id=" + id + "&user=" + getCookie("user"));
    xhr.onreadystatechange = () => {
        if ((xhr.status = XMLHttpRequest.DONE)) {
            updateCart();
        }
    };
    xhr.send();
}

// Uppdatera cart-delen direkt
updateCart();

window.onload = () => {
    document.getElementById("cart").href += "?user=" + getCookie("user");
};