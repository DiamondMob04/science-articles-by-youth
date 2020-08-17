var currentSkip = 0
var limitation = 5

async function fetchComments() {
    try {
        const splitLink = location.href.split("/")
        let response = await fetch(`/comments/${splitLink[splitLink.length - 1]}?skip=${currentSkip}&limit=${limitation}`)
        let json = await response.json()
        if (currentSkip == 0 && json.comments.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            return $("#comments-message").text(`This article has no comments yet.`)
        }
        $("#comments-message").hide()
        if (!json.moreComments) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
        } else {
            currentSkip += limitation
        }
        let textBlock = ""
        for (let i = 0; i < json.comments.length; i++) {
            let comment = json.comments[i]
           textBlock += `
           <div class="message-content public-message">
                <img class="user-pfp" src="/avatar/${comment.author}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
                <div class="message-content-right">
                    <span class="comment-name">${comment.author}</span>
                    <p class="comment-contents">${comment.contents}</p>
                </div>
                <span class="comment-id" style="display: none;">${comment.commentId}</span>
            </div>`
        }
        $("#other-comments").append(textBlock)
        $(".public-message").hover(function() {
            $(this).css("cursor", "pointer")
        })
        $(".public-message").click(function() {
            $("#follow-screen").fadeIn(250)
            $("#comment-delete-info").text($(this).find(".comment-contents").text())
            $("#comment-delete-warning").show()
            $("#delete-warning").hide()
            currentSelectedMessage = $(this)
        })
    } catch(error) {
        $("#comments-message").text(`Could not contact comment database.`)
        throw new Error("Could not contact comment database.")
    }
}

var currentUserUsername = undefined
var currentSelectedComment = undefined

$(document).ready(async () => {
    const res = await fetch("/info")
    if (res.ok) {
        const user = await res.json()
        currentUserUsername = user.username
        $("#insert-template").append(`
        <div class="user-message-box">
            <p id="message-name">Want to leave a message? Write a comment as ${user.username}:</p>
            <div class="message-content" style="margin: 1vh 0 !important;">
                <img class="user-pfp" src="/avatar/${user.username}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
                <textarea id="message-box" placeholder="Type your comment message here!"></textarea>
            </div>
            <button id="send-comment">Send</button>
            <br><span id="status-message"></span>
        </div>`)
    } else {
        $("#comments-section").append(`<p style='margin-top: 1vh'>You must be logged in to post comments.</p>`)
    }
    $("#send-comment").click(() => {
        const splitLink = location.href.split("/")
        fetch(`/comment/${splitLink[splitLink.length - 1]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: $("#message-box").val()
            })
        }).then(async (res) => {
            if (res.ok) {
                const parsed = await res.json()
                $("#other-comments").prepend(`
                <div class="message-content public-message">
                     <img class="user-pfp" src="/avatar/${currentUserUsername}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
                     <div class="message-content-right">
                         <span class="comment-name">${currentUserUsername}</span>
                         <p class="comment-contents">${$("#message-box").val()}</p>
                     </div>
                     <span class="comment-id" style="display: none;">${parsed.messageId}</span>
                </div>`)
                $(".public-message").hover(function() {
                    $(this).css("cursor", "pointer")
                })
                $(".public-message").click(function() {
                    $("#follow-screen").fadeIn(250)
                    $("#comment-delete-info").text($(this).find(".comment-contents").text())
                    $("#comment-delete-warning").show()
                    $("#delete-warning").hide()
                    currentSelectedMessage = $(this)
                })
                $("#comments-message").hide()
                $("#message-box").val("")
                $("#status-message").stop(true).text("Your message has been successfully sent!").css({display: "block", color: "green"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            } else {
                const error = await res.json()
                $("#status-message").stop(true).text(error.error).css({display: "block", color: "red"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            }
        })
    })
    if (currentUserUsername == $("#author").text()) {
        $(".public-message").hover(function() {
            $(this).css("cursor", "pointer")
        })
        $(".public-message").click(function() {
            $("#follow-screen").fadeIn(250)
            $("#comment-delete-info").text($(this).find(".comment-contents").text())
            $("#comment-delete-warning").show()
            $("#delete-warning").hide()
            currentSelectedMessage = $(this)
        })
        $("#comment-delete-confirm").click(() => {
            const splitLink = location.href.split("/")
            fetch("/delete-comment", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({identifier: splitLink[splitLink.length - 1], messageId: currentSelectedMessage.find(".comment-id").text()})
            }).then((res) => {
                if (res.ok) {
                    currentSelectedMessage.remove()
                    $("#follow-screen").fadeOut(250)
                    if ($(".public-message").length === 0) {
                        window.location.reload()
                    }
                } else {
                    alert("Something went wrong when trying to delete that comment.")
                }
            })
        })
        $("#comment-delete-deny").click(() => {
            $("#follow-screen").fadeOut(250)
        })
    }
})