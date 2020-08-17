$(document).ready(async () => {
    $("#article-contents").html($("#article-contents").text().replace(/\n/g, "<br>"))
    const res = await fetch("/info")
    if (res.ok) {
        const json = await res.json()
        if (json.username === $("#author").text()) {
            $("#article-notice").text("This is your article. You can choose to edit or delete it at anytime. Alternatively, click on a comment to delete it.")
            $("#restricted").show()
            $("#edit-article").click(() => {
                window.location.href = `/edit/${$("#identifier").text()}`
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
        }
    }
})