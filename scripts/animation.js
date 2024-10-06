gsap.registerPlugin(ScrollTrigger);


gsap.to(".h-auto", {
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    duration: 0.3,
    scrollTrigger: {
        trigger: ".h-auto",
        start: "top top",
        toggleActions: "play none none reverse",
        scrub: true, 
    }
});


gsap.to("img", {
    height: "3vh", 
    duration: 0.3,
    scrollTrigger: {
        trigger: ".h-auto",
        start: "top top",
        toggleActions: "play none none reverse",
        scrub: true,
    }
});

gsap.from(".nav-link", {
    opacity: 0,
    y: -30,
    duration: 0.5,
    stagger: 0.1, 
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".h-auto",
        start: "top top",
        toggleActions: "play none none reverse",
        scrub: true,
    }
});


gsap.to(".nav-link", {
    color: "#fff", 
    duration: 0.3,
    scrollTrigger: {
        trigger: ".h-auto",
        start: "top top",
        toggleActions: "play none none reverse",
        scrub: true,
    }
});

gsap.from("#earth-title", {
    opacity: 0,
    y: -50,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#earth-title",
        start: "top 80%",
        toggleActions: "play none none reverse",
        scrub: true,
    }
});


gsap.from("#earth-description", {
    opacity: 0,
    y: 50, 
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#earth-description",
        start: "top 85%", 
        toggleActions: "play none none reverse",
        scrub: true,
    }
});


gsap.from("#earth-image", {
    opacity: 0,
    scale: 0.8,  
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#earth-image",
        start: "top 80%", 
        toggleActions: "play none none reverse",
        scrub: true, 
    }
});
gsap.from("#orrey-title", {
    opacity: 0,
    y: -80, 
    duration: 1.5,
    ease: "bounce.out", 
    scrollTrigger: {
        trigger: "#orrey-title",
        start: "top 80%",
        toggleActions: "play none none reverse",
        scrub: false, 
    }
});


gsap.from("#orrey-description", {
    opacity: 0,
    y: 50, 
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#orrey-description",
        start: "top 85%",
        toggleActions: "play none none reverse",
        scrub: true,
    }
});


gsap.from("#orrey-image", {
    opacity: 0,
    scale: 0.8,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: "#orrey-image",
        start: "top 80%", 
        toggleActions: "play none none reverse",
        scrub: true, 
    }
});


