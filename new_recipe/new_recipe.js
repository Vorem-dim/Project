document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        addCuisines(),
        addCategories()
    ])
    .then(_ => {
        initEventHandlers();
    })
});

async function addCuisines() {
    var response = await fetch('scripts/get_cuisines.php', { method: 'GET' });
    var cuisines = await response.json();

    const cuisineNameSelect = document.getElementById('cuisineName');

    cuisines.forEach(cuisine => { 
        const cuisineOption = document.createElement('option');
        cuisineOption.value = cuisine.name;
        cuisineOption.innerHTML = cuisine.name;

        cuisineNameSelect.appendChild(cuisineOption);
    });
}

async function addCategories() {
    var response = await fetch('scripts/get_categories.php', { method: 'GET' });
    var categories = await response.json();

    const categoryNameSelect = document.getElementById('categoryName');

    categories.forEach(category => {
        const categoryOption = document.createElement('option');
        categoryOption.value = category.name;
        categoryOption.innerHTML = category.name;

        categoryNameSelect.appendChild(categoryOption);
    });
}

function initEventHandlers() {
    let stepsCount = 0;
    let ingredientsCount = 0;
    
    function updateCounters() {
        document.getElementById('stepsCounter').textContent = `Добавлено шагов: ${stepsCount}`;
        document.getElementById('ingredientsCounter').textContent = `Добавлено ингредиентов: ${ingredientsCount}`;
    }

    const newCuisineCheckbox = document.getElementById('newCuisine');
    const cuisineFields = document.getElementById('cuisineFields');
    const cuisineNameSelect = document.getElementById('cuisineName');

    if (newCuisineCheckbox && cuisineFields) {
        newCuisineCheckbox.addEventListener('change', function() {
            if (this.checked) {
                cuisineFields.classList.add('active');
                
                const cuisineNameContainer = cuisineNameSelect.parentNode;
                const newInput = document.createElement('input');
                
                newInput.type = 'text';
                newInput.id = 'cuisineName';
                newInput.name = 'cuisineName';
                newInput.placeholder = 'Введите название новой кухни';
                newInput.required = true;
                newInput.className = cuisineNameSelect.className;
                
                cuisineNameContainer.replaceChild(newInput, cuisineNameSelect);
            } else {
                cuisineFields.classList.remove('active');
                
                if (!cuisineNameSelect.parentNode) {
                    const container = document.querySelector('#cuisineName').parentNode;
                    container.replaceChild(cuisineNameSelect, document.getElementById('cuisineName'));
                }
            }
        });
    }
    
    const newCategoryCheckbox = document.getElementById('newCategory');
    const categoryFields = document.getElementById('categoryFields');
    const categoryNameSelect = document.getElementById('categoryName');
    
    if (newCategoryCheckbox && categoryFields) {
        newCategoryCheckbox.addEventListener('change', function() {
            if (this.checked) {
                categoryFields.classList.add('active');
                
                const categoryNameContainer = categoryNameSelect.parentNode;
                const newInput = document.createElement('input');
                
                newInput.type = 'text';
                newInput.id = 'categoryName';
                newInput.name = 'categoryName';
                newInput.placeholder = 'Введите название новой категории';
                newInput.required = true;
                newInput.className = categoryNameSelect.className;
                
                categoryNameContainer.replaceChild(newInput, categoryNameSelect);
            } else {
                categoryFields.classList.remove('active');
                
                if (!categoryNameSelect.parentNode) {
                    const container = document.querySelector('#categoryName').parentNode;
                    container.replaceChild(categoryNameSelect, document.getElementById('categoryName'));
                }
            }
        });
    }
    
    const addStepBtn = document.getElementById('addStepBtn');
    const stepsTableBody = document.getElementById('stepsTableBody');
    const stepRowTemplate = document.getElementById('stepRowTemplate');
    
    if (addStepBtn && stepsTableBody && stepRowTemplate) {
        addStepBtn.addEventListener('click', function() {
            addStepRow();
        });
    }
    
    function addStepRow() {
        stepsCount++;
        const stepRow = stepRowTemplate.content.cloneNode(true);
        const stepNumberCell = stepRow.querySelector('.step-number');
        const stepDescriptionTextarea = stepRow.querySelector('.step-description');
        const deleteBtn = stepRow.querySelector('.delete-row-btn');
        
        stepNumberCell.textContent = stepsCount;
        
        const stepId = `step-${stepsCount}`;
        stepDescriptionTextarea.id = `step-description-${stepsCount}`;
        stepDescriptionTextarea.name = `step-description-${stepsCount}`;
        
        deleteBtn.addEventListener('click', function() {
            const row = this.closest('tr');
            row.remove();
            stepsCount--;
            renumberSteps();
            updateCounters();
        });
        
        stepsTableBody.appendChild(stepRow);
        updateCounters();
    }
    
    function renumberSteps() {
        const stepRows = document.querySelectorAll('.step-row');
        stepsCount = 0;
        
        stepRows.forEach((row, index) => {
            stepsCount++;
            const stepNumberCell = row.querySelector('.step-number');
            stepNumberCell.textContent = stepsCount;
        });
    }
    
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const ingredientsTableBody = document.getElementById('ingredientsTableBody');
    const ingredientRowTemplate = document.getElementById('ingredientRowTemplate');
    
    if (addIngredientBtn && ingredientsTableBody && ingredientRowTemplate) {
        addIngredientBtn.addEventListener('click', function() {
            addIngredientRow();
        });
    }
    
    function addIngredientRow() {
        ingredientsCount++;
        const ingredientRow = ingredientRowTemplate.content.cloneNode(true);
        const newIngredientCheckbox = ingredientRow.querySelector('.new-ingredient');
        const ingredientImageField = ingredientRow.querySelector('.ingredient-image-field');
        const deleteBtn = ingredientRow.querySelector('.delete-row-btn');
        
        const ingredientId = `ingredient-${ingredientsCount}`;
        const nameInput = ingredientRow.querySelector('.ingredient-name');
        const amountInput = ingredientRow.querySelector('.ingredient-amount');
        const unitSelect = ingredientRow.querySelector('.ingredient-unit');
        const imageInput = ingredientRow.querySelector('.ingredient-image');
        
        nameInput.id = `ingredient-name-${ingredientsCount}`;
        nameInput.name = `ingredient-name-${ingredientsCount}`;
        amountInput.id = `ingredient-amount-${ingredientsCount}`;
        amountInput.name = `ingredient-amount-${ingredientsCount}`;
        unitSelect.id = `ingredient-unit-${ingredientsCount}`;
        unitSelect.name = `ingredient-unit-${ingredientsCount}`;
        imageInput.id = `ingredient-image-${ingredientsCount}`;
        imageInput.name = `ingredient-image-${ingredientsCount}`;
        
        newIngredientCheckbox.addEventListener('change', function() {
            if (this.checked) {
                ingredientImageField.classList.add('active');
                imageInput.required = true;
            } else {
                ingredientImageField.classList.remove('active');
                imageInput.required = false;
                imageInput.value = '';
            }
        });
        
        deleteBtn.addEventListener('click', function() {
            const row = this.closest('tr');
            row.remove();
            ingredientsCount--;
            updateCounters();
        });
        
        ingredientsTableBody.appendChild(ingredientRow);
        updateCounters();
    }
    
    const addRecipeForm = document.getElementById('addRecipeForm');
    
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }
    
    function validateForm() {
        let isValid = true;
        
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');
        
        const recipeName = document.getElementById('recipeName');
        const recipeImage = document.getElementById('recipeImage');
        const recipeCalories = document.getElementById('recipeCalories');
        const recipeTime = document.getElementById('recipeTime');
        const recipeDescription = document.getElementById('recipeDescription');
        const cuisineName = document.getElementById('cuisineName');
        const categoryName = document.getElementById('categoryName');
        
        if (!recipeName.value.trim()) {
            document.getElementById('recipeName-error').textContent = 'Введите название рецепта';
            isValid = false;
        }
        
        if (!recipeImage.value.trim()) {
            document.getElementById('recipeImage-error').textContent = 'Введите URL изображения';
            isValid = false;
        }
        
        if (!recipeCalories.value || parseInt(recipeCalories.value) <= 0) {
            document.getElementById('recipeCalories-error').textContent = 'Введите корректное количество калорий';
            isValid = false;
        }
        
        if (!recipeTime.value.trim()) {
            document.getElementById('recipeTime-error').textContent = 'Введите время приготовления';
            isValid = false;
        }
        
        if (!recipeDescription.value.trim()) {
            document.getElementById('recipeDescription-error').textContent = 'Введите описание рецепта';
            isValid = false;
        }
        
        if (!cuisineName.value) {
            const errorId = newCuisineCheckbox && newCuisineCheckbox.checked ? 'cuisineName-error' : null;
            if (errorId) {
                document.getElementById('cuisineName-error').textContent = 'Введите название кухни';
                isValid = false;
            }
        }
        
        if (!categoryName.value) {
            const errorId = newCategoryCheckbox && newCategoryCheckbox.checked ? 'categoryName-error' : null;
            if (errorId) {
                document.getElementById('categoryName-error').textContent = 'Введите название категории';
                isValid = false;
            }
        }
        
        const stepDescriptions = document.querySelectorAll('.step-description');
        let stepErrors = false;
        
        stepDescriptions.forEach((step, index) => {
            if (!step.value.trim()) {
                const errorElement = step.parentNode.querySelector('.step-description-error');
                if (errorElement) {
                    errorElement.textContent = 'Введите описание шага';
                    stepErrors = true;
                }
            }
        });
        
        if (stepErrors) {
            isValid = false;
        }
        
        if (stepsCount === 0) {
            alert('Добавьте хотя бы один шаг приготовления');
            isValid = false;
        }
        
        const ingredientNames = document.querySelectorAll('.ingredient-name');
        const ingredientAmounts = document.querySelectorAll('.ingredient-amount');
        const ingredientUnits = document.querySelectorAll('.ingredient-unit');
        let ingredientErrors = false;
        
        ingredientNames.forEach((ingredient, index) => {
            if (!ingredient.value.trim()) {
                const errorElement = ingredient.parentNode.querySelector('.ingredient-name-error');
                if (errorElement) {
                    errorElement.textContent = 'Введите название ингредиента';
                    ingredientErrors = true;
                }
            }
        });
        
        ingredientAmounts.forEach((amount, index) => {
            if (!amount.value || parseFloat(amount.value) <= 0) {
                const errorElement = amount.parentNode.querySelector('.ingredient-amount-error');
                if (errorElement) {
                    errorElement.textContent = 'Введите корректное количество';
                    ingredientErrors = true;
                }
            }
        });
        
        ingredientUnits.forEach((unit, index) => {
            if (!unit.value) {
                const errorElement = unit.parentNode.querySelector('.ingredient-unit-error');
                if (errorElement) {
                    errorElement.textContent = 'Выберите единицу измерения';
                    ingredientErrors = true;
                }
            }
        });
        
        if (ingredientErrors) {
            isValid = false;
        }
        
        if (ingredientsCount === 0) {
            alert('Добавьте хотя бы один ингредиент');
            isValid = false;
        }
        
        return isValid;
    }
    
    function submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
        submitBtn.disabled = true;
        
        const formData = new FormData();
        formData.append('recipeName', document.getElementById('recipeName').value);
        formData.append('recipeImage', document.getElementById('recipeImage').value);
        formData.append('recipeCalories', parseInt(document.getElementById('recipeCalories').value));
        formData.append('recipeTime', parseInt(document.getElementById('recipeTime').value));
        formData.append('recipeDescription', document.getElementById('recipeDescription').value);
        formData.append('cuisineName', document.getElementById('cuisineName').value);
        formData.append('cuisineImage', document.getElementById('cuisineImage') ? document.getElementById('cuisineImage').value : '');
        formData.append('cuisineDescription', document.getElementById('cuisineDescription') ? document.getElementById('cuisineDescription').value : '');
        formData.append('isNewCuisine', document.getElementById('newCuisine').checked);
        formData.append('categoryName', document.getElementById('categoryName').value);
        formData.append('categoryDescription', document.getElementById('categoryDescription') ? document.getElementById('categoryDescription').value : '');
        formData.append('isNewCategory', document.getElementById('newCategory').checked);
        
        const stepsArr = [];
        const stepRows = document.querySelectorAll('.step-row');
        stepRows.forEach((row, index) => {
            const description = row.querySelector('.step-description').value;

            stepsArr.push({
                'number': index + 1,
                'description': description
            });
        });
        formData.append('steps', JSON.stringify(stepsArr));

        const ingredientArr = [];
        const ingredientRows = document.querySelectorAll('.ingredient-row');
        ingredientRows.forEach((row, index) => {
            const name = row.querySelector('.ingredient-name').value;
            const amount = parseInt(row.querySelector('.ingredient-amount').value);
            const unit = row.querySelector('.ingredient-unit').value;
            const image = row.querySelector('.ingredient-image').value;
            const isNew = row.querySelector('.new-ingredient').checked;
            
            ingredientArr.push({
                'name': name,
                'amount': amount,
                'unit': unit,
                'image': image,
                'isNew': isNew
            });
        });
        formData.append('ingredients', JSON.stringify(ingredientArr));

        fetch('scripts/add_recipe.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {    
            if (data.result) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Рецепт сохранен!';
                submitBtn.style.background = 'linear-gradient(to right, #10b981, #059669)';

                window.location.href = 'http://localhost:4000/index.html';
            }
            else {
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Записать рецепт';
                submitBtn.disabled = false;
            }
        });
    }
    
    updateCounters();
}