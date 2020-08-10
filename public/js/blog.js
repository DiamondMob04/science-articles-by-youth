$(document).ready(() => {
    $(".article-gallery > article").css({opacity: 0.3, transform: "translate(0, -10px)"})
    $(".article-gallery > article").waypoint(function(direction) {
        $(this[0, "element"]).css({opacity: 1, transform: "translate(0px, 0px)", transition: "opacity 1.5s ease, transform 1.5s ease"})
    }, { offset: "95%" })
})