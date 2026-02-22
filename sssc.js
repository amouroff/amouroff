(function() {
    'use strict';
    
    function getUTM() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source'),
            medium: urlParams.get('utm_medium'),
            campaign: urlParams.get('utm_campaign')
        };
    }

    function getDeviceType() {
        const ua = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
        
        if (isTablet) return 'tablet';
        if (isMobile) return 'mobile';
        return 'desktop';
    }

    const utm = getUTM();
    
    if (utm.source === 'yandex' && utm.medium === 'organic' && utm.campaign === 'promo') {
        
        const deviceType = getDeviceType();
        
        const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
        
        setTimeout(function() {
            
            function getMaxScroll() {
                return Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight,
                    document.documentElement.clientHeight
                ) - window.innerHeight;
            }
            
            let settings = {
                steps: { min: 10, max: 25 },        
                baseDelay: { min: 80, max: 250 },    
                readPause: { min: 800, max: 3000 },  
                backScroll: { min: 30, max: 80 },    
                variance: 30,                         
                microPause: 0.3                        
            };
            
            if (deviceType === 'mobile') {
                settings = {
                    steps: { min: 8, max: 20 },        
                    baseDelay: { min: 120, max: 350 },  
                    readPause: { min: 1000, max: 4000 }, 
                    backScroll: { min: 20, max: 50 },    
                    variance: 20,                         
                    microPause: 0.4                        
                };
            } else if (deviceType === 'tablet') {
                settings = {
                    steps: { min: 12, max: 22 },
                    baseDelay: { min: 100, max: 300 },
                    readPause: { min: 900, max: 3500 },
                    backScroll: { min: 25, max: 60 },
                    variance: 25,
                    microPause: 0.35
                };
            }
            
            let steps = settings.steps.min + Math.floor(Math.random() * (settings.steps.max - settings.steps.min + 1));
            let currentStep = 0;
            let lastPosition = 0;
            let lastScrollTime = Date.now();
            let scrollDirection = 1; 
            
            function getRandomDelay(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            }
            
            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }
            
            function doScroll() {
                const maxScroll = getMaxScroll();
                const currentTime = Date.now();
                const timeSinceLastScroll = currentTime - lastScrollTime;
                
                if (timeSinceLastScroll > 10000) { 
                    currentStep = steps; 
                    return;
                }
                
                if (currentStep < steps && maxScroll > 0) {
                    
                    let baseProgress = currentStep / steps;
                    let progress = baseProgress;
                    
                    if (Math.random() > 0.8) {
                        progress += (Math.random() - 0.5) * 0.1;
                        progress = Math.max(0, Math.min(1, progress));
                    }
                    
                    let position;
                    if (progress < 0.2) {
                        
                        position = maxScroll * easeOutCubic(progress * 5);
                    } else if (progress < 0.7) {
                        
                        position = maxScroll * (0.2 + easeInOutQuad((progress - 0.2) / 0.5) * 0.5);
                    } else {
                       
                        const endT = (progress - 0.7) / 0.3;
                        position = maxScroll * (0.7 + (1 - Math.pow(1 - endT, 2)) * 0.3);
                    }
                    
                    
                    if (Math.random() > 0.6) {
                        position += (Math.random() - 0.5) * settings.variance;
                    }
                    
                   
                    if (Math.random() > 0.8) {
                        position += (Math.random() - 0.5) * 15;
                    }
                    
                    position = Math.max(0, Math.min(position, maxScroll));
                    
                   
                    if (position > lastPosition) {
                        scrollDirection = 1;
                    } else if (position < lastPosition) {
                        scrollDirection = -1;
                    }
                    
                    
                    if (deviceType === 'mobile' || deviceType === 'tablet') {
                        
                        window.scrollTo({
                            top: position,
                            behavior: 'smooth'
                        });
                    } else {
                        
                        if (Math.random() > 0.7) {
                            window.scrollTo({
                                top: position,
                                behavior: 'auto'
                            });
                        } else {
                            window.scrollTo({
                                top: position,
                                behavior: 'smooth'
                            });
                        }
                    }
                    
                    lastPosition = position;
                    lastScrollTime = Date.now();
                    currentStep++;
                    
                    
                    let nextDelay = getRandomDelay(settings.baseDelay.min, settings.baseDelay.max);
                    
                    
                    if (scrollDirection === 1) {
                        
                        nextDelay = Math.floor(nextDelay * 0.9);
                    } else {
                       
                        nextDelay = Math.floor(nextDelay * 1.3);
                    }
                    
                   
                    const readProbability = deviceType === 'mobile' ? 0.35 : 0.25;
                    if (Math.random() < readProbability) {
                       
                        nextDelay += getRandomDelay(settings.readPause.min, settings.readPause.max);
                        
                      
                        if (Math.random() > 0.7) {
                            setTimeout(function() {
                                window.scrollBy({
                                    top: (Math.random() - 0.5) * 20,
                                    behavior: 'smooth'
                                });
                            }, nextDelay / 3);
                        }
                    }
                    
                   
                    if (Math.random() < settings.microPause) {
                        nextDelay += getRandomDelay(100, 300);
                    }
                    
                    
                    if (Math.random() < 0.12 && position > 100) {
                        const backAmount = getRandomDelay(settings.backScroll.min, settings.backScroll.max);
                        setTimeout(function() {
                            window.scrollBy({
                                top: -backAmount,
                                behavior: 'smooth'
                            });
                            
                           
                            setTimeout(function() {
                                
                                if (currentStep < steps) {
                                    doScroll();
                                }
                            }, getRandomDelay(300, 800));
                        }, nextDelay / 2);
                        
                        
                        nextDelay += getRandomDelay(400, 1000);
                    }
                    
                   
                    if (progress > 0.85 && Math.random() > 0.5) {
                        nextDelay = Math.floor(nextDelay * 0.6);
                    }
                    
                    setTimeout(doScroll, nextDelay);
                    
                } else {
                   
                    
                   
                    setTimeout(function() {
                        
                        if (Math.random() < 0.4) {
                            const finalPosition = maxScroll * (0.7 + Math.random() * 0.2);
                            window.scrollTo({
                                top: finalPosition,
                                behavior: 'smooth'
                            });
                            
                           
                            if (Math.random() > 0.5) {
                                setTimeout(function() {
                                    window.scrollBy({
                                        top: (Math.random() - 0.5) * 30,
                                        behavior: 'smooth'
                                    });
                                }, 1000);
                            }
                        }
                    }, 500);
                    
                   
                    if (maxScroll > lastPosition + 150) {
                        currentStep = steps - 3;
                        steps += 5;
                        setTimeout(doScroll, getRandomDelay(800, 2000));
                    }
                }
            }
            
           
            doScroll();
            
            
            let lastScrollHeight = getMaxScroll();
            let contentCheckInterval = setInterval(function() {
                const currentScrollHeight = getMaxScroll();
                if (currentScrollHeight > lastScrollHeight + 150) {
                    
                    if (currentStep >= steps) {
                        
                        setTimeout(function() {
                            steps = currentStep + getRandomDelay(8, 15);
                            doScroll();
                        }, getRandomDelay(1000, 3000));
                    } else {
                        
                        steps = currentStep + getRandomDelay(5, 10);
                    }
                    lastScrollHeight = currentScrollHeight;
                }
            }, 800);
            
           
            setTimeout(function() {
                clearInterval(contentCheckInterval);
            }, 300000);
            
        }, delay);
        
    }
    
})();
