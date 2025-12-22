document.addEventListener('DOMContentLoaded', function() {
    Promise.all([generateCuisineCards()])
    .then(_ => {
        initEventHandlers();
    });
});

async function generateCuisineCards() {
    var response = await fetch('get_cuisines.php', { method: 'GET' });
    var cuisines = await response.json();
    
    const cuisinesGrid = document.getElementById('cuisinesGrid');
    const cuisineCardTemplate = document.getElementById('cuisineCardTemplate');
    
    cuisines.forEach(cuisine => {
        const cuisineCard = cuisineCardTemplate.content.cloneNode(true);
        const cardElement = cuisineCard.querySelector('.cuisine-card');
        const cuisineImage = cuisineCard.querySelector('.cuisine-image img');
        const cuisineTitle = cuisineCard.querySelector('.cuisine-title');
        const cuisineDescription = cuisineCard.querySelector('.cuisine-description');
        
        cardElement.dataset.id = cuisine.id;
        cuisineImage.src = cuisine.icon;
        cuisineImage.alt = cuisine.name;
        cuisineTitle.textContent = cuisine.name;
        cuisineDescription.textContent = cuisine.description;
        
        cuisinesGrid.appendChild(cuisineCard);
    });
}

function initEventHandlers() {
    const cuisinesGrid = document.getElementById('cuisinesGrid');
    
    cuisinesGrid.addEventListener('click', function(e) {
        const cuisineCard = e.target.closest('.cuisine-card');
        
        if (cuisineCard) {
            const cuisineID = parseInt(cuisineCard.dataset.id);

            if (cuisineID === 0) {
                window.open(`http://localhost:4000/index.html`, '_self');
                return;
            }

            window.open(`http://localhost:4000/index.html?cuisineID=${cuisineID}`, '_self');
        }
    });
}