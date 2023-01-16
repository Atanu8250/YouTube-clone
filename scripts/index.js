import {navbar, fetchUser} from "../components/navbar.js";
document.querySelector("nav").innerHTML = navbar();
fetchUser();


//TRIGGERED BY CLICKING THE SEARCH ICON
document.querySelector("#searchButton").addEventListener("click", () => {
    searchVideos();
})

//TRIGGERED BY PRESSING ENTER IN KEYBOARD
document.querySelector("#search_term").addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        searchVideos();
    }
})



// let url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${APIKEY}`


//1. funciton defination for searchVideos()
//2. make fetch call;
 const APIKEY = "AIzaSyBt3W8f_2TfTeQ0nwKPIBHLAhv__poVcg4" //mine
// const APIKEY = "AIzaSyBMxjydVRD3_CemLGbqtAJT3CgDQRvLU20" //mine-2
// const APIKEY = "AIzaSyBa8435yoIOpGjys_Pzu3yH0t52Fn3nQl8"  //anshuman
// const APIKEY = "AIzaSyAn8h71VOzmap8ve9kxoCHqKoE_T79ADD8"  //suraj

//=========================== searching videos ===========================

const searchVideos = async (sort_by_val) => {
    let serach_term = document.querySelector('#search_term').value;
    if (serach_term == "") { return }
    document.querySelector("#container").innerHTML = null;
    let img = document.createElement("img")
    try {
        img.src = "./images/loader.PNG";
        document.querySelector("#container").append(img);
        let res;
        if (sort_by_val) {
            res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${serach_term}&key=${APIKEY}&order=${sort_by_val}`)
        } else {
            res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${serach_term}&key=${APIKEY}`)
        }


        //COLLECTING THE READABLE-STREAM
        let data = await res.json();

        let actual_data = data.items;
        // let duration = data.contentDetails
        // console.log('duration:', duration)
        // console.log('actual_data:', actual_data)
        appendVideos(actual_data);

    } catch (error) {
        img.src = "./images/not_found.PNG"
        console.log('error:', error)
        document.querySelector("#container").append(img);
    }
}

//========================= Default Video List =========================

const defaultVideolist = async () => {
    let img = document.createElement("img")
    try {
        img.src = "./images/loader.PNG";
        document.querySelector("#container").append(img);
        let res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&key=${APIKEY}&chart=mostPopular`)

        //COLLECTING THE READABLE-STREAM
        let data = await res.json();

        let actual_data = data.items;
        // console.log('actual_data:', actual_data)
        appendVideos(actual_data);

    } catch (error) {
        img.src = "./images/not_found.PNG"
        console.log('error:', error)
        document.querySelector("#container").append(img);
    }
}

defaultVideolist();


//======================= Getting profile picture =======================

const channel_banner = async (channelId) => {
    try {

        let res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${APIKEY}`)

        //COLLECTING THE READABLE-STREAM
        let data = await res.json();
        return data.items[0].snippet.thumbnails.high.url;

        // appendVideos(actual_data);

    } catch (error) {
        console.log('error:', error)
    }
}



//============================= views count =============================
const viewCount = async (videoId) => {
    try {

        let res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=statistics&key=${APIKEY}&id=${videoId}`)

        //COLLECTING THE READABLE-STREAM
        let data = await res.json();
        // console.log('data:', data)

        let actual_data = data.items[0].statistics.viewCount;
        // console.log('actual_data:', actual_data)

        return actual_data;

    } catch (error) {
        console.log('error:', error)
    }
}




//=========================== video Duration ===========================

const videoDuration =async (videoId) => {
    try {

        let res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&key=${APIKEY}&id=${videoId}`)

        //COLLECTING THE READABLE-STREAM
        let data = await res.json();

        let actual_data = data.items[0].contentDetails.duration;

        return actual_data;

    } catch (error) {
        console.log('error:', error)
    }
}


//=========================== Appending data ===========================

const container = document.querySelector("#container")

