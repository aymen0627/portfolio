gsap.registerPlugin(ScrollTrigger);

class CardDeck {
    constructor() {
        this.cards = Array.from(document.querySelectorAll('.card'));
        this.buttons = document.querySelectorAll('.next-card');
        this.currentIndex = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
        this.setupTouchEvents();
        this.setupCardClicks();
    }

    init() {
        // Set initial active state
        this.cards[0].classList.add('active');
        
        this.buttons.forEach(button => {
            button.addEventListener('click', () => this.nextCard());
        });
    }

    setupTouchEvents() {
        const deck = document.querySelector('.card-deck');
        
        deck.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        deck.addEventListener('touchmove', (e) => {
            if (this.isAnimating) return;
            
            this.touchEndX = e.touches[0].clientX;
            const currentCard = this.cards[this.currentIndex];
            const diff = this.touchStartX - this.touchEndX;
            const percentage = (diff / window.innerWidth) * 100;
            
            // Add resistance to the drag
            const dampenedPercentage = Math.min(Math.abs(percentage), 40) * Math.sign(percentage);
            
            gsap.set(currentCard, {
                x: -dampenedPercentage + '%',
                rotate: -dampenedPercentage * 0.05
            });
        }, { passive: true });

        deck.addEventListener('touchend', () => {
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > 100) { // Threshold for swipe
                this.nextCard();
            } else {
                // Reset card position if swipe wasn't far enough
                gsap.to(this.cards[this.currentIndex], {
                    x: 0,
                    rotate: 0,
                    duration: 0.3
                });
            }
        });
    }

    nextCard() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const currentCard = this.cards[this.currentIndex];
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        const nextCard = this.cards[nextIndex];

        // Enhanced animation sequence
        gsap.to(currentCard, {
            x: '-100%',
            rotate: -5,
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                currentCard.classList.remove('active');
                gsap.set(currentCard, {
                    x: '5%',
                    y: '16px',
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                    zIndex: 1
                });
            }
        });

        gsap.fromTo(nextCard,
            {
                y: '8px',
                x: '5%',
                opacity: 1,
                rotateY: '2deg',
                zIndex: 2
            },
            {
                y: '0',
                x: '0',
                rotateY: '0deg',
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    nextCard.classList.add('active');
                    this.isAnimating = false;
                }
            }
        );

        // Animate other cards in stack
        this.cards.forEach((card, index) => {
            if (index !== this.currentIndex && index !== nextIndex) {
                gsap.to(card, {
                    y: parseInt(card.style.transform.split('translateY(')[1]) - 8 || 16,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
        });

        this.currentIndex = nextIndex;
    }

    setupCardClicks() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.next-card')) return;
                
                // Get project slug from data attribute
                const projectSlug = card.dataset.project;
                this.navigateToProject(card, projectSlug);
            });
        });
    }

    navigateToProject(card, projectSlug) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Get card's current position and dimensions
        const cardRect = card.getBoundingClientRect();
        const scaleX = window.innerWidth / cardRect.width;
        const scaleY = window.innerHeight / cardRect.height;
        const scale = Math.max(scaleX, scaleY) * 1.1; // Extra 10% to ensure full coverage

        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        document.body.appendChild(overlay);

        // Clone the card for the zoom animation
        const cardClone = card.cloneNode(true);
        cardClone.style.position = 'fixed';
        cardClone.style.top = `${cardRect.top}px`;
        cardClone.style.left = `${cardRect.left}px`;
        cardClone.style.width = `${cardRect.width}px`;
        cardClone.style.height = `${cardRect.height}px`;
        cardClone.style.zIndex = '1000';
        document.body.appendChild(cardClone);

        // Animate transition
        const tl = gsap.timeline({
            onComplete: () => {
                // Navigate using a relative path from root
                window.location.href = `projects/${projectSlug}/index.html`;
            }
        });

        tl
            .to(cardClone, {
                duration: 0.8,
                scale: scale,
                x: window.innerWidth/2 - (cardRect.left + cardRect.width/2),
                y: window.innerHeight/2 - (cardRect.top + cardRect.height/2),
                ease: "power2.inOut"
            })
            .to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.inOut"
            }, "-=0.2");
    }

    closeProject(projectPage, closeButton) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const tl = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
                document.body.style.overflow = '';
                projectPage.remove();
                closeButton.remove();
                // Update URL back to home
                window.history.pushState({}, '', '/');
            }
        });

        tl.to(projectPage, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut"
        })
        .to(closeButton, {
            opacity: 0,
            duration: 0.2
        });
    }
}

// Add at the beginning of the file
function handleScroll() {
    const cardsSection = document.querySelector('.experience-cards');
    const heroHeight = window.innerHeight;
    
    if (window.scrollY > heroHeight / 2) {
        // Only handle card interactions here if needed
        // Remove the visibility toggle
    }
}

// Add scroll listener
window.addEventListener('scroll', handleScroll);

// Initialize ScrollTrigger with smoother settings
gsap.config({
    force3D: true      // Force GPU acceleration
});

// Update your ScrollTrigger configuration
ScrollTrigger.config({
    ignoreMobileResize: true,
    syncInterval: 60,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' // More efficient refresh
});

document.addEventListener('DOMContentLoaded', () => {
    const cardDeck = new CardDeck();
    handleScroll();

    const logo = document.querySelector('.logo');
    
    logo.addEventListener('click', (e) => {
        // Only handle if we're not on the home page
        if (window.location.pathname !== '/') {
            e.preventDefault();
            
            // Create transition overlay
            const overlay = document.createElement('div');
            overlay.className = 'page-transition';
            document.body.appendChild(overlay);
            
            // Animate transition
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    window.location.href = '/';
                }
            });
        } else if (window.location.pathname === '/' && window.scrollY > 0) {
            // If on home page but scrolled down, smooth scroll to top
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Close expanded card when clicking outside or pressing escape
document.addEventListener('click', (e) => {
    if (!e.target.closest('.card')) {
        document.querySelectorAll('.card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
        document.body.style.overflow = '';
    }
}); 