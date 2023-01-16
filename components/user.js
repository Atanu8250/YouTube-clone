class User{
    constructor(){

    }

    async signUp(n, e, u, p, m, d){

        this.name = n;
        this.email = e;
        this.username = u;
        this.password = p;
        this.mobile = m;
        this.description = d;

        try {
            const registration_api = `https://masai-api-mocker.herokuapp.com/auth/register`

            const response = await fetch(registration_api, {
                method: "POST",
                body: JSON.stringify(this),
                headers:{
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            // console.log('data:', data)
            if (data.error != undefined) {
                alert(data.message)
            }
            window.location.href = "log-in.html"

        } catch (error) {
            console.log('error:', error)
        }
    }


    async logIn(u, p){
        this.username = u;
        this.password = p;

        try {
            const logIn_api = `https://masai-api-mocker.herokuapp.com/auth/login`

            const response = await fetch(logIn_api, {
                method: "POST",
                body: JSON.stringify(this),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json();

            console.log('data:', data)
            // return data;
            if(!data.error){
                alert("Log-in successful")
            }else{
                alert("Log-in failed!")
            }
            this.getUserDetails(u, data.token);
        } catch (error) {
            console.log('error:', error)
        }
    }

    async getUserDetails(username, token){
        console.log('username:', username)
        console.log('token:', token)
        const api_link = `https://masai-api-mocker.herokuapp.com/user/${username}`
    
        try {
            const response = await fetch(api_link,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': `application/json`
                }
            })
    
            const data = await response.json();
            console.log('data:', data)
            localStorage.setItem("logged in user", JSON.stringify(data));
            window.location.href = "index.html"
            
        } catch (error) {
            console.log('error:', error)
        }
    }
}


export default User;