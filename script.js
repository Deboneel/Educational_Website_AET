window.onload = function () {
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    if (username && password) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("main-container").classList.remove("hidden");
        document.getElementById("user-name").innerText = username;
    }
};


function bckgroundImagen(){
  document.body.style.backgroundImage = "url('https://images7.alphacoders.com/611/thumb-1920-611159.jpg')";
}
function bckgroundImaged(){
  document.body.style.backgroundImage = "url('https://images7.alphacoders.com/127/thumb-1920-1275132.jpg')";
}



function login() {
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    const validUsernames = ["2105001", "2105002", "2105003", "2105004", "2105005", "2105006", "2105007", "2105008", "2105009", "2105010", "2105011", "2105012", "2105013", "2105014", "2105015", "2105016", "2105017", "2105018", "2105019", "2105020", "2105021", "2105022", "2105023", "2105024", "2105025", "2105026", "2105027", "2105028", "2105029", "2105030", "2105031", "2105032", "2105033", "2105034", "2105035", "2105036", "2105037", "2105038", "2105039", "2105040", "2105041", "2105042", "2105043", "2105044", "2105045", "2105046", "2105047", "2105048", "2105049", "2105050", "2105051", "2105052", "2105053", "2105054", "2105055", "2105056", "2105057", "2105058", "2105059", "2105060", "2105061", "2105062", "2105063", "2105064", "2105065", "2105066", "2105067", "2105068", "2105069", "2105070", "2105071", "2105072", "2105073", "2105074", "2105075", "2105076", "2105077", "2105078", "2105079", "2105080", "2105081", "2105082", "2105083", "2105084", "2105085", "2105086", "2105087", "2105088", "2105089", "2105090", "2105091", "2105092", "2105093", "2105094", "2105095", "2105096", "2105097", "2105098", "2105099", "2105100","2106072"
];
    if (validUsernames.includes(username) && password === username) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("main-container").classList.remove("hidden");
        document.getElementById("user-name").innerText = username;
        showPopup();
    } else {
        showError();
    }
}





function showPopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}





function closePopup() {
    document.getElementById("popup").style.display = "none";
}





function showError() {
    document.getElementById("error-message").classList.remove("hidden");
}





function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("main-container").classList.add("hidden");
}





function showContent(type) {
    let contentDiv = document.getElementById("content");
    if (type === "movies") {
        contentDiv.innerHTML = `<h1>Watch Movies</h1>
            <p id="movie_q">Which movie do you want to watch?</p>

            <input type="text" id="movie-name" placeholder="Enter movie name">
            <button onclick="submitMovie()">Submit</button>
            <h4 id="movie_description_main">Top 10 IMDb Movies:</h4>
              
                <li id="movie_description">The Shawshank Redemption</li>
                <li id="movie_description">The Godfather</li>
                <li id="movie_description">The Dark Knight</li>
                <li id="movie_description">Pulp Fiction</li>
                <li id="movie_description">Schindler's List</li>
                <li id="movie_description">12 Angry Men</li>
                <li id="movie_description">Lord of the Rings: Return of the King</li>
                <li id="movie_description">Fight Club</li>
                <li id="movie_description">Forrest Gump</li>
                <li id="movie_description">Inception</li>`;
    } 

    else if (type === "articles") {
        contentDiv.innerHTML = `<h3>Read Articles</h3>
            <p>Coming soon! Stay tuned for interesting reads.</p>
            <marquee behavior="scroll" direction="left" scrollamount="5"  style="margin-top: 297px;font-weight:bold; font-size:18px;color:rgb(255, 0, 0);">Website is updating... Please check back soon!</marquee>`;
    }

     else if (type === "explore") {
    contentDiv.innerHTML = `<h3>Explore World</h3>

        <p><span class="place-name">01. Bandarban</span></p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/sI4H8Fnn4dw?si=1S1tgsncE21HqR1H" allowfullscreen></iframe>
        <p class='bangla'>পৃথিবী সংস্কৃতি, প্রকৃতি এবং ইতিহাসের অসংখ্য সুতোয় বোনা একটি গালিচা...</p>

        <p><span class="place-name">02. Cox's Bazar</span></p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/YPxfs_hYOnw" allowfullscreen></iframe>
        <p class='bangla'>নীল জলরাশি আর সোনালি বালির মায়ায় মোড়ানো কক্সবাজার যেন বাংলাদেশের এক স্বপ্নঘেরা সমুদ্রকাব্য।</p>

        <p><span class="place-name">03. Sylhet</span></p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/eIKXxe2DqK0" allowfullscreen></iframe>
        <p class='bangla'>সবুজ পাহাড় আর চা-বাগানের শহর সিলেট প্রকৃতির মায়াবী এক কোণ।</p>

        <p><span class="place-name">04. Nikli</span></p>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/hQJdka1r6DE" allowfullscreen></iframe>
        <p class='bangla'>নিকলী হাওর—জলের আয়নায় ভেসে থাকা আকাশ আর শান্ত প্রকৃতির নির্জন স্বর্গ।</p>`;
   }

    
    else if (type === "AET") {
        contentDiv.innerHTML = `<h3 id="AET_Course">Agricultural Engineering Courses</h3>
            <div class="box-container">
                <div class="course-box" onclick="showDriveFolder1()">Level 1 Semester 1</div>
                <div class="course-box" onclick="showDriveFolder2()">Level 1 Semester 2</div>
                <div class="course-box" onclick="showDriveFolder3()">Level 2 Semester 1</div>
                <div class="course-box" onclick="showDriveFolder4()">Level 2 Semester 2</div>
                <div class="course-box" onclick="showDriveFolder5()">Level 3 Semester 1</div>
                <div class="course-box" onclick="showDriveFolder6()">Level 3 Semester 2</div>
            </div>
            <div id="drive-folder" class="hidden"></div>`;
    }

}



