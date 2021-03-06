$(document).ready(async () => {
    var isVerified = $("#verified").text()
    const identifier = $("#identifier").text()
    $("#article-title").html($("#article-title").text())
    $("#article-contents").html($("#article-contents").text().replace(/\n/g, "<br>"))
    $("#verify-article").click(() => {
        window.location.href = `/verify/${identifier}`
    })
    $("#edit-article").click(() => {
        window.location.href = `/edit/${identifier}`
    })
    $(".author-pfp").click(function() {
        window.location.href = "/user/" + $(this).parent().find(".author-text").text()
    })
    $(".author-text").click(function() {
        window.location.href = "/user/" + $(this).text()
    })
    $("#delete-confirm").click(() => {
        fetch("/delete-article", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({identifier: $("#identifier").text()})
        }).then((res) => {
            if (res.ok) {
                window.location.href = "/blog"
            } else {
                alert("Something went wrong when trying to delete your article!")
            }
        })
    })
    $("#delete-article").click(() => {
        $("#follow-screen").fadeIn(250)
        $("#comment-delete-warning").hide()
        $("#delete-warning").show()
    })
    $("#delete-deny").click(() => {
        $("#follow-screen").fadeOut(250)
    })
    if (isVerified === "true") {
        $("#preview").remove()
    }
    const res = await fetch("/info")
    if (res.ok) {
        const json = await res.json()
        if (json.role !== "admin") {
            $("#verify-article").remove()
        }
        if (json.username === $(".author-text").text()) {
            $("#article-notice").text("This is your article. You can choose to edit or delete it at anytime.")
            $("#restricted").show()
        } else if (json.role === "admin") {
            $("#article-notice").text("Since you are an administrator, you can choose to edit or delete this article at anytime.")
            $("#restricted").show()
        } else {
            $("#restricted").remove()
        }
        $("#verified").remove()
        $("#indentifier").remove()
    }
})