var recipesMap = new Map;
var user = null;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const cuisineID = urlParams.get('cuisineID');
    
    Promise.all([
        setRecipesCategories(),
        setRecipeCards(),
        startSession()
    ])
    .then(_ => {
        initEventHandlers();

        if (cuisineID != null) {
            filterRecipesByCuisine(cuisineID);
        }
    })
});

async function setRecipesCategories() {
    const searchFilters = document.getElementById('searchFilters');

    var response = await fetch('scripts/get_recipe_categories.php', { method: 'GET' });
    var categories = await response.json();

    categories.forEach(category => {
        const recipeCard = document.createElement('div');
        
        recipeCard.className = 'filter-btn';
        recipeCard.dataset.id = category.id;
        recipeCard.innerHTML = category.name;

        searchFilters.appendChild(recipeCard);
    });
}

async function setRecipeCards() {
    const recipesGrid = document.getElementById('recipesGrid');

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

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        
        var favouriteClass = (recipe.favourite) ? 'fas fa-heart' : 'far fa-heart';
        var buttonFavouriteClass = (recipe.favourite) ? 'recipe-favorite active' : 'recipe-favorite';

        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;
        recipeCard.innerHTML = `
            <div class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.title}">
                <div class="recipe-category">${recipe.category}</div>
                <button class="${buttonFavouriteClass}">
                    <i class="${favouriteClass}"></i>
                </button>
            </div>
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-meta">
                    <div class="recipe-stats">
                        <div class="recipe-stat">
                            <i class="fas fa-clock"></i>
                            <span>${recipesMap.get(recipe.id).get('time')}</span>
                        </div>
                        <div class="recipe-stat">
                            <i class="fas fa-fire"></i>
                            <span>${recipe.calories} ккал</span>
                        </div>
                        <div class="recipe-stat">
                            <i class="fas fa-star"></i>
                            <span>${recipesMap.get(recipe.id).get('rating')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        recipesGrid.appendChild(recipeCard);
    });
}

async function startSession() {
    var response = await fetch('scripts/start_user_session.php', { method: 'POST' });
    user = await response.json();
    
    if (user.role === 'guest') {
        SetGuestView();
        return;
    }               

    response = await fetch('scripts/get_user.php', { method: 'GET' });
    user = await response.json();

    switch(user.role) {
        case 'admin':
            SetAdminView(user);
            break;
        case 'chef':
            SetChefView(user);
            break;
        default:
            SetGuestView();
            break;
    }
}

function SetGuestView() {
    const userMenu = document.getElementById('userMenu');
    const userDetails = document.getElementById('userDetails');
    const userMenuOptions = document.getElementById('userMenuOptions');
    const userAvatar = document.getElementById('userAvatar');
    const userIcon = document.getElementById('userIcon');

    userMenuOptions.style.display = 'none';

    const userDetailsName = document.createElement('h4');
    userDetailsName.innerHTML = 'Гость';

    const userLogInButton = document.createElement('a');
    userLogInButton.href = 'authentication/authentication.html';
    userLogInButton.className = 'menu-item login';

    const userLogInButtonIcon = document.createElement('i');
    const userLogInButtonText = document.createElement('span');

    userLogInButtonIcon.className = 'fas fa-sign-in-alt';
    userLogInButtonText.innerHTML = 'Войти';

    const guestIcon = document.createElement('i');
    guestIcon.className = 'fas fa-user';

    const guestAvatar = document.createElement('i');
    guestAvatar.className = 'fas fa-user-circle';

    userLogInButton.appendChild(userLogInButtonIcon);
    userLogInButton.appendChild(userLogInButtonText);

    userDetails.appendChild(userDetailsName);
    userMenu.appendChild(userLogInButton);

    userAvatar.appendChild(guestAvatar);
    userIcon.appendChild(guestIcon);
}

function SetChefView(user) {
    const userMenu = document.getElementById('userMenu');
    const userDetails = document.getElementById('userDetails');
    const userAvatar = document.getElementById('userAvatar');
    const userIcon = document.getElementById('userIcon');

    const userDetailsName = document.createElement('h4');
    userDetailsName.innerHTML = user.first_name + ' ' + user.last_name;
    const userDetailsRole = document.createElement('p');
    userDetailsRole.innerHTML = 'Повар';

    const userLogOutButton = document.createElement('a');
    userLogOutButton.href = 'authentication/authentication.html';
    userLogOutButton.className = 'menu-item logout';

    const userLogOutButtonIcon = document.createElement('i');
    const userLogOutButtonText = document.createElement('span');

    userLogOutButtonIcon.className = 'fas fa-sign-out-alt';
    userLogOutButtonText.innerHTML = 'Выйти';
    
    const chefIcon = document.createElement('img');
    chefIcon.className = 'user-image';
    chefIcon.src = user.icon;
    chefIcon.alt = 'Chef';

    const chefAvatar = document.createElement('img');
    chefAvatar.className = 'user-image';
    chefAvatar.src = user.icon;

    userLogOutButton.appendChild(userLogOutButtonIcon);
    userLogOutButton.appendChild(userLogOutButtonText);

    userDetails.appendChild(userDetailsName);
    userDetails.appendChild(userDetailsRole);
    userMenu.appendChild(userLogOutButton);

    userAvatar.appendChild(chefAvatar);
    userIcon.appendChild(chefIcon);
}

function SetAdminView(user) {
    const userMenu = document.getElementById('userMenu');
    const userDetails = document.getElementById('userDetails');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const userAvatar = document.getElementById('userAvatar');
    const userIcon = document.getElementById('userIcon');

    addRecipeBtn.style.display = 'flex';

    const userDetailsName = document.createElement('h4');
    userDetailsName.innerHTML = user.first_name + ' ' + user.last_name;
    const userDetailsRole = document.createElement('p');
    userDetailsRole.innerHTML = 'Администратор';

    const userLogOutButton = document.createElement('a');
    userLogOutButton.href = 'authentication/authentication.html';
    userLogOutButton.className = 'menu-item logout';

    const userLogOutButtonIcon = document.createElement('i');
    const userLogOutButtonText = document.createElement('span');

    userLogOutButtonIcon.className = 'fas fa-sign-out-alt';
    userLogOutButtonText.innerHTML = 'Выйти';
    
    const adminIcon = document.createElement('img');
    adminIcon.className = 'user-image';
    adminIcon.src = user.icon;
    adminIcon.alt = 'Admin';

    const adminAvatar = document.createElement('img');
    adminAvatar.className = 'user-image';
    adminAvatar.src = user.icon;

    userLogOutButton.appendChild(userLogOutButtonIcon);
    userLogOutButton.appendChild(userLogOutButtonText);

    userDetails.appendChild(userDetailsName);      
    userDetails.appendChild(userDetailsRole); 
    userMenu.appendChild(userLogOutButton);

    userAvatar.appendChild(adminAvatar);
    userIcon.appendChild(adminIcon);
}

function initEventHandlers() {
    const userIcon = document.getElementById('userIcon');
    const userMenu = document.getElementById('userMenu');
    
    userIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && !userIcon.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });
    
    const recipesGrid = document.getElementById('recipesGrid');
    const recipeModal = document.getElementById('recipeModal');
    const closeModal = document.getElementById('closeModal');
    
    recipesGrid.addEventListener('click', function(e) {
        const recipeCard = e.target.closest('.recipe-card');
        const favoriteBtn = e.target.closest('.recipe-favorite');
        
        if (recipeCard && !favoriteBtn) {
            const recipeId = parseInt(recipeCard.dataset.id);
            const recipe = recipesMap.get(recipeId);
            
            if (recipe) {
                openRecipeModal(recipeId);
            }
        }

        if (favoriteBtn) {
            e.stopPropagation();

            if (user.role === 'guest') {
                var confirmAuth = confirm('Для добавления в избранное необходимо авторизоваться. Перейти на страницу авторизации?');

                if (confirmAuth)
                    window.open('http://localhost:4000/authentication/authentication.html', '_self');
            }
            else {
                addFavorite(favoriteBtn, Number(favoriteBtn.parentElement.parentElement.dataset.id));
            }
        }
    });
    
    closeModal.addEventListener('click', function() {
        closeRecipeModal();
    });
    
    recipeModal.addEventListener('click', function(e) {
        if (e.target === recipeModal) {
            closeRecipeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeRecipeModal();
        }
    });

    const closeReviewModalBtn = document.getElementById('closeReviewModal');
    const cancelReviewBtn = document.getElementById('cancelReview');
    const reviewModal = document.getElementById('reviewModal');
    
    if (closeReviewModalBtn) {
        closeReviewModalBtn.addEventListener('click', closeReviewModal);
    }
    
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', closeReviewModal);
    }

    if (reviewModal) {
        reviewModal.addEventListener('click', function(e) {
            if (e.target === reviewModal) {
                closeReviewModal();
            }
        });
    }

    const stars = document.querySelectorAll('.stars-container i');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            selectedRating = rating;
            updateStars(rating);
            updateSelectedRatingText(rating);
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            updateStars(selectedRating);
        });
    });

    const submitReviewBtn = document.getElementById('submitReview');
    const reviewComment = document.getElementById('reviewComment');
    
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', function() {
            submitReview();
        });
    }
    
    if (reviewComment) {
        reviewComment.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                submitReview();
            }
        });
    }
    
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            
            this.classList.add('active');
            
            const category = this.textContent;
            filterRecipesByCategory(category);
        });
    });
    
    const addRecipeBtn = document.querySelector('.add-recipe-btn');
    addRecipeBtn.addEventListener('click', function() {
        window.open('http://localhost:4000/new_recipe/new_recipe.html', '_self');
    });

    const cuisineBtn = document.querySelector('.cuisine-recipe-btn');
    cuisineBtn.addEventListener('click', function() {
        window.open('http://localhost:4000/cuisines/cuisines.html', '_self');
    });

    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList[1];
            
            switch(action) {
                case 'favorite':
                    if (user.role === 'guest') {
                        var confirmAuth = confirm('Для добавления в избранное необходимо авторизоваться. Перейти на страницу авторизации?');

                        if (confirmAuth)
                            window.open('http://localhost:4000/authentication/authentication.html', '_self');
                    }
                    else {
                        addFavorite(this, Number(this.parentElement.parentElement.parentElement.parentElement.parentElement.dataset.id));
                    }
                    break;
                case 'feedback':
                    if (user.role === 'guest') {
                        var confirmAuth = confirm('Для оставления отзыва необходимо авторизоваться. Перейти на страницу авторизации?');

                        if (confirmAuth)
                            window.open('http://localhost:4000/authentication/authentication.html', '_self');
                    }
                    else {
                        openReviewModal();
                    }
                    break;
                case 'recipe-steps':
                    var recipeID = document.getElementById('recipeModal').dataset.id;

                    window.open(`http://localhost:4000/recipe_steps/recipe_steps.html?recipeID=${recipeID}`, '_self');    
            }
        });
    });
}

