let container=document.querySelector(".container");

setTimeout(()=>{
    container.classList.add("remove");

    setTimeout(()=>{
        container.remove();
        window.location.href = "../Login_Folder/Login.html";
    },2000);
},5000);