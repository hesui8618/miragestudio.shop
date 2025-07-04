// Mirage Studio - 交互功能脚本
// 版本: 1.0 - 添加完整交互功能

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initMobileMenu();
    initScrollEffects();
    initAnimations();
});

// 平滑滚动导航功能
function initSmoothScrolling() {
    // 获取所有内部导航链接
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 计算目标位置（考虑固定导航栏高度）
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端菜单功能
function initMobileMenu() {
    const header = document.querySelector('.main-header');
    const nav = document.querySelector('.main-nav');
    
    // 创建汉堡菜单按钮
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;
    
    // 将按钮插入到导航前面
    header.querySelector('.container').insertBefore(mobileMenuBtn, nav);
    
    // 菜单切换功能
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('nav-active');
        this.classList.toggle('menu-active');
        document.body.classList.toggle('menu-open');
    });
    
    // 点击菜单项后关闭移动端菜单
    const navItems = nav.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            nav.classList.remove('nav-active');
            mobileMenuBtn.classList.remove('menu-active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target)) {
            nav.classList.remove('nav-active');
            mobileMenuBtn.classList.remove('menu-active');
            document.body.classList.remove('menu-open');
        }
    });
}

// 滚动效果功能
function initScrollEffects() {
    const header = document.querySelector('.main-header');
    let lastScrollY = window.scrollY;
    
    // 防抖函数，优化滚动性能
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 滚动时的导航栏效果
    const handleScroll = debounce(function() {
        const currentScrollY = window.scrollY;
        
        // 导航栏背景透明度变化
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 向上滚动显示导航栏，向下滚动隐藏（可选效果）
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// 页面元素动画功能
function initAnimations() {
    // 创建Intersection Observer来监听元素进入视口
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // 一次性动画，观察后即停止
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 监听需要动画的元素
    const animateElements = document.querySelectorAll('.feature-card, .tech-highlight, .hero-section h1, .hero-section .subtitle');
    animateElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 页面性能优化：图片懒加载（如果需要）
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// 表单处理功能（预留，如果后续需要联系表单）
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // 这里可以添加表单验证和提交逻辑
            console.log('表单提交功能待实现');
        });
    });
}

// 键盘导航支持（提升无障碍体验）
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC键关闭移动端菜单
        if (e.key === 'Escape') {
            const nav = document.querySelector('.main-nav');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                mobileMenuBtn.classList.remove('menu-active');
                document.body.classList.remove('menu-open');
            }
        }
    });
}

// 页面可见性变化处理（性能优化）
function initVisibilityHandling() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面不可见时暂停某些操作
            console.log('页面隐藏，暂停动画');
        } else {
            // 页面可见时恢复操作
            console.log('页面显示，恢复动画');
        }
    });
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 页面退出前的清理
window.addEventListener('beforeunload', function() {
    // 清理定时器、事件监听器等
});

console.log('🎉 Mirage Studio 交互功能已加载完成！'); 