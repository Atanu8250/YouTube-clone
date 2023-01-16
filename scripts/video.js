import { navbar, fetchUser } from "../components/navbar.js";
document.querySelector("nav").innerHTML = navbar();
fetchUser();



 const APIKEY = "AIzaSyBt3W8f_2TfTeQ0nwKPIBHLAhv__poVcg4" //mine
// const APIKEY = "AIzaSyBMxjydVRD3_CemLGbqtAJT3CgDQRvLU20" //mine-2
// const APIKEY = "AIzaSyBa8435yoIOpGjys_Pzu3yH0t52Fn3nQl8"  //anshuman
// const APIKEY = "AIzaSyAn8h71VOzmap8ve9kxoCHqKoE_T79ADD8"  //suraj




//https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${APIKEY}

//======================== Getting subscriber ========================
const subscriber = async(channelId) => {
    let res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${APIKEY}`)

    let data = await res.json();
    let actual_data = data.items[0].statistics.subscriberCount;
    return actual_data;
    // console.log('actual_data:', actual_data)
}



const showClickedVideo = async() => {
    let { snippet, videoId, channelLogo } = JSON.parse(localStorage.getItem("clicked_video"));

    // EMBEDDING THE VIDEO
    let iframe = document.createElement("iframe");

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`
    iframe.width = "100%"
    iframe.height = "100%"
    iframe.setAttribute(`allowfullscreen`, true);

    document.querySelector("#main_video>div").append(iframe);

    document.querySelector("#desc>h3").textContent = snippet.title;

    document.querySelector("#channel_about>img").src = channelLogo;
    document.querySelector("#channel_about>div>p:first-child").textContent = snippet.channelTitle;

    let videoDetails = JSON.parse(localStorage.getItem("clicked_video"));
    // console.log('videoDetails:', videoDetails.views)
    let views = videoDetails.views;
    let str = ""
    let count = 1;
    for (let i = views.length - 1; i >= 0; i--) {
        if (count == 3 || count == 5 || count == 7) {
            if(i != 0){
                str += views[i]+","
            }
        }else{
            str += views[i];
        }
        count++;
    }
    views = ""
    for(let i=str.length-1; i>=0; i--){
        views += str[i];
    }

    document.querySelector("#views").textContent = views;


    let subscribers = await subscriber(videoDetails.snippet.channelId);
    console.log('subscribers:', subscribers)
    let str_1 = "";
        if (subscribers.length > 6) {
            for (let i = 0; i < subscribers.length - 6; i++) {
                str_1 += subscribers[i];
            }
            if (str_1.length == 1 && subscribers[subscribers.length - 6 != 0]) {
                str_1 = `${str_1}.${subscribers[subscribers.length - 6]}M subscribers`
            }
            else {
                str_1 = `${str_1}M subscribers`
            }
        }
        else if (subscribers.length > 3) {
            for (let i = 0; i < subscribers.length - 3; i++) {
                str_1 += subscribers[i];
            }
            str_1 = `${str_1}K subscribers`
        }
        else {
            str_1 = `${subscribers} subscribers`
        }


    document.querySelector("#channel_about>div:last-child>p:nth-child(2)").textContent = str_1;

    document.querySelector("#channel_about>div>p:nth-child(3)").textContent = snippet.description;
}

//AFTER LOADING THE VIDEO.HTML PAGE, IT WILL CALL THE showClickedVideo FUNCTION
document.querySelector("body").onload = showClickedVideo();


//========================= Default Video List =========================

const defaultVideolist = async () => {
    console.log("defaultVideolist called")

    try {
        let res = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&key=${APIKEY}&chart=mostPopular`)

        //COLLECTING THE READABLE-STREAM
        let data = await res.json();

        let actual_data = data.items;
        appendVideos(actual_data);

    } catch (error) {
        console.log('error:', error)
    }
}


document.querySelector("body").onload = ()=>{
    defaultVideolist();
}

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

//https://youtube.googleapis.com/youtube/v3/comments?part=status&key=AIzaSyAn8h71VOzmap8ve9kxoCHqKoE_T79ADD8&id=UyY3g76Icoo


//=========================== video Duration ===========================

const videoDuration = async (videoId) => {
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

const container = document.querySelector("#recomended_videos")

const appendVideos = (data) => {
    container.innerHTML = null;

    data.forEach(async ({ snippet, id: { videoId } }) => {
        let div = document.createElement("div");

        let channelLogo = await channel_banner(snippet.channelId);

        let views = await viewCount(videoId);
        let str = "";
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
        else {
            if (duration[3] === "S") {
                total_duration += "0:0" + duration[2];
            }
            else if (duration[4] === "S") {
                total_duration += "0:" + duration[2] + duration[3];
            }
        }
        if (duration === undefined) {
            total_duration = "07:36"
        }

        let video_title = snippet.title;
        if (video_title.length > 50) {
            let x = ""
            for (let i = 0; i <= 50; i++) {
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
            <p>${video_title}</p>
            <p>${snippet.channelTitle}</p>
            <p>${str}</p>         
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


