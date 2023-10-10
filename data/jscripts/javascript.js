const thumbnailImg = document.getElementById('avatarImg');

const MawProfileEndPoint = 'https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=61479864&size=420x420&format=Png&isCircular=true';

const ValueDisplays = document.querySelectorAll(".Row-Content-Number");
const TotalPlaceVisit = document.querySelectorAll(".Row-Content-Number")[2];

const Hamburger = document.querySelector(".Hamburger");
const Navbar = document.querySelector(".Navbar");

const ContributeExperiences = [3297964905, 6853377206, 2321907138, 4747388345, 10205046075];

let PlaceVisit = 0;

Hamburger.onclick = function() {
    Navbar.classList.toggle("Active")    
}

function lerp(start, end, t) {
    return (1 - t) * start + t * end
}  

async function FetchPlaceVisit(PlaceId) {
    try {
        const response = await fetch(`https://apis.roproxy.com/universes/v1/places/${PlaceId}/universe`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const UniverseId = data.universeId;

        const placedataResponse = await fetch(`https://games.roproxy.com/v1/games?universeIds=${UniverseId}`);
        if (!placedataResponse.ok) {
            throw new Error('Network response was not ok');
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
        PlaceVisit += await FetchPlaceVisit(value);
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
        const actualdata = data.data[0]
        const imageUrl = actualdata.imageUrl;

        thumbnailImg.src = imageUrl;
    })
    
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


ValueDisplays.forEach((ValueDisplay) => {
    ValueDisplay.textContent = "Awaiting"
})
     
calculatePlaceVisits();
setTimeout(() => {
    document.querySelector(".TotalExperience").textContent = ContributeExperiences.length;
    TotalPlaceVisit.setAttribute("data-val", PlaceVisit);
    ValueDisplays.forEach((ValueDisplay) => {
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

        /*let Counter = setInterval(function() {
            Init += 1;
            ValueDisplays.textContent = Init.toLocaleString();
            if (Init == EndVal) {
                clearInterval(Counter);
            }
        }, Duration)*/
    })
}, 10000)