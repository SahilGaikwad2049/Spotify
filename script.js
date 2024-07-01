async function ghazalSongs(){
    let a = await fetch("http://127.0.0.1:3000/Spotify/Ghazals/")
    let res = await a.text()
    console.log(res)

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

async function main()
{
    let songs = await ghazalSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const j of songs) {
        songUL.innerHTML += `<li> 
                            <img width="70px" src="images/katyperry.jpeg" alt="">
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

    var audio = new Audio(songs[1]);
    // audio.play();
}

main()