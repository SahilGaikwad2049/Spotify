let currentSong = new Audio();

function minutesToSeconds(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    let formattedSeconds = sec < 10 ? '0' + sec : sec;
    return min + ':' + formattedSeconds;
}

async function ghazalSongs(){
    let a = await fetch("http://127.0.0.1:3000/Spotify/Ghazals/")
    let res = await a.text()

    let div = document.createElement("div")
    div.innerHTML = res;
    let as = div.getElementsByTagName("a")
    let songs = [];
    for(let i = 0; i < as.length; i++)
    {
        let ind = as[i];
        if(ind.href.endsWith(".mp3"))
        {
            songs.push(ind.href.split("/Ghazals/")[1]);
        }
    }
    return songs;
}

async function imags(){
    let b = await fetch("http://127.0.0.1:3000/Spotify/images/gaz/")
    let ans = await b.text()
    console.log(ans)

    let div = document.createElement("div")
    div.innerHTML = ans;
    let as = div.getElementsByTagName("a")
    let pics = [];
    for(let i = 0; i < as.length; i++)
    {
        let ind = as[i];
        if(ind.href.endsWith(".jpeg"))
        {
            pics.push(ind.href.split("/gaz/")[1]);
        }
    }
    return pics;    

}

imags()

const playTheSong = (track) =>{
    currentSong.src = "/Spotify/Ghazals/" + track;
    currentSong.play()
    document.querySelector(".info").querySelector(".sub").firstElementChild.innerHTML = track.split(".")[0].split("-")[0]
    document.querySelector(".info").querySelector(".sub").querySelector(".tds").innerHTML = track.split(".")[0].split("-")[1]
    
}

async function main()
{
    let songs = await ghazalSongs();
    console.log(songs);

    let pics = await imags()
    console.log(pics)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    let objG = {		
        "Chupke Chupke Raat Din" : "/Spotify/images/gaz/chupke.jpeg",
        "Hoshwalon Ko Khabar Kya" : "/Spotify/images/gaz/hosh.jpeg",
        "Hothon Se Chhu Lo Tum" : "/Spotify/images/gaz/ghazals.jpeg"
    }

    for (const j of songs) {
        const title = j.replaceAll("%20", " ").split(".")[0].split("-")[0]
        songUL.innerHTML += `<li> 
                            <img width="70px" src=${objG[title]} alt="">
                            <div class="cv">
                                <div class="artists">
                                    <div>${j.replaceAll("%20", " ").split(".")[0].split("-")[0]}</div>
                                    <div class="tits">${j.replaceAll("%20", " ").split(".")[0].split("-")[1]}</div>
                                </div>
                                    <button>
                                        <img width="20px" src="images/play2.svg" alt="">
                                    </button>
                            </div>
         </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".artists").firstElementChild.innerHTML);
            playTheSong(e.querySelector(".artists").firstElementChild.innerHTML+"-"+e.querySelector(".artists").querySelector(".tits").innerHTML+".mp3");
            pray.src = "images/pause.svg"
        })
    })

    pray.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            pray.src = "images/pause.svg"
        }

        else{
            currentSong.pause();
            pray.src = "images/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".durat").querySelector(".long").innerHTML = `${minutesToSeconds(currentSong.currentTime).split(".")[0]}`
        document.querySelector(".durat").querySelector(".end").innerHTML = `${minutesToSeconds(currentSong.duration).split(".")[0]}`
        // document.querySelector(".circle").style.left = .5+"vw"
    })
}

main()