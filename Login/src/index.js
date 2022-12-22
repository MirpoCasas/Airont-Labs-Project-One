let passRegEx = new RegExp(
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,20}$/
);
let emailRegEx = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
let responseField = document.querySelector(".loginresponse");
let loginform = document.querySelector(".loginform");
let password = document.querySelector("#password");
let email = document.querySelector("#email");
let showpass = document.querySelector(".imgcont");
let rememberme = document.querySelector("#rememberbox")

function handleResponses(status) {
    responseField.style.display = "flex";
    responseField.innerHTML = `
    <p>${status}</p>
    `;
}

// This function sets up the fetch
// function to be used on the log in.

async function loginFetch(finalObject) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(finalObject);

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    const response = await fetch("http://localhost:3000/login", requestOptions);

    if (!response.ok) {
        console.log(response);
        const status = await response.text();
        console.log(status);
        handleResponses(status);
    } else {
        responseField.style.display = "flex";
        responseField.style.backgroundColor = "green";
        responseField.innerHTML = `
        <p>Success!</p>
        `;
        console.log(response);
        const res = await response.json();
        console.log(res);
        const token = res.accessToken;
        console.log(token);

        if (rememberme.checked) {
            localStorage.setItem("auth", token);
        } else {
            sessionStorage.setItem("auth", token)
        }


        window.location.href = "../Front/index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // This next part adds the ability to change
    // the password to be seen or hidden.

    showpass.addEventListener("click", (e) => {
        if (password.type === "password") {
            password.type = "text";
        } else if (password.type === "text") {
            password.type = "password";
        }
    });

    // This next part handles the log in validation

    loginform.addEventListener("submit", (e) => {
        e.preventDefault();

        let error = 0;
        let passValue = password.value;
        let emailValue = email.value;
        let curatedPassword = "";
        let curatedEmail = "";
        let object = {};

        if (passValue === "") {
            handleResponses("Password cant be empty");
            error++;
        } else if (!(8 <= passValue.length <= 20)) {
            handleResponses("password should be between 8 and 20 characters");
            error++;
        } else if (passRegEx.test(passValue)) {
            console.log("password is ok!");
            // assign password to final var
            curatedPassword = passValue;
        } else {
            handleResponses("Incorrect password");
            error++;
        }

        if (emailValue.length === 0) {
            handleResponses("Email can't be empty");
        } else if (emailRegEx.test(emailValue)) {
            console.log("email is ok!");

            //assign email to final var
            curatedEmail = emailValue;
        } else {
            handleResponses("Email is must have a valid format");
            error++;
        }

        if (error === 0) {
            object.email = curatedEmail;
            object.password = curatedPassword;

            console.log(object);
            loginFetch(object);
        }
    });
});