function showDriveFolder1() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1KnVbNU1DQbT5iZabjggqdH3WbU5gGfjF" target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 1 Semester 1 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}
function showDriveFolder2() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1Tko3rK5qUpkzzmvhN1tUdOJcwwFA2huN"target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 1 Semester 2 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}
function showDriveFolder3() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1M4-YeVeRfMLY5pgOyZoJp6RQQhVLJwhB"target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 2 Semester 1 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}
function showDriveFolder4() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1TUNRU-Plhc32I6DmCMPX43a7eReHdD5T"target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 2 Semester 2 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}
function showDriveFolder5() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1ymTtK0-XdlROqKB7AXN7GhKjMtkxoGVe"target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 3 Semester 1 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}

function showDriveFolder6() {
    let folderDiv = document.getElementById("drive-folder");
    folderDiv.innerHTML = `<a href="https://drive.google.com/drive/folders/1m0EeorXocw9KwH65xQSH3FvV6IRlLeM5"target="_blank" style="color: yellow;font-weight:bold;font-size:20px">
                Open Level 3 Semester 2 Folder
            </a>`;
    folderDiv.classList.remove("hidden");
}






function submitMovie() {
    let movieName = document.getElementById("movie-name").value.trim();
    if (movieName) {
        let mailtoLink = `mailto:deboneel1998@gmail.com?subject=Movie Request&body=I want to watch: ${movieName}`;
        window.location.href = mailtoLink;
        alert("Your request has been sent!");
    } else {
        alert("Please enter a movie name.");
    }
}






document.getElementById("password").addEventListener("keydown", function (event) {
    if (event.key === "Enter") login();
});







document.getElementById("username").addEventListener("keydown", function (event) {
    if (event.key === "Enter") login();
});

document.getElementById("toggle-about").addEventListener("click", function () {
  const about = document.getElementById("about-section");
  if (about.style.display === "none") {
    about.style.display = "block";
  } else {
    about.style.display = "none";
  }
});

// Clock update function
function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  const seconds = now.getSeconds().toString().padStart(2,'0');
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock(); // initialize immediately

// Nebula-like RGB light floating between corners
const nebula = document.getElementById('nebulaLight');

const corners = [
  {top: 20, left: 20},                                         // top-left
  {top: 20, left: window.innerWidth - 140},                   // top-right (120px + 20px margin)
  {top: window.innerHeight - 140, left: window.innerWidth - 140}, // bottom-right
  {top: window.innerHeight - 140, left: 20}                   // bottom-left
];

let idx = 0;

function moveNebula() {
  const pos = corners[idx];
  nebula.style.top = pos.top + 'px';
  nebula.style.left = pos.left + 'px';

  idx = (idx + 1) % corners.length;

  setTimeout(moveNebula, 4000); // move every 4 seconds smoothly
}

moveNebula();

window.addEventListener('resize', () => {
  corners[1].left = window.innerWidth - 140;
  corners[2].top = window.innerHeight - 140;
  corners[2].left = window.innerWidth - 140;
  corners[3].top = window.innerHeight - 140;
});


