let currentSong = new Audio();

let objG = {		
    "Chupke Chupke Raat Din" : "/Spotify/images/gaz/chupke.jpeg",
    "Hoshwalon Ko Khabar Kya" : "/Spotify/images/gaz/hosh.jpeg",
    "Hothon Se Chhu Lo Tum" : "/Spotify/images/gaz/ghazals.jpeg",
    "Humko Kiske Gham Ne Mara" : "/Spotify/images/gaz/humko.jpeg"
}

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
    
//    let x = document.querySelector(".info").querySelector(".sub").firstElementChild.innerHTML = track.split(".")[0].split("-")[0]
//     document.querySelector(".info").querySelector(".sub").querySelector(".tds").innerHTML = track.split(".")[0].split("-")[1]
//     document.querySelector(".info").getElementsByTagName("img").innerHTML = `$objG[x]`

    const[music, musician] = track.split(".")[0].split("-");
    let musicElement = document.querySelector(".info .sub").firstElementChild;
    musicElement.innerHTML = music;

    let musicianElement = document.querySelector(".info .sub .tds");
    musicianElement.innerHTML = musician;

    let imgElement = document.querySelector(".info img");
    imgElement.src = objG[`${music}`]
}

async function main()
{
    let songs = await ghazalSongs();
    console.log(songs);

    let pics = await imags()
    console.log(pics)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    

    for (const j of songs) {
        const title = j.replaceAll("%20", " ").split(".")[0].split("-")[0]
        songUL.innerHTML += `<li> 
                            <img width="70px" src=${objG[title]} alt="">
                            <div class="cv">
                                <div class="artists">
                                    <div>${j.replaceAll("%20", " ").split(".")[0].split("-")[0]}</div>
                                    <div class="tits">${j.replaceAll("%20", " ").split(".")[0].split("-")[1]}</div>
                                </div>
                                   
                            </div>
         </li>`;
    }

    // document.querySelectorAll(".songList ul li").forEach(item => {
    //     item.addEventListener("mouseover", e => {
    //         const cv = e.currentTarget.querySelector(".cv");
    //         if (!cv.querySelector(".play-button")) { // Check if the button doesn't already exist
    //             cv.innerHTML += `
    //                 <button class="play-button">
    //                     <img width="20px" src="images/play2.svg" alt="">
    //                 </button>`;
    //         }
    //     });
    
    //     item.addEventListener("mouseout", e => {
    //         const playButton = e.currentTarget.querySelector(".play-button");
    //         if (playButton) {
    //             playButton.remove();
    //         }
    //     });
    // });
    
    // document.querySelectorAll(".songList ul li").forEach(e => {
    //     e.addEventListener("click", e => {
    //         const cv = e.currentTarget.querySelector(".cv")
    //         cv.innerHTML += `
    //                  <button class="play-button">
    //                      <img width="20px" src="images/play2.svg" alt="">
    //              </button>`;
    //     })
    // })

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
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration)*100 - 1.4) + "%"
    })

    document.querySelector(".bar").addEventListener("click",e=>{
        let per = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = per + "%";
        currentSong.currentTime = ((currentSong.duration)*per)/100
    })
}

main()