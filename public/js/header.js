fetch("/info").then(async (res) => {
    if (res.ok) {
        try {
            let info = await res.json()
            $(".account-name").text(info.username)
            $(".not-logged-in").remove()
            if (info.role !== "admin") {
                $(".admin-only").remove()
            } else {
                $(".admin-only").show()
            }
        } catch (error) {
            $(".account-name").remove()
            $(".admin-only").remove()
        }
    } else {
        $(".account-name").remove()
    }
})
$(document).ready(() => {
    $("#open-dropdown").click(() => {
        if ($("#header__dropdown").css("display") == "none") {
            $("#header__dropdown").css({display: "flex", flexDirection: "column"})
        } else {
            $("#header__dropdown").css({display: "none"})
        }
    })
    $("#title > *").click(() => {
        window.location.href = "/home"
    })
})