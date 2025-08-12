document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Customer Reviews Carousel
    const carousel = document.querySelector('.reviews-carousel');
    if (carousel) {
        const reviews = Array.from(carousel.children);
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        const showReview = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % reviews.length;
            showReview(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
            showReview(currentIndex);
        });

        // Auto-play functionality
        let autoPlayInterval = setInterval(() => {
            nextBtn.click();
        }, 5000);

        // Pause on hover
        const carouselContainer = document.querySelector('.reviews-container');
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => nextBtn.click(), 5000);
        });
    }

    // A single, improved form validation handler
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

            inputs.forEach(input => {
                input.style.borderColor = ''; // Reset border color
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill out all required fields.');
            } else {
                if (form.closest('.booking-page')) {
                    e.preventDefault(); // Prevent submission to show message
                    document.querySelector('.booking-content').style.display = 'none';
                    document.getElementById('confirmation-message').style.display = 'block';
                }
                // For other forms, it will submit as normal
            }
        });
    });

    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Tour Filtering
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        const priceRange = document.getElementById('price');
        const priceValue = document.getElementById('price-value');

        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                priceValue.textContent = `$500 - $${e.target.value}`;
            });
        }

        filterBtn.addEventListener('click', () => {
            const category = document.getElementById('category').value;
            const price = document.getElementById('price').value;
            const duration = document.getElementById('duration').value;
            const location = document.getElementById('location').value.toLowerCase();

            const tourCards = document.querySelectorAll('.tour-list .tour-card');

            tourCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardPrice = parseInt(card.dataset.price);
                const cardDuration = parseInt(card.dataset.duration);
                const cardLocation = card.dataset.location.toLowerCase();

                let isVisible = true;

                if (category !== 'all' && cardCategory !== category) isVisible = false;
                if (cardPrice > price) isVisible = false;
                if (duration && cardDuration > parseInt(duration)) isVisible = false;
                if (location && !cardLocation.includes(location)) isVisible = false;

                card.style.display = isVisible ? 'block' : 'none';
            });
        });
    }

    // Tour Details Page Specific Script
    if (document.getElementById('map')) {
        const map = L.map('map').setView([25.265, 55.292], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const locations = {
            'Jumeirah Mosque': [25.234, 55.265],
            'World Trade Centre': [25.226, 55.288],
            'Dubai Museum': [25.267, 55.301],
            'Desert Safari': [25.050, 55.400]
        };

        const latLngs = [];
        for (const loc in locations) {
            L.marker(locations[loc]).addTo(map).bindPopup(loc);
            latLngs.push(locations[loc]);
        }
        const polyline = L.polyline(latLngs, { color: 'red' }).addTo(map);
        map.fitBounds(polyline.getBounds());

        const itinerary = document.getElementById('itinerary');
        itinerary.addEventListener('click', function(e) {
            if (e.target.classList.contains('edit-btn')) {
                const dayItem = e.target.closest('.day-item');
                const p = dayItem.querySelector('p');

                const currentText = p.textContent;
                const originalButton = e.target;

                const textarea = document.createElement('textarea');
                textarea.style.width = '100%';
                textarea.style.height = '100px';
                textarea.value = currentText;

                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';
                saveBtn.classList.add('btn');

                p.replaceWith(textarea);
                originalButton.replaceWith(saveBtn);

                saveBtn.addEventListener('click', function() {
                    p.textContent = textarea.value;
                    textarea.replaceWith(p);
                    saveBtn.replaceWith(originalButton);
                });
            }
        });

        const addDayBtn = document.getElementById('add-day-btn');
        addDayBtn.addEventListener('click', function() {
            const newDayNum = itinerary.children.length + 1;
            const newDayItem = document.createElement('div');
            newDayItem.classList.add('day-item');
            newDayItem.dataset.day = newDayNum;
            newDayItem.innerHTML = `<h4>Day ${newDayNum}: New Activity <button class="edit-btn">Edit</button></h4><p>Describe the new day's activities here.</p>`;
            itinerary.appendChild(newDayItem);
        });
    }
});