function openReviewModal() {
    const reviewModal = document.getElementById('reviewModal');
    const reviewRecipeTitle = document.getElementById('reviewRecipeTitle');
    const recipeModalTitle = document.getElementById('modalRecipeTitle');
    
    reviewRecipeTitle.textContent = recipeModalTitle.textContent;
    
    const submitReviewBtn = document.getElementById('submitReview');
    const reviewComment = document.getElementById('reviewComment');
    const reviewCommentError = document.getElementById('reviewComment-error');

    updateStars(0);
    updateSelectedRatingText(0);
    reviewComment.value = '';
    reviewCommentError.textContent = '';

    if (submitReviewBtn) {
        submitReviewBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить отзыв';
        submitReviewBtn.disabled = false;
    }
    
    reviewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    const reviewModal = document.getElementById('reviewModal');
    reviewModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function submitReview() {    
    const comment = reviewComment.value.trim();
    const recipeModal = document.getElementById('recipeModal');
    const submitReviewBtn = document.getElementById('submitReview');
    const selectedRatingElement = document.getElementById('selectedRating');

    var selectedRating = parseInt(selectedRatingElement.textContent);
    
    if (selectedRating === 0) {
        alert('Пожалуйста, поставьте оценку, выбрав количество звезд');
        return;
    }
    
    submitReviewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitReviewBtn.disabled = true;

    const formData = new FormData();
    formData.append('recipeID', parseInt(recipeModal.dataset.id));
    formData.append('userID', user.id);
    formData.append('rating', selectedRating);
    formData.append('comment', comment);

    var response = await fetch('scripts/add_review.php', { method: 'POST', body: formData });
    var data = await response.json();

    submitReviewBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить отзыв';;
    submitReviewBtn.disabled = false;

    if (data.result)
        closeReviewModal();
    else
        alert('Не удалось отправить отзыв');
}

function updateStars(rating) {
    const stars = document.querySelectorAll('.stars-container i');
    
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.stars-container i');

    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        
        if (starRating <= rating) {
            star.classList.add('hover');
        } else {
            star.classList.remove('hover');
        }
    });
}

