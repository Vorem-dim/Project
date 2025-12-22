// Данные рецепта (в реальном приложении получаются с сервера)
const recipeData = {
    id: 0,
    title: "",
    description: "",
    image: "",
    time: "",
    calories: "",
    rating: 0,
    cuisine: "",
    category: "",
    ingredients: [],
    steps: []
};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeID = urlParams.get('recipeID');

    Promise.all([
        getRecipe(recipeID),
        getIngredients(recipeID),
        getSteps(recipeID)
    ])
    .then(_ => {
        populateRecipeData();
        generateIngredients();
        generateSteps();
        initEventHandlers();    
    })
});

async function getRecipe(recipeID) {
    const formData = new FormData();
    formData.append('id', recipeID);

    var response = await fetch('scripts/get_recipe.php', { method: 'POST', body: formData });
    var recipes = await response.json();

    var recipeTime = '';
    if (Math.floor(recipes.time / 60) != 0) {
        recipeTime = Math.floor(recipes.time / 60) + ' ч. '
    }
    
    if ((recipes.time % 60) != 0) {
        recipeTime += (recipes.time % 60) + ' мин.';
    }

    recipeData.id = recipes.id;
    recipeData.title = recipes.title;
    recipeData.description = recipes.description;
    recipeData.image = recipes.image;
    recipeData.time = recipeTime;
    recipeData.calories = recipes.calories + ' ккал';
    recipeData.rating = Math.round(recipes.rating * 100) / 100;
    recipeData.cuisine = recipes.cuisine;
    recipeData.category = recipes.category;
}

async function getIngredients(recipeID) {
    const formData = new FormData();
    formData.append('id', recipeID);

    var response = await fetch('scripts/get_ingredients.php', { method: 'POST', body: formData });
    var ingredients = await response.json();

    ingredients.forEach(ingredient => {
        recipeData.ingredients.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            image: ingredient.image
        });
    });
}

async function getSteps(recipeID) {
    const formData = new FormData();
    formData.append('id', recipeID);

    var response = await fetch('scripts/get_steps.php', { method: 'POST', body: formData });
    var steps = await response.json();

    index = 0;
    steps.forEach(step => {
        index++;
        
        recipeData.steps.push({number: index, description: step.description});
    });
}

function populateRecipeData() {
    document.getElementById('recipeTitle').textContent = recipeData.title;
    document.getElementById('recipeTime').textContent = recipeData.time;
    document.getElementById('recipeCalories').textContent = recipeData.calories;
    document.getElementById('recipeRating').textContent = recipeData.rating;
    document.getElementById('recipeDescription').textContent = recipeData.description;
    document.getElementById('recipeCuisine').textContent = recipeData.cuisine;
    document.getElementById('recipeCategory').textContent = recipeData.category;
    
    const recipeImage = document.getElementById('recipeImage');
    recipeImage.src = recipeData.image;
    recipeImage.alt = recipeData.title;
}

// Генерация списка ингредиентов
function generateIngredients() {
    const ingredientsList = document.getElementById('ingredientsList');
    const ingredientTemplate = document.getElementById('ingredientTemplate');
    
    recipeData.ingredients.forEach(ingredient => {
        const ingredientElement = ingredientTemplate.content.cloneNode(true);
        const ingredientImage = ingredientElement.querySelector('.ingredient-image img');
        const ingredientName = ingredientElement.querySelector('.ingredient-name');
        const ingredientQuantity = ingredientElement.querySelector('.quantity');
        const ingredientUnit = ingredientElement.querySelector('.unit');
        
        ingredientImage.src = ingredient.image;
        ingredientImage.alt = ingredient.name;
        ingredientName.textContent = ingredient.name;
        ingredientQuantity.textContent = ingredient.quantity;
        ingredientUnit.textContent = ingredient.unit;
        
        ingredientsList.appendChild(ingredientElement);
    });
}

// Генерация списка шагов приготовления
function generateSteps() {
    const stepsList = document.getElementById('stepsList');
    const stepTemplate = document.getElementById('stepTemplate');
    
    recipeData.steps.forEach(step => {
        const stepElement = stepTemplate.content.cloneNode(true);
        const stepNumber = stepElement.querySelector('.step-number span');
        const stepDescription = stepElement.querySelector('.step-description');
        
        stepNumber.textContent = step.number;
        stepDescription.textContent = step.description;
        
        stepsList.appendChild(stepElement);
    });
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Кнопка печати
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Кнопка добавления в избранное
    const favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('active');
                alert('Рецепт добавлен в избранное!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('active');
                alert('Рецепт удален из избранного!');
            }
        });
    }
    
    // Кнопка поделиться
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: recipeData.title,
                    text: `Попробуйте рецепт "${recipeData.title}" на Кулинарной книге`,
                    url: window.location.href,
                })
                .then(() => console.log('Успешный шаринг'))
                .catch((error) => console.log('Ошибка шаринга', error));
            } else {
                // Для браузеров без поддержки Web Share API
                const shareUrl = window.location.href;
                navigator.clipboard.writeText(shareUrl)
                    .then(() => {
                        alert('Ссылка на рецепт скопирована в буфер обмена!');
                    })
                    .catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
            }
        });
    }
    
    // Кнопка оставить отзыв
    const reviewBtn = document.getElementById('reviewBtn');
    if (reviewBtn) {
        reviewBtn.addEventListener('click', function() {
            alert('В реальном приложении здесь будет открыта форма для оставления отзыва.');
        });
    }
    
    // Сворачивание/разворачивание секций
    const toggleIngredientsBtn = document.getElementById('toggleIngredients');
    const toggleStepsBtn = document.getElementById('toggleSteps');
    const ingredientsList = document.getElementById('ingredientsList');
    const stepsList = document.getElementById('stepsList');
    
    if (toggleIngredientsBtn && ingredientsList) {
        toggleIngredientsBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (ingredientsList.style.maxHeight) {
                ingredientsList.style.maxHeight = null;
            } else {
                ingredientsList.style.maxHeight = ingredientsList.scrollHeight + 'px';
            }
        });
    }
    
    if (toggleStepsBtn && stepsList) {
        toggleStepsBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (stepsList.style.maxHeight) {
                stepsList.style.maxHeight = null;
            } else {
                stepsList.style.maxHeight = stepsList.scrollHeight + 'px';
            }
        });
    }
}