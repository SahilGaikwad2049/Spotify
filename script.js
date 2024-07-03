let currentSong = new Audio();
let songs;
let currFolder;

let objG = {		
    "Chupke Chupke Raat Din" : "/Spotify/images/gaz/chupke.jpeg",
    "Hoshwalon Ko Khabar Kya" : "/Spotify/images/gaz/hosh.jpeg",
    "Hothon Se Chhu Lo Tum" : "/Spotify/images/gaz/ghazals.jpeg",
    "Humko Kiske Gham Ne Mara" : "/Spotify/images/gaz/humko.jpeg",
    "Lover" : "/Spotify/images/dil/peach.jpeg",
    "Lemonade" : "/Spotify/images/dil/lover.jpeg",
    "Peaches" : "/Spotify/images/dil/lover.jpeg",
    "Firework" : "/Spotify/images/katyy/cali.jpeg",
    "Hot N Cold" : "/Spotify/images/katyy/hotncold.jpeg",
    "Last Friday Night (TGIF)" : "/Spotify/images/katyy/cali.jpeg",
    "Ik Kudi" : "/Spotify/images/jain/ikkudi.jpeg",
    "Aadha Ishq" : "/Spotify/images/liked/ishq.jpeg",
    "Choo Lo" : "/Spotify/images/liked/choolo.jpeg",
    "A Flying Jatt : Title Track":"/Spotify/images/liked/jatt.jpeg",
    "There Is a Light That Never Goes Out":"/Spotify/images/eng/smiths.jpeg",
    "Cupid : Twin Version":"/Spotify/images/eng/cupid.jpeg",
    "Octopus's Garden":"/Spotify/images/eng/oct.jpeg",
    "Last Christmas":"/Spotify/images/eng/last.jpeg",
    "Raabta":"/Spotify/images/jain/raabta.jpeg",
    "Select a Playlist" : "Spotify/images/"
}

function minutesToSeconds(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    let formattedSeconds = sec < 10 ? '0' + sec : sec;
    return min + ':' + formattedSeconds;
}

async function getSongs(folder) {
    currFolder = folder;

        let a = await fetch(`http://127.0.0.1:3000/Spotify/songs/${folder}/`);
        let res = await a.text();
    
        let div = document.createElement("div");
        div.innerHTML = res;
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let i = 0; i < as.length; i++) {
            let ind = as[i];
            if (ind.href.endsWith(".mp3")) {
                let song = ind.href.split(`/${folder}/`)[1];
                if (song) {
                    songs.push(song);
                }
            }
        }
        return songs;
    
}

const playTheSong = (track) => {
    const decodedTrack = decodeURIComponent(track); 
    currentSong.src = `/Spotify/songs/${currFolder}/${decodedTrack}`;
    currentSong.play()

    const [music, musician] = decodedTrack.split(".")[0].split("-");
    let musicElement = document.querySelector(".info .sub").firstElementChild;
    musicElement.innerHTML = music;

    let musicianElement = document.querySelector(".info .sub .tds");
    musicianElement.innerHTML = musician;

    let imgElement = document.querySelector(".info img");
    imgElement.src = objG[music]

}


