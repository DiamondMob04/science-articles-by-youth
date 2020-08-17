var currentSkip = 0
var limitation = 5

async function fetchComments() {
    try {
        const splitLink = location.href.split("/")
        let response = await fetch(`/comments/${splitLink[splitLink.length - 1]}?skip=${currentSkip}&limit=${limitation}`)
        let json = await response.json()
        console.log(json)
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
           <div class="message-content">
                <img class="user-pfp" src="/avatar/${comment.author}">
                <div class="message-content-right">
                    <span class="comment-name">${comment.author}</span>
                    <p class="comment-contents">${comment.contents}</p>
                </div>
            </div>`
        }
        $("#other-comments").append(textBlock)
    } catch(error) {
        $("#comments-message").text(`Could not contact comment database.`)
        throw new Error("Could not contact comment database.")
    }
}

$(document).ready(async () => {
    const res = await fetch("/info")
    if (res.ok) {
        const user = await res.json()
        $("#insert-template").append(`
        <div class="user-message-box">
            <p id="message-name">Want to leave a message? Write a comment as ${user.username}:</p>
            <div class="message-content" style="margin: 1vh 0 !important;">
                <img class="user-pfp" src="/avatar/${user.username}">
                <textarea id="message-box" placeholder="Type your comment message here!"></textarea>
            </div>
            <button id="send-comment">Send</button>
            <br><span id="status-message"></span>
            <h3 id="comments-message"></h3>
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
                $("#message-box").val("")
                $("#status-message").stop(true).text("Your message has been successfully sent!").css({display: "block", color: "green"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            } else {
                const error = await res.json()
                $("#status-message").stop(true).text(error.error).css({display: "block", color: "red"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            }
        })
    })
})