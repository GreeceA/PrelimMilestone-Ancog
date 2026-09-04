document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    
    const gallery = document.getElementById('gallery') || document.getElementById('proj-carousel');
    let allProjects = [];
    let filteredProjects = [];
    let currentPage = 1;
    const itemsPerPage = 4; 

    if (gallery) {
        let searchBar = document.getElementById('search-bar');
        if (!searchBar) {
            const searchContainer = document.createElement('div');
            searchContainer.style.textAlign = 'center';
            searchContainer.style.marginBottom = '2rem';
            searchContainer.innerHTML = `<input type="text" id="search-bar" placeholder="Search GitHub repos by name..." style="padding: 0.8rem; width: 90%; max-width: 400px; border-radius: 8px; border: 2px solid var(--accent-gold, #d4af37); outline: none; background: var(--bg-color, #2b1414); color: var(--text-main, #fdf5e6);">`;
            gallery.parentNode.insertBefore(searchContainer, gallery);
            searchBar = document.getElementById('search-bar');
        }

        let paginationContainer = document.getElementById('pagination-controls');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-controls';
            paginationContainer.style.display = 'flex';
            paginationContainer.style.justifyContent = 'center';
            paginationContainer.style.alignItems = 'center';
            paginationContainer.style.gap = '1rem';
            paginationContainer.style.margin = '2rem 0';
            gallery.parentNode.insertBefore(paginationContainer, gallery.nextSibling);
        }

        async function fetchProjects() {
            gallery.innerHTML = '<div style="text-align:center; padding:3rem; width:100%; grid-column: 1 / -1;">Fetching from GitHub...</div>';
            
            try {
                const response = await fetch('https://api.github.com/users/GreeceA/repos?sort=updated&per_page=12');
                if (!response.ok) throw new Error('Failed to fetch repositories.');
                
                allProjects = await response.json();
                
                if (allProjects.length === 0) {
                    throw new Error("Empty repository list returned.");
                }

                filteredProjects = allProjects;
                currentPage = 1;
                renderPage();
            } catch (error) {
                console.warn("Using expanded local sample data for testing pagination & search:", error);
                
                allProjects = [
                    { name: "SAMAHAN API", description: "A production-grade NestJS REST API powering student services.", html_url: "https://github.com/GreeceA/samahan-api" },
                    { name: "Personal Portfolio", description: "A dynamic React portfolio showcasing projects and experience.", html_url: "https://github.com/GreeceA/portfolio" },
                    { name: "Inventory System", description: "A full-stack Laravel inventory management system with analytics.", html_url: "https://github.com/GreeceA/inventory-system" },
                    { name: "AgriVision AI", description: "A computer vision proof-of-concept for crop disease detection.", html_url: "https://github.com/GreeceA/agrivision" },
                    { name: "Cateneo", description: "A feline management system built for campus use.", html_url: "https://github.com/GreeceA/cateneo" },
                    { name: "Campus Vote", description: "A secure electronic voting platform built with TypeScript and Prisma.", html_url: "https://github.com/GreeceA/campus-vote" },
                    { name: "Skin Disease CNN", description: "Deep learning model using Convolutional Neural Networks for skin condition recognition.", html_url: "https://github.com/GreeceA/skin-cnn" }
                ];
                filteredProjects = allProjects;
                currentPage = 1;
                renderPage();
            }
        }

        function renderPage() {
            gallery.innerHTML = ''; 
            
            gallery.style.display = 'grid';
            gallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            gallery.style.gap = '2rem';
            gallery.style.padding = '2rem';
            
            if (filteredProjects.length === 0) {
                gallery.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No projects match your search.</p>';
                paginationContainer.innerHTML = '';
                return;
            }

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedItems = filteredProjects.slice(startIndex, endIndex);

            paginatedItems.forEach(repo => {
                const card = document.createElement('article');
                card.style.background = 'var(--surface-color, #3d2020)';
                card.style.borderTop = '4px solid var(--accent-gold, #d4af37)';
                card.style.borderRadius = '8px';
                card.style.padding = '1.5rem';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                card.style.position = 'static'; 
                card.style.transform = 'none';
                
                card.innerHTML = `
                    <h3 style="color: var(--accent-gold, #d4af37); margin-bottom: 0.5rem; font-size: 1.2rem;">${repo.name}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted, #e0d5c1); margin-bottom: 1.5rem; flex-grow: 1;">${repo.description || 'No description provided.'}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="align-self: flex-start; padding: 0.4rem 1rem; border: 1px solid var(--accent-gold, #d4af37); color: var(--accent-gold, #d4af37); text-decoration: none; border-radius: 4px; font-size: 0.9rem;">View Repository ↗</a>
                `;
                gallery.appendChild(card);
            });

            renderPaginationControls();
        }

        function renderPaginationControls() {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

            if (totalPages <= 1) return;

            const prevBtn = document.createElement('button');
            prevBtn.textContent = '← Prev';
            prevBtn.disabled = currentPage === 1;
            stylePaginationButton(prevBtn, prevBtn.disabled);
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPage();
                }
            });
            paginationContainer.appendChild(prevBtn);

            const pageIndicator = document.createElement('span');
            pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
            pageIndicator.style.color = 'var(--text-main, #fdf5e6)';
            pageIndicator.style.fontSize = '0.9rem';
            paginationContainer.appendChild(pageIndicator);

            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next →';
            nextBtn.disabled = currentPage === totalPages;
            stylePaginationButton(nextBtn, nextBtn.disabled);
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderPage();
                }
            });
            paginationContainer.appendChild(nextBtn);
        }

        function stylePaginationButton(btn, isDisabled) {
            btn.style.padding = '0.5rem 1rem';
            btn.style.borderRadius = '6px';
            btn.style.border = '1px solid var(--accent-gold, #d4af37)';
            btn.style.background = isDisabled ? 'transparent' : 'var(--accent-gold, #d4af37)';
            btn.style.color = isDisabled ? '#666' : 'var(--bg-color, #2b1414)';
            btn.style.fontWeight = 'bold';
            btn.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
            btn.style.opacity = isDisabled ? '0.5' : '1';
        }

        searchBar.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredProjects = allProjects.filter(repo => repo.name.toLowerCase().includes(term));
            currentPage = 1;
            renderPage();
        });

        fetchProjects();
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.removeAttribute('onsubmit');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const phoneInput = document.getElementById('contact-phone') || document.getElementById('phone');
            
            if (phoneInput) {
                const phPhoneRegex = /^(09|\+639)\d{9}$/;
                if (!phPhoneRegex.test(phoneInput.value)) {
                    alert("Error: Please enter a valid PH mobile number (e.g. 09123456789 or +639123456789).");
                    phoneInput.focus();
                    return;
                }
            }

            const btn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.Contact__submit-btn');
            const originalText = btn ? btn.textContent : 'Send Message';
            
            if (btn) {
                btn.textContent = 'Sending...';
                btn.disabled = true;
            }

            setTimeout(() => {
                contactForm.style.display = 'none';
                const successMsg = document.getElementById('contact-success');
                if (successMsg) {
                    successMsg.style.display = 'block';
                } else {
                    alert("Message sent successfully!");
                }
                
                contactForm.reset();
                if (btn) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            }, 1200);
        });
    }
});