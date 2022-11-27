let passRegEx = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,20}$/);
let emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)


function loginFetch(finalObject) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify(finalObject);
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:3000/login", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}



document.addEventListener("DOMContentLoaded", () => {
    let loginform = document.querySelector(".loginform");
    let password = document.querySelector("#password");
    let email = document.querySelector("#email");
    
    loginform.addEventListener("submit", e => {
        
        e.preventDefault();
        
        let error = 0;
        let passValue = password.value;
        let emailValue = email.value;
        let curatedPassword = '';
        let curatedEmail = '';
        let object = {}

        if (passValue === '') {
            console.log('password cant be empty');
            error++;
        } else if (!(8 <= passValue.length <= 20)) {
            console.log("password should be between 8 and 20 characters");
            error++;
        } else if (passRegEx.test(passValue)) {
            console.log("password is ok!");
            // assign password to final var
            curatedPassword = passValue
        } else {
            console.log('password is not ok!');
            error++;
        }

        if (emailRegEx.test(emailValue)) {
            console.log("email is ok!");
            //assign email to final var
            curatedEmail = emailValue
        } else {
            console.log("email is not ok!");
            error++;
        }
        
        if (error === 0) {
            object.email = curatedEmail
            object.password = curatedPassword
            loginFetch(object)
        }

    })
})