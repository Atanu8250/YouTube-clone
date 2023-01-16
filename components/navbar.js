function navbar() {
    return `
        <img id="ham_burger" src = "./images/ham_burger.png"/>
        <a href="index.html" id="logo">
            <img src="./images/main-logo.PNG" alt="logo">
        </a>

        <div id="search">
            <img src = "./images/search.jpg"/>
            <input id="search_term" type="text" id="search_term" placeholder="Search">
            <img id="searchButton" src = "./images/search.jpg"/>
            <img src = "./images/microphone.jpg"/>
        </div>

        <div id="user_section">
            <img src = "./images/video_plus.png"/>
            <img src = "./images/notification.png"/>
            <div>
                <a href = "sign-up.html">Sign Up</a>
                <img id="user_image" src="https://lh3.googleusercontent.com/a/ALm5wu2TxQMGs1XHDjf0t3RP-SBkyEZBwWQfuugPDYsLwA8=s96-c-rg-br100" alt="user-image">
                <p></p>
            </div>
        </div>
    `
}

function fetchUser() {
    let loggedin_user = JSON.parse(localStorage.getItem("logged in user"));

    if (loggedin_user) {
        document.querySelector("#user_section>div>a").style.display = "none";
        document.querySelector("#user_image").src = loggedin_user.description;
        document.querySelector("#user_image+p").textContent = loggedin_user.name;
    } else {
        document.querySelector("#user_image").style.display = "none";
        document.querySelector("#user_image+p").style.display = "none";
    }
}

export {navbar, fetchUser};