function updateSelectedRatingText(rating) {
    const selectedRatingElement = document.getElementById('selectedRating');
    
    if (selectedRatingElement) {
        selectedRatingElement.textContent = rating;
    }
}

function openRecipeModal(recipeId) {
    const modal = document.getElementById('recipeModal');
    const modalTitle = document.getElementById('modalRecipeTitle');
    const modalImage = document.getElementById('modalRecipeImage');
    const modalTime = document.getElementById('modalRecipeTime');
    const modalCalories = document.getElementById('modalRecipeCalories');
    const modalRating = document.getElementById('modalRecipeRating');
    const modalDescription = document.getElementById('modalRecipeDescription');
    
    const recipe = recipesMap.get(recipeId);

    modalTitle.textContent = recipe.get('title');
    modalImage.src = recipe.get('image');
    modalImage.alt = recipe.get('title');
    modalTime.textContent = recipe.get('time');
    modalCalories.textContent = recipe.get('calories');
    modalRating.textContent = recipe.get('rating');
    modalDescription.textContent = recipe.get('description');

    const actionBtns = modal.querySelectorAll('.action-btn');
    actionBtns.forEach(actionBtn => {
        const action = actionBtn.classList[1];

        switch(action) {
            case 'favorite':
                if (recipe.get('favourite')) {
                    iconHeart = actionBtn.querySelector('.fa-heart');
                    iconHeart.classList.remove('far');
                    iconHeart.classList.add('fas');
                    
                    actionBtn.classList.add('active');  
                }
                else {
                    iconHeart = actionBtn.querySelector('.fa-heart');
                    iconHeart.classList.remove('fas');
                    iconHeart.classList.add('far');
                    
                    actionBtn.classList.remove('active');
                }
                break;
            case 'feedback':
                break;
        }
    })
    
    modal.dataset.id = recipeId;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';

    const recipesGrid = document.getElementById('recipesGrid');
    const recipeCards = recipesGrid.querySelectorAll('.recipe-card');

    recipeCards.forEach(recipeCard => {
        if (recipeCard.dataset.id === modal.dataset.id) {
            var isFavourite = recipesMap.get(Number(recipeCard.dataset.id)).get('favourite');
            
            var iconFavorite = recipeCard.querySelector('.fa-heart');
            var buttonFavorite = recipeCard.querySelector('.recipe-favorite');

            if (isFavourite) {
                iconFavorite.classList.remove('far');
                iconFavorite.classList.add('fas');
                buttonFavorite.classList.add('active');    
            }
            else {
                iconFavorite.classList.remove('fas');
                iconFavorite.classList.add('far');
                buttonFavorite.classList.remove('active');
            }
        }
    })
}