async function main() {
    let songs = await getSongs("hehe");

    let songUL = document.querySelector(".songList ul");

    for (const j of songs) {
        if (j) {
            const title = j.replaceAll("%20", " ").split(".")[0].split("-")[0];
            songUL.innerHTML += `<li> 
                                    <img width="70px" src=${objG[title] || "default-image-path"} alt="">
                                    <div class="cv">
                                        <div class="artists">
                                            <div>${title}</div>
                                            <div class="tits">${j.replaceAll("%20", " ").split(".")[0].split("-")[1]}</div>
                                        </div>
                                    </div>
                                 </li>`;
        }
    }

    document.getElementById("pray").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.getElementById("pray").src = "images/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("pray").src = "images/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".durat .long").innerHTML = minutesToSeconds(currentSong.currentTime).split(".")[0];
        document.querySelector(".durat .end").innerHTML = minutesToSeconds(currentSong.duration).split(".")[0];
        document.querySelector(".circle").style.left = ((currentSong.currentTime / currentSong.duration) * 100 - 1.4) + "%";
        if(currentSong.currentTime == currentSong.duration)
        {let i = songs.indexOf(currentSong.src.split("/").pop());
            if ((i + 1) < songs.length) {
                playTheSong(songs[i + 1]);
                // document.getElementById("pray").src = "images/play.svg";
            }
        }
    });

    document.querySelector(".bar").addEventListener("click", e => {
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        currentSong.currentTime = (currentSong.duration * per) / 100;
    });

    document.getElementById("previous").addEventListener("click", () => {
        let i = songs.indexOf(currentSong.src.split("/").pop());
        if ((i - 1) >= 0) {
            playTheSong(songs[i - 1]);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        let i = songs.indexOf(currentSong.src.split("/").pop());
        if ((i + 1) < songs.length) {
            playTheSong(songs[i + 1]);
        }
    });

    Array.from(document.getElementsByClassName("cards what")).forEach(e => {
        e.addEventListener("click", async function() {
            const folder = this.dataset.folder;
            if (folder) {
                let newSongs = await getSongs(folder);
                songs = newSongs; 

                songUL.innerHTML = "";
                for (const j of songs) {
                    if (j) {
                        const title = j.replaceAll("%20", " ").split(".")[0].split("-")[0];
                        songUL.innerHTML += `<li> 
                                                <img width="70px" src=${objG[title] || "default-image-path"} alt="">
                                                <div class="cv">
                                                    <div class="artists">
                                                        <div>${title}</div>
                                                        <div class="tits">${j.replaceAll("%20", " ").split(".")[0].split("-")[1]}</div>
                                                    </div>
                                                </div>
                                             </li>`;
                    }
                }

                Array.from(document.querySelectorAll(".songList ul li")).forEach(e => {
                    e.addEventListener("click", () => {
                        const title = e.querySelector(".artists").firstElementChild.innerHTML;
                        const artist = e.querySelector(".artists .tits").innerHTML;
                        playTheSong(`${title}-${artist}.mp3`);
                        document.getElementById("pray").src = "images/pause.svg";
                    });
                });

                Array.from(document.querySelectorAll(".primo .container .box")).forEach(e => {
                    e.addEventListener("click", () => {
                        const title = e.querySelector(".artists").firstElementChild.innerHTML;
                        const artist = e.querySelector(".artists .tits").innerHTML;
                        playTheSong(`${title}-${artist}.mp3`);
                        document.getElementById("pray").src = "images/pause.svg";
                    });
                });
            }
        });
    });

    Array.from(document.getElementsByClassName("cards what")).forEach(e => {
        e.addEventListener("click", async function() {
            const folder = this.dataset.folder;
            if (folder) {
                let newSongs = await getSongs(folder);
                songs = newSongs; 

                songUL.innerHTML = "";
                for (const j of songs) {
                    if (j) {
                        const title = j.replaceAll("%20", " ").split(".")[0].split("-")[0];
                        songUL.innerHTML += `<li> 
                                                <img width="70px" src=${objG[title] || "default-image-path"} alt="">
                                                <div class="cv">
                                                    <div class="artists">
                                                        <div>${title}</div>
                                                        <div class="tits">${j.replaceAll("%20", " ").split(".")[0].split("-")[1]}</div>
                                                    </div>
                                                </div>
                                             </li>`;
                    }
                }

                Array.from(document.querySelectorAll(".songList ul li")).forEach(e => {
                    e.addEventListener("click", () => {
                        const title = e.querySelector(".artists").firstElementChild.innerHTML;
                        const artist = e.querySelector(".artists .tits").innerHTML;
                        playTheSong(`${title}-${artist}.mp3`);
                        document.getElementById("pray").src = "images/pause.svg";
                    });
                });
            }
        });
    });
}

main();
