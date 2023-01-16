import {navbar, fetchUser} from "../components/navbar.js";
document.querySelector("nav").innerHTML = navbar();
fetchUser();

import User from "../components/user.js";


let form = document.querySelector("form");
    form.onsubmit = (event)=>{
        event.preventDefault();
        let n = form.name.value;
        let e = form.email.value;
        let u = form.username.value;
        let p = form.password.value;
        let m = form.mobile.value;
        let d = form.description.value;

        let user = new User();
        user.signUp(n,e,u,p,m,d);
    }

