let userData = null

document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        getUserInfo()
    ])
    .then(_ => {
        populateProfileData();
        
        // initEventHandlers();
        
        // initModals();        
    })
});

async function getUserInfo() {
    var response = await fetch('scripts/get_user_info.php', { method: 'GET' });
    userData = await response.json();
}

function populateProfileData() {
    document.getElementById('profileName').textContent = `${userData.first_name} ${userData.last_name}`;
    document.getElementById('userFirstName').textContent = userData.first_name;
    document.getElementById('userLastName').textContent = userData.last_name;
    document.getElementById('userEmail').textContent = userData.email;
    
    const birthday = new Date(userData.birthday);
    const birthdayFormatted = birthday.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
    });

    document.getElementById('userBirthday').textContent = birthdayFormatted;
    document.getElementById('profileRole').textContent = userData.role;
    document.getElementById('userRole').textContent = userData.role;
    document.getElementById('recipesCount').textContent = userData.recipes;
    document.getElementById('favoritesCount').textContent = userData.saved;
    document.getElementById('reviewsCount').textContent = userData.reviews;

    const avatarElement = document.getElementById('userAvatar');
    avatarElement.innerHTML = `<img src="${userData.icon}" alt="${userData.first_name}">`;
}

// Инициализация обработчиков событий
function initEventHandlers() {
    // Кнопка редактирования профиля
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openEditProfileModal);
    }
    
    // Кнопка изменения аватара
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', openAvatarModal);
    }
    
    // Кнопка редактирования биографии
    const editBioBtn = document.getElementById('editBioBtn');
    if (editBioBtn) {
        editBioBtn.addEventListener('click', openEditProfileModal);
    }
}

// Инициализация модальных окон
function initModals() {
    // Модальное окно редактирования профиля
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    
    // Закрытие модального окна редактирования
    if (closeEditModal) {
        closeEditModal.addEventListener('click', closeEditProfileModal);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditProfileModal);
    }
    
    // Закрытие при клике на оверлей
    if (editProfileModal) {
        editProfileModal.addEventListener('click', function(e) {
            if (e.target === editProfileModal) {
                closeEditProfileModal();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (editProfileModal.classList.contains('active')) {
                closeEditProfileModal();
            }
            const avatarModal = document.getElementById('avatarModal');
            if (avatarModal && avatarModal.classList.contains('active')) {
                closeAvatarModal();
            }
        }
    });
    
    // Отправка формы редактирования профиля
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // Модальное окно смены аватара
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModalBtn = document.getElementById('closeAvatarModal');
    const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const uploadArea = document.getElementById('uploadArea');
    
    // Закрытие модального окна смены аватара
    if (closeAvatarModalBtn) {
        closeAvatarModalBtn.addEventListener('click', closeAvatarModal);
    }
    
    if (cancelAvatarBtn) {
        cancelAvatarBtn.addEventListener('click', closeAvatarModal);
    }
    
    // Закрытие при клике на оверлей
    if (avatarModal) {
        avatarModal.addEventListener('click', function(e) {
            if (e.target === avatarModal) {
                closeAvatarModal();
            }
        });
    }
    
    // Сохранение аватара
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', saveAvatar);
    }
    
    // Загрузка аватара
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            avatarUpload.click();
        });
    }
    
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            handleAvatarUpload(e.target.files[0]);
        });
    }
    
    // Drag & drop для загрузки аватара
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleAvatarUpload(file);
            } else {
                alert('Пожалуйста, выберите изображение (JPG, PNG или GIF)');
            }
        });
    }
    
    // Генерация пресетов аватаров
    generateAvatarPresets();
}

// Открытие модального окна редактирования профиля
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    
    // Заполнение формы текущими данными
    document.getElementById('editFirstName').value = userData.firstName;
    document.getElementById('editLastName').value = userData.lastName;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editBirthday').value = userData.birthday;
    document.getElementById('editBio').value = userData.bio;
    document.getElementById('editFavoriteCuisine').value = userData.favoriteCuisine;
    document.getElementById('editSkillLevel').value = userData.skillLevel;
    document.getElementById('editCookingTime').value = userData.cookingTime;
    document.getElementById('editDietType').value = userData.dietType;
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна редактирования профиля
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Сохранение изменений профиля
function saveProfileChanges() {
    // Получаем данные из формы
    userData.firstName = document.getElementById('editFirstName').value;
    userData.lastName = document.getElementById('editLastName').value;
    userData.email = document.getElementById('editEmail').value;
    userData.birthday = document.getElementById('editBirthday').value;
    userData.bio = document.getElementById('editBio').value;
    userData.favoriteCuisine = document.getElementById('editFavoriteCuisine').value;
    userData.skillLevel = document.getElementById('editSkillLevel').value;
    userData.cookingTime = document.getElementById('editCookingTime').value;
    userData.dietType = document.getElementById('editDietType').value;
    
    // Сохраняем в localStorage
    saveUserDataToStorage();
    
    // Обновляем отображение профиля
    populateProfileData();
    
    // Закрываем модальное окно
    closeEditProfileModal();
    
    // Показываем уведомление
    showNotification('Профиль успешно обновлен!');
}

