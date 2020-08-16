$(document).ready(async () => {
    const res = await fetch("/info")
    if (!res.ok) {
        window.location.href = "/login"
    }
    const json = await res.json()
    if (json.hasAvatar) {
        $("#current-prof-pic").attr("src", `/avatar/${json.username}`)
    }
    $("#current-desc").attr("placeholder", json.description)
    $("#current-username").attr("placeholder", json.username)
    const descUsername = $("#current-username")
    descUsername.on("input", () => {
        if (descUsername.val().length > 16) {
            descUsername.css("border", "2px solid red")
        } else {
            descUsername.css("border", "1px solid black")
        }
    })
    const descTextarea = $("#current-desc")
    descTextarea.on("input", () => {
        if (descTextarea.val().length > 300) { 
            descTextarea.css("border", "2px solid red")
        } else {
            descTextarea.css("border", "1px solid black")
        }
    })
    $("#set-username").click(() => {
        fetch("/user", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: $("#current-username").val()
            })
        }).then((res) => {
            if (res.ok) {
                $("#current-username").attr("placeholder", $("#current-username").val())
                $("#current-username").val("")
                $("#username-status").css("color", "green").text("Username successfully changed!").stop(true).show(1000).delay(3000).hide(1000)
            } else {
                $("#username-status").css("color", "red").text("Something went wrong.").stop(true).show(1000).delay(3000).hide(1000)
            }
        })
    })
    $("#set-desc").click(() => {
        fetch("/user", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                description: $("#current-desc").val()
            })
        }).then((res) => {
            if (res.ok) {
                $("#current-desc").attr("placeholder", $("#current-desc").val())
                $("#current-desc").val("")
                $("#description-status").css("color", "green").text("Description successfully changed!").stop(true).show(1000).delay(3000).hide(1000)
            } else {
                $("#description-status").css("color", "red").text("Something went wrong.").stop(true).show(1000).delay(3000).hide(1000)
            }
        })
    })
    $("#delete-acc").click(() => {
        $("#follow-screen").fadeIn(200)
    })
    $("#delete-deny").click(() => {
        $("#follow-screen").fadeOut(150)
    })
    $("#delete-confirm").click((e) => {
        fetch("/delete-user", {
            method: "DELETE"
        }).then((res) => {
            if (res.ok) {
                window.location.href = "/home"
            } else {
                alert("Something went wrong when trying to delete your account!")
            }
        })
    })
})