import {navbar, fetchUser} from "../components/navbar.js";
document.querySelector("nav").innerHTML = navbar();
fetchUser();

import User from "../components/user.js";

let login_form = document.querySelector("form")

login_form.onsubmit = (event)=>{
    event.preventDefault();
    let u = login_form.username.value;
    let p = login_form.password.value;

    let user = new User();
    user.logIn(u,p);
}