// Открытие модального окна смены аватара
function openAvatarModal() {
    const modal = document.getElementById('avatarModal');
    
    // Сбрасываем состояние
    document.getElementById('saveAvatarBtn').disabled = true;
    document.getElementById('uploadArea').classList.remove('drag-over');
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна смены аватара
function closeAvatarModal() {
    const modal = document.getElementById('avatarModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Генерация пресетов аватаров
function generateAvatarPresets() {
    const avatarGrid = document.getElementById('avatarGrid');
    const avatarTemplate = document.getElementById('avatarTemplate');
    
    presetAvatars.forEach(avatar => {
        const avatarElement = avatarTemplate.content.cloneNode(true);
        const avatarOption = avatarElement.querySelector('.avatar-option');
        const avatarIcon = avatarElement.querySelector('.avatar-icon');
        
        // Устанавливаем стили
        avatarOption.dataset.avatarId = avatar.id;
        avatarIcon.style.background = `linear-gradient(135deg, ${avatar.color}, ${avatar.color}80)`;
        avatarIcon.innerHTML = `<i class="${avatar.icon}"></i>`;
        
        // Обработчик выбора аватара
        avatarOption.addEventListener('click', function() {
            // Снимаем выделение со всех аватаров
            document.querySelectorAll('.avatar-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Выделяем выбранный аватар
            this.classList.add('selected');
            
            // Активируем кнопку сохранения
            document.getElementById('saveAvatarBtn').disabled = false;
            
            // Сохраняем выбранный аватар
            selectedAvatar = {
                type: 'preset',
                id: avatar.id,
                color: avatar.color,
                icon: avatar.icon
            };
        });
        
        avatarGrid.appendChild(avatarElement);
    });
}

// Обработка загрузки аватара
let selectedAvatar = null;

function handleAvatarUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение (JPG, PNG или GIF)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Размер файла не должен превышать 5MB');
        return;
    }
    
    // Снимаем выделение с пресетов
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Создаем временный URL для предпросмотра
    const reader = new FileReader();
    reader.onload = function(e) {
        // Создаем элемент для предпросмотра
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.innerHTML = `
            <div class="avatar-preview">
                <img src="${e.target.result}" alt="Предпросмотр">
            </div>
            <p>Изображение загружено</p>
            <button class="upload-btn" onclick="document.getElementById('avatarUpload').click()">
                Выбрать другое
            </button>
        `;
        
        // Сохраняем выбранный аватар
        selectedAvatar = {
            type: 'upload',
            file: file,
            url: e.target.result
        };
        
        // Активируем кнопку сохранения
        document.getElementById('saveAvatarBtn').disabled = false;
    };
    
    reader.readAsDataURL(file);
}

// Сохранение аватара
function saveAvatar() {
    if (!selectedAvatar) {
        alert('Пожалуйста, выберите аватар');
        return;
    }
    
    if (selectedAvatar.type === 'preset') {
        // Для пресета сохраняем только информацию о выборе
        userData.avatar = null;
        userData.avatarPreset = selectedAvatar.id;
    } else if (selectedAvatar.type === 'upload') {
        // Для загруженного изображения сохраняем URL
        userData.avatar = selectedAvatar.url;
        userData.avatarPreset = null;
        
        // В реальном приложении здесь была бы загрузка на сервер
        console.log('Загружено изображение:', selectedAvatar.file.name);
    }
    
    // Сохраняем в localStorage
    saveUserDataToStorage();
    
    // Обновляем аватар на странице
    updateUserAvatar();
    
    // Закрываем модальное окно
    closeAvatarModal();
    
    // Показываем уведомление
    showNotification('Аватар успешно изменен!');
}

// Показать уведомление
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #1e2a3a;
        color: #e2e8f0;
        padding: 15px 25px;
        border-radius: 10px;
        border-left: 4px solid #20b2aa;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Анимация загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .profile-avatar-section,
        .profile-quick-actions,
        .profile-badges,
        .profile-info-section,
        .profile-bio-section,
        .profile-preferences-section,
        .profile-recent-activity {
            animation: fadeIn 0.6s ease forwards;
            opacity: 0;
        }
        
        .profile-avatar-section { animation-delay: 0.1s; }
        .profile-quick-actions { animation-delay: 0.2s; }
        .profile-badges { animation-delay: 0.3s; }
        .profile-info-section { animation-delay: 0.1s; }
        .profile-bio-section { animation-delay: 0.2s; }
        .profile-preferences-section { animation-delay: 0.3s; }
        .profile-recent-activity { animation-delay: 0.4s; }
    `;
    document.head.appendChild(style);
});