import gsap from "gsap";

export const scrollAnimation = (position, target, onUpdate) => {
    const timeline = gsap.timeline();

    timeline.to(position, {
        x,
        z,
        y,
        scrollTrigger: {
            trigger: ".pitch-section",
            start: "top bottom",
            end: "top top",
            scrub: 2,
            immediate: false
        },
        onUpdate
    })

}