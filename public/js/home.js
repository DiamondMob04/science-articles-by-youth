$(document).ready(() => {
    $(".text-block").css({opacity: 0.1})
    $(".text-block").waypoint(function(direction) {
        $(this[0, "element"]).addClass("fade-in")
    }, { offset: "80%" })
})