const appendVideos = (data) => {
    container.innerHTML = null;

    data.forEach(async ({ snippet, id: { videoId } }) => {
        let div = document.createElement("div");

        //GETTING CHANNEL IMAGE URL
        let channelLogo = await channel_banner(snippet.channelId);

        let views = await viewCount(videoId);
        let str="";
        if (views.length > 6) {
            for (let i = 0; i < views.length - 6; i++) {
                str += views[i];
            }
            if (str.length == 1 && views[views.length - 6 != 0]) {
                str = `${str}.${views[views.length - 6]}M views`
            }
            else {
                str = `${str}M views`
            }
        }
        else if (views.length > 3) {
            for (let i = 0; i < views.length - 3; i++) {
                str += views[i];
            }
            str = `${str}K views`
        }
        else {
            str = `${views} views`
        }



        let duration = await videoDuration(videoId);

        let total_duration = ""
        let flag = false;
        for (let i = 2; i < duration.length - 1; i++) {
            if (duration[i] === "M") {
                flag = true;
                break;
            }
        }
        if (flag) {

            for (let i = 2; i < duration.length - 1; i++) {
                if (duration[i] === "H" || duration[i] === "M") {
                    total_duration += ":"
                    if (duration[i] === "M" && duration[i + 1] === undefined) {
                        total_duration += "00"
                        break;
                    }
                    if (duration[i] === "M" && duration[i + 3] === undefined) {
                        total_duration += "0" + duration[i + 1]
                        break;
                    }
                }
                else {
                    total_duration += duration[i]
                }
            }
        }
        else{
            if(duration[3]==="S")
            {
                total_duration+= "0:0"+duration[2];
            }
            else if(duration[4]==="S")
            {
                total_duration+= "0:"+duration[2]+duration[3];
            }
        }
        if(duration===undefined){
            total_duration="07:36"
        }

        let video_title = snippet.title;
        if(video_title.length > 65){
            let x = ""
            for(let i=0; i<=65; i++){
                x += video_title[i];
            }
            video_title = x;
        }

        div.innerHTML = `
        <div>
            <img src = "${snippet.thumbnails.high.url}"/>
            <p>${total_duration}</p>
        </div>
        <div>
            <img src = ${channelLogo}>
            <div>
                <p>${video_title}</p>
                <p>${snippet.channelTitle}</p>
                <p>${str}</p>
            </div>
        </div>        
        `

        div.onclick = () => {
            let data = { snippet, videoId, channelLogo, views }
            localStorage.setItem("clicked_video", JSON.stringify(data));
            window.location.href = "video.html";
        }
        container.append(div);
    })
}


//SORT BY VIEWS
document.querySelector("#sort_by_view").addEventListener("click", () => {
    searchVideos("viewCount")
})

//SORT BY ALPHABETS
document.querySelector("#sort_by_alphabet").addEventListener("click", () => {
    searchVideos("title")
})

//SORT BY POPULARITY
document.querySelector("#sort_by_popularity").addEventListener("click", () => {
    searchVideos("rating")
})



//YT APP II

//1. MAKE THE THUMBNAILS FOR THE VIDEOS
//2. MAKE IT CLICKABLE










//show the left side panel
let flag = 0;
document.querySelector("#ham_burger").onclick = () => {
    if (flag) {
        document.querySelector("#left_open").setAttribute("id", "left"); document.querySelector("#container").style.marginLeft = "75px";
        document.querySelector("#container").style.width = "94vw";
        document.querySelector("#sort").style.marginLeft = "75px";
        document.querySelector("#sort").style.width = "94vw";
        flag = 0;
    } else {
        document.querySelector("#left").setAttribute("id", "left_open")
        document.querySelector("#container").style.marginLeft = "167px";
        document.querySelector("#container").style.width = "88vw";
        document.querySelector("#sort").style.marginLeft = "167px"
        document.querySelector("#sort").style.width = "88vw"
        flag = 1;
    }
}