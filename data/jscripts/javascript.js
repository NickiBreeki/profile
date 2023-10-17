const thumbnailImg = document.getElementById('avatarImg');

const ValueDisplays = document.querySelectorAll(".Row-Content-Number");
const SkillProgressions = document.querySelectorAll('.Skill-Progression');
const TotalPlaceVisit = document.querySelectorAll(".Row-Content-Number")[2];

const Hamburger = document.querySelector(".Hamburger");
const Navbar = document.querySelector(".Navbar");
const Age = document.querySelector(".Age");

const ContributeExperiences = [3297964905, 6853377206, 2321907138, 4747388345, 10205046075];

const PastworkAnimationsContainer = document.querySelector('.PW-Animations-Container');
const PastworkScriptsContainer = document.querySelector('.PW-Scripts-Container');

const Calender = new Date();

const de_lawn_mawer = './/.//resources/images/themaw.png'
let ProfileThumbnail

const MawProfileEndPoint = 'https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=61479864&size=420x420&format=Png&isCircular=true';

const Animations_videoSources = [
    'https://cdn.discordapp.com/attachments/787746152971239434/1160422183965831280/0001-0176_1.mp4',
    'https://cdn.discordapp.com/attachments/628090640260923423/1161933275615465566/0001-0060.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161936019139072040/555twitter.com_1697097508172.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161936019629809694/555twitter.com_1697097517095.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161934439757123644/555twitter.com_1697097100072.mp4',
    'https://cdn.discordapp.com/attachments/734110004172423178/1123404920108896276/0001-0088.mp4',
    'https://cdn.discordapp.com/attachments/1021322240693911602/1121554900422234333/0000-0106.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161935330220445736/555twitter.com_1697097336648.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161935330631483503/555twitter.com_1697097353766.mp4'
];

const Scripts_videoSources = [
    'https://cdn.discordapp.com/attachments/474541277807902720/1113526927706304623/2023-06-01_00-53-03.mp4',
    'https://cdn.discordapp.com/attachments/787746152971239434/1115581106817863792/2023-06-06_16-55-43.mp4',
    'https://cdn.discordapp.com/attachments/1158071468895256678/1158089880639901767/PK2Progress.mp4',
    'https://cdn.discordapp.com/attachments/1140521822127931445/1160388777710211173/2023-09-22_11-48-49.mp4',
    'https://cdn.discordapp.com/attachments/1161934285876514866/1161941521625526312/555twitter.com_1697098809805.mp4'
];

let PlaceVisit = 0;
let CurrentAge = 0
let CurrentTick = performance.now();

CurrentAge = (2005 - Calender.getFullYear());

Hamburger.onclick = function() {
    Navbar.classList.toggle("Active");
};

function lerp(start, end, t) {
    return (1 - t) * start + t * end;
}

async function FetchPlaceVisit(PlaceId) {
    try {
        const response = await fetch(`https://apis.roproxy.com/universes/v1/places/${PlaceId}/universe`);
        if (!response.ok) {
            throw new Error('FAILED TO GET UNIVERSE: Network response was not ok');
        }
        const data = await response.json();
        const UniverseId = data.universeId;

        const placedataResponse = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UniverseId}`);
        if (!placedataResponse.ok) {
            throw new Error('FAILED TO GET UNIVERSE DETAILS: Network response was not ok');
        }
        const placedata = await placedataResponse.json();
        const actualdata = placedata.data[0];
        const visits = actualdata.visits;

        return visits;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return 0; // Return a default value in case of an error
    }
}

async function calculatePlaceVisits() {
    for (const value of ContributeExperiences) {
        const newtick = (CurrentTick - performance.now());
        PlaceVisit += await FetchPlaceVisit(value);
        CurrentTick += newtick;
    }
}

fetch(MawProfileEndPoint)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const actualdata = data.data[0];
        const imageUrl = actualdata.imageUrl;
        thumbnailImg.src = imageUrl;
        ProfileThumbnail = imageUrl
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

ValueDisplays.forEach((ValueDisplay) => {
    ValueDisplay.textContent = "Awaiting";
});

SkillProgressions.forEach((SkillProgression) => {
    SkillProgression.style.setProperty('--progress-percentage', SkillProgression.getAttribute("per"));
});

document.querySelectorAll(".Navbar a").forEach((aElement) => {
    const id = aElement.id;
    const element = document.getElementById(id);

    element.onclick = function() {
        NavBarFocus(id)
    };
});

function NavBarFocus(ButtonId) {
    document.querySelectorAll(".Navbar a").forEach((aElement) => {
        const id = aElement.id;
        const element = document.getElementById(id);

        if (id === ButtonId) {
            element.classList.add("Active");
        } else {
            element.classList.remove("Active");
        }
    });
}

window.addEventListener('hashchange', function () {
    const hash = window.location.hash.substring(1);

    // Hide all page content divs
    document.querySelectorAll('.page-content').forEach((content) => {
        content.style.display = 'none';
    });

    // Show the content corresponding to the hash
    const contentElement = document.getElementById(hash + '-Content');
    if (contentElement) {
        contentElement.style.display = 'block';
    }
});

window.addEventListener('load', function () {
    const hash = window.location.hash.substring(1);

    document.querySelectorAll('.page-content').forEach((content) => {
        content.style.display = 'none';
    });

    // Show the content corresponding to the hash
    const contentElement = document.getElementById(hash + '-Content');
    if (contentElement) {
        contentElement.style.display = 'block';
    }

    NavBarFocus(hash);
});

document.querySelector(".TotalExperience").textContent = ContributeExperiences.length;

async function updatePlaceVisits() {
    await calculatePlaceVisits();

    TotalPlaceVisit.setAttribute("data-val", PlaceVisit);

    for (const ValueDisplay of ValueDisplays) {
        let Init = 0;
        let EndVal = parseInt(ValueDisplay.getAttribute("data-val"));
        let t = 0;
        let duration = 100; // Duration in milliseconds

        function updateValue() {
            t += 0.01; // You can adjust the step size as needed

            if (t <= 1) {
                let Value = Math.round(lerp(Init, EndVal, t));
                ValueDisplay.textContent = Value.toLocaleString();
                requestAnimationFrame(updateValue);
            } else {
                ValueDisplay.textContent = EndVal.toLocaleString();
            }
        }

        updateValue();
    }
}

Animations_videoSources.forEach((src) => {
    const source = document.createElement('video');
    source.src = src;
    source.autoplay = true
    source.loop = true
    source.muted = true
    
    PastworkAnimationsContainer.appendChild(source);
});

Scripts_videoSources.forEach((src) => {
    const source = document.createElement('video');
    source.src = src;
    source.autoplay = true
    source.loop = true
    source.muted = true
    
    PastworkScriptsContainer.appendChild(source);
});

Age.textContent = -CurrentAge;

updatePlaceVisits();