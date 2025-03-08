document.addEventListener('DOMContentLoaded', () => {
    const genresContainer = document.querySelector('.genres');
    const showMoreBtn = document.querySelector('.show-more-btn');

    // Additional genres to be added
    const additionalGenres = ['News', 'Lifestyle','Finance','Healthcare'];

    // Create and append additional genre buttons
    additionalGenres.forEach(genre => {
        const btn = document.createElement('button');
        btn.classList.add('genre-btn');
        btn.textContent = genre;
        btn.setAttribute('data-genre', genre);
        genresContainer.insertBefore(btn, showMoreBtn);
    });

    // Hide additional genres initially
    const genreButtons = genresContainer.querySelectorAll('.genre-btn');
    genreButtons.forEach((btn, index) => {
        if (index >= 4) { // Show only the first 4 genres initially
            btn.style.display = 'none';
        }
    });

    // Toggle visibility of additional genres when "Show More" is clicked
    showMoreBtn.addEventListener('click', () => {
        genreButtons.forEach((btn, index) => {
            if (index >= 4) {
                btn.style.display = btn.style.display === 'none' ? 'inline-block' : 'none';
            }
        });
        showMoreBtn.textContent = showMoreBtn.textContent === 'Show More' ? 'Show Less' : 'Show More';
    });
});