function addFavorite(button, recipeID) {
    const icon = button.querySelector('i');

    const formData = new FormData();
    formData.append('userID', user.id);
    formData.append('recipeID', recipeID);
    
    if (icon.classList.contains('far')) {
        var responsePromise = fetch('scripts/add_favourite.php', { method: 'POST', body: formData });

        responsePromise.then(response => response.json()).then(data => {
            if (data.result) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                button.classList.add('active');
            }

            recipesMap.get(recipeID).set('favourite', true);
        });
    } else {
        var responsePromise = fetch('scripts/delete_favourite.php', { method: 'POST', body: formData });

        responsePromise.then(response => response.json()).then(data => {
            if (data.result) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                button.classList.remove('active');
            }

            recipesMap.get(recipeID).set('favourite', false);
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '')
        return;
    
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        const recipeCategory = card.querySelector('.recipe-title').textContent.toLowerCase();
        
        if (recipeCategory.includes(searchTerm))
            card.style.display = 'block';
        else
            card.style.display = 'none';
    })

    searchInput.value = '';
}

function filterRecipesByCategory(category) {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        const recipeCategory = card.querySelector('.recipe-category').textContent;
        
        if (category === 'Все' || recipeCategory === category)
            card.style.display = 'block';
        else
            card.style.display = 'none';
    });
}

function filterRecipesByCuisine(cuisine) {
    const recipeCards = document.querySelectorAll('.recipe-card');

    recipeCards.forEach(card => {
        const recipeCuisine = recipesMap.get(parseInt(card.dataset.id)).get('cuisine');

        if (recipeCuisine === parseInt(cuisine))
            card.style.display = 'block';
        else
            card.style.display = 'none';
    });
}