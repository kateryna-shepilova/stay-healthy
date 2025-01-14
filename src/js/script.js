document.addEventListener('DOMContentLoaded', function () {
    // mobile menu
    const body = document.querySelector('body');
    const menuToggle = document.querySelector('.header__opener');

    menuToggle.addEventListener('click', function () {
        body.classList.toggle('menu-active');
    });

    // fancybox
    Fancybox.bind("[data-fancybox]", {
        // Your custom options
    });

    // swiper
    const programsSliders = document.querySelectorAll('.programs-slider')

    programsSliders.forEach((programsSlider) => {
        const swiper = new Swiper(programsSlider, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 16,
            navigation: {
                nextEl: programsSlider.closest('.programs__slider-holder')
                    .querySelector('.swiper-button-next'),
                prevEl: programsSlider.closest('.programs__slider-holder')
                    .querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            },
        });
    })

    // smooth scroll
    document.querySelectorAll('a[href*="#"]:not([href="#"]):not([data-fancybox])').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetHash = this.hash;
            if (this.href.split('#')[0] === window.location.href.split('#')[0]) {
                scrollToHash(targetHash);
                history.pushState(null, null, targetHash);
            } else {
                localStorage.setItem('targetHash', targetHash);
                window.location.href = this.href.split('#')[0];
            }
            if (body.classList.contains('mobile-header-active')) {
                body.classList.remove('mobile-header-active');
            }
        });
    });

    const storedHash = localStorage.getItem('targetHash');
    if (storedHash) {
        setTimeout(function () {
            scrollToHash(storedHash);
            history.pushState(null, null, storedHash);
            localStorage.removeItem('targetHash');
        }, 150);
    }

    function scrollToHash(hash) {
        const target = document.querySelector(hash);
        if (target) {
            const targetOffset = target.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
        }
    }

});
