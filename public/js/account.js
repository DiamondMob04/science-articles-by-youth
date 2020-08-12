$(document).ready(async () => {
    const res = await fetch("/info")
    const json = await res.json()
    if (json.hasAvatar) {
        $("#current-prof-pic").attr("src", `/avatar/${json._id}`)
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
                $("#username-status").css("color", "green").html("Username successfully changed!").stop().show(1000).delay(3000).hide(1000)
            } else {
                $("#username-status").css("color", "red").html("Something went wrong.").stop().show(1000).delay(3000).hide(1000)
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
                $("#description-status").css("color", "green").html("Description successfully changed!").stop().show(1000).delay(3000).hide(1000)
            } else {
                $("#description-status").css("color", "red").html("Something went wrong.").stop().show(1000).delay(3000).hide(1000)
            }
        })
    })
})