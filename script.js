class ParallaxTransition {
    constructor() {
        this.scrollContainer = document.getElementById('scrollContainer');
        this.whiteWipe = document.getElementById('whiteWipe');
        this.parallaxBgs = document.querySelectorAll('.parallax-bg');
        this.fixedTexts = document.querySelectorAll('.fixed-text');
        this.textGroups = document.querySelectorAll('.text-group');
        this.pageImages = document.querySelectorAll('.page-content-image');
        this.pages = document.querySelectorAll('.page');
        this.totalPages = this.pages.length;
        
        this.imageParallax = 0.1;
        this.textParallaxAmount = 50;
        this.textRange = 0.7;
        
        this.setupScrollListener();
        this.setupImageObserver();
        this.update();
        
        const firstPageImg = document.querySelector('.page[data-page="0"] .page-content-image');
        if (firstPageImg) {
            setTimeout(() => firstPageImg.classList.add('visible'), 100);
        }
    }
    
    setupScrollListener() {
        let ticking = false;
        
        this.scrollContainer.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    setupImageObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const img = entry.target.querySelector('.page-content-image');
                if (img) {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        img.classList.add('visible');
                    } else {
                        img.classList.remove('visible');
                    }
                }
            });
        }, {
            root: this.scrollContainer,
            threshold: [0, 0.3, 0.5, 0.8, 1]
        });
        
        this.pages.forEach((page) => {
            observer.observe(page);
        });
    }
    
    update() {
        const scrollY = this.scrollContainer.scrollTop;
        const pageHeight = window.innerHeight;
        const progress = scrollY / pageHeight;
        
        this.updateParallax(progress);
        this.updateFixedText(progress);
        this.updateTextGroups(progress);
    }
    
    updateParallax(progress) {
        this.parallaxBgs.forEach((bg, index) => {
            const pageY = (index - progress) * 100;
            bg.style.transform = `translateY(${pageY}%)`;
            
            const mediaEl = bg.querySelector('video') || bg.querySelector('img:not(.mask-overlay)');
            if (mediaEl) {
                const localProgress = progress - index;
                const imgOffset = localProgress * this.imageParallax * 100;
                mediaEl.style.transform = `translateY(${imgOffset}%)`;
            }
        });
    }
    
    updateFixedText(progress) {
        this.fixedTexts.forEach((textEl) => {
            const textIndex = parseInt(textEl.dataset.textIndex);
            const localProgress = progress - textIndex;
            const absProgress = Math.abs(localProgress);
            
            if (absProgress >= this.textRange) {
                textEl.style.opacity = '0';
                textEl.style.transform = 'translate(0, -50%)';
                return;
            }
            
            const opacity = 1 - (absProgress / this.textRange);
            const yOffset = -localProgress * (this.textParallaxAmount / this.textRange);
            
            textEl.style.opacity = opacity;
            textEl.style.transform = `translate(0, calc(-50% + ${yOffset}px))`;
        });
    }
    
    updateTextGroups(progress) {
        this.textGroups.forEach((groupEl) => {
            const groupIndex = parseInt(groupEl.dataset.groupIndex);
            const localProgress = progress - groupIndex;
            const absProgress = Math.abs(localProgress);
            
            if (absProgress >= this.textRange) {
                groupEl.style.opacity = '0';
                groupEl.style.transform = 'translate(0, -50%)';
                return;
            }
            
            const opacity = 1 - (absProgress / this.textRange);
            const yOffset = -localProgress * (this.textParallaxAmount / this.textRange);
            
            groupEl.style.opacity = opacity;
            groupEl.style.transform = `translate(0, calc(-50% + ${yOffset}px))`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParallaxTransition();
});