var recipesMap = new Map;

document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
       getFavouriteRecipes() 
    ])
    .then(_ => {
        updateFavoritesGrid();
        initEventHandlers();
    });
});

async function getFavouriteRecipes() {
    var response = await fetch('scripts/get_recipes.php', { method: 'GET' });
    var recipes = await response.json();

    recipes.forEach(recipe => {
        var recipeMap = new Map();
        
        var recipeTime = '';
        if (Math.floor(recipe.time / 60) != 0) {
            recipeTime = Math.floor(recipe.time / 60) + ' ч. '
        }
        
        if ((recipe.time % 60) != 0) {
            recipeTime += (recipe.time % 60) + ' мин.';
        }

        recipeMap.set('time', recipeTime);
        recipeMap.set('title', recipe.title);
        recipeMap.set('image', recipe.image);
        recipeMap.set('rating', Math.round(recipe.rating * 100) / 100);
        recipeMap.set('calories', recipe.calories + ' ккал.');
        recipeMap.set('category', recipe.category);
        recipeMap.set('cuisine', recipe.cuisine);
        recipeMap.set('favourite', recipe.favourite);
        recipeMap.set('description', recipe.description);

        recipesMap.set(recipe.id, recipeMap);
    });
}

function updateFavoritesGrid() {
    const emptyFavorites = document.getElementById('emptyFavorites');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoriteCardTemplate = document.getElementById('favoriteCardTemplate');
    
    favoritesGrid.innerHTML = '';

    if (emptyFavorites)
        if (recipesMap.size === 0) {
            emptyFavorites.classList.add('active');
            return;
        }
        else
            emptyFavorites.classList.remove('active');
    
    recipesMap.forEach(function(recipe, id, _) {
        const favoriteCard = favoriteCardTemplate.content.cloneNode(true);
        const cardElement = favoriteCard.querySelector('.favorite-card');
        const favoriteImage = favoriteCard.querySelector('.favorite-image img');
        const favoriteCategory = favoriteCard.querySelector('.favorite-category');
        const favoriteTitle = favoriteCard.querySelector('.favorite-title');
        const favoriteDescription = favoriteCard.querySelector('.favorite-description');
        const favoriteTime = favoriteCard.querySelector('.favorite-stats .favorite-stat:nth-child(1) span');
        const favoriteCalories = favoriteCard.querySelector('.favorite-stats .favorite-stat:nth-child(2) span');
        const favoriteRating = favoriteCard.querySelector('.favorite-stats .favorite-stat:nth-child(3) span');
        const removeBtn = favoriteCard.querySelector('.favorite-remove');
        
        cardElement.dataset.id = id;
        favoriteImage.src = recipe.get('image');
        favoriteImage.alt = recipe.get('title');
        favoriteCategory.textContent = recipe.get('category');
        favoriteTitle.textContent = recipe.get('title');
        favoriteDescription.textContent = recipe.get('description');
        favoriteTime.textContent = recipe.get('time');
        favoriteCalories.textContent = recipe.get('calories');
        favoriteRating.textContent = recipe.get('rating');

        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            removeFromFavorites(id);
        });
        
        cardElement.addEventListener('click', function() {
            openRecipeModal(id, recipe);
        });
        
        favoritesGrid.appendChild(favoriteCard);
    });
}

function initEventHandlers() {
    const recipeModal = document.getElementById('recipeModal');
    const closeModal = document.getElementById('closeModal');
    const removeFavoriteBtn = document.getElementById('removeFavoriteBtn');
    const viewFullBtn = document.querySelector('.action-btn.view-full');
    
    if (closeModal) {
        closeModal.addEventListener('click', closeRecipeModal);
    }
    
    if (recipeModal) {
        recipeModal.addEventListener('click', function(e) {
            if (e.target === recipeModal) {
                closeRecipeModal();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeRecipeModal();
        }
    });
    
    if (removeFavoriteBtn) {
        removeFavoriteBtn.addEventListener('click', function() {
            const recipeId = document.getElementById('recipeModal').dataset.id;

            if (recipeId) {
                removeFromFavorites(recipeId, true);
            }
        });
    }
    
    if (viewFullBtn) {
        viewFullBtn.addEventListener('click', function() {
            const recipeID = document.getElementById('recipeModal').dataset.id;

            window.open(`http://localhost:4000/recipe_steps/recipe_steps.html?recipeID=${recipeID}`, '_self');
        });
    }
}

function openRecipeModal(id, recipe) {
    const modal = document.getElementById('recipeModal');
    const modalTitle = document.getElementById('modalRecipeTitle');
    const modalImage = document.getElementById('modalRecipeImage');
    const modalTime = document.getElementById('modalRecipeTime');
    const modalCalories = document.getElementById('modalRecipeCalories');
    const modalRating = document.getElementById('modalRecipeRating');
    const modalDescription = document.getElementById('modalRecipeDescription');
    
    modalTitle.textContent = recipe.get('title');
    modalImage.src = recipe.get('image');
    modalImage.alt = recipe.get('title');
    modalTime.textContent = recipe.get('time');
    modalCalories.textContent = recipe.get('calories');
    modalRating.textContent = recipe.get('rating');
    modalDescription.textContent = recipe.get('description');
    
    modal.dataset.id = id;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function removeFromFavorites(recipeID, closeModal = false) {
    const formData = new FormData();
    formData.append('recipeID', recipeID);

    fetch('scripts/delete_favourite.php', { method: 'POST', body: formData })
    .then(response => response.json())
    .then(_ => {
        recipesMap.delete(parseInt(recipeID));

        if (closeModal)
            closeRecipeModal();

        updateFavoritesGrid();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .favorite-card {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
});