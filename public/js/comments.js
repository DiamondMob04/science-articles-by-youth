var currentSkip = 0
var limitation = 5
var currentSelectedComment = undefined

const sanitizeHTML = (word) => {
    return word.replace(/<[a-zA-Z]+>/g, "")
}
function updateComments(user) {
    if (user === undefined) return;
    $(".clickable").click(function() {
        window.location.href = "/user/" + $(this).parent().find(".comment-name").text()
    })
    $(".comment-name").click(function() {
        window.location.href = "/user/" + $(this).text()
    })
    if (user.username === $("#author").text() || user.role === "admin") {
        $(".comment-delete").click(function() {
            let container = $(this).parents().eq(2)
            $("#follow-screen").fadeIn(250)
            $("#comment-delete-info").text(container.find(".comment-contents").text())
            $("#comment-delete-warning").show()
            $("#delete-warning").hide()
            currentSelectedMessage = container
        })
    } else {
        $(".comment-delete").remove()
    }
}

async function fetchComments() {
    try {
        const splitLink = location.href.split("/")
        let response = await fetch(`/comments/${splitLink[splitLink.length - 1]}?skip=${currentSkip}&limit=${limitation}`)
        let json = await response.json()
        if (currentSkip == 0 && json.comments.length == 0) {
            let res = await fetch("/info")
            if (!res.ok) {
                $("#other-comments").append("<h3 class='no-comments'>There are currently no comments.</h3>")
            } else {
                $("#other-comments").hide()
            }
            return $(".find-more").hide()
        }
        if (!json.moreComments) {
            $(".find-more").hide()
        } else {
            currentSkip += limitation
        }
        let textBlock = ""
        for (let i = 0; i < json.comments.length; i++) {
            let comment = json.comments[i]
           textBlock += `
           <div class="message-content public-message">
                <img class="clickable user-pfp" src="/avatar/${comment.author}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
                <div class="message-content-right">
                    <span class="comment-name">${comment.author}</span>
                    <span class="comment-timestamp">${comment.timestamp}<span class="comment-delete">Delete</span></span>
                    <p class="comment-contents">${comment.contents}</p>
                    <span class="comment-id" style="display: none;">${comment.commentId}</span>
                </div>
            </div>`
        }
        $("#other-comments").append(textBlock)
        let infoResponse = await fetch("/info")
        if (infoResponse.ok) {
            let user = await infoResponse.json()
            updateComments(user)
        } else {
            $(".comment-delete").remove()
        }
    } catch (error) {
        console.log(error)
    }
}

var currentUserUsername = undefined
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

$(document).ready(async () => {
    const res = await fetch("/info")
    var user = undefined
    if (res.ok) {
        user = await res.json()
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
        return
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
                $("#other-comments").show()
                let currentDate = new Date()
                $("#other-comments").prepend(`
                <div class="message-content public-message">
                     <img class="user-pfp clickable" src="/avatar/${user.username}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
                     <div class="message-content-right">
                         <span class="comment-name">${user.username}</span>
                         <span class="comment-timestamp">${`${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`}<span class="comment-delete">Delete</span></span>
                         <p class="comment-contents">${sanitizeHTML($("#message-box").val())}</p>
                         <span class="comment-id" style="display: none;">${parsed.messageId}</span>
                     </div>
                </div>`)
                updateComments(user)
                $("#message-box").val("")
                $("#status-message").stop(true).text("Your message has been successfully sent!").css({display: "block", color: "green"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            } else {
                const error = await res.json()
                $("#status-message").stop(true).text(error.error).css({display: "block", color: "red"}).hide().fadeIn(1000).delay(3000).fadeOut(1000)
            }
        })
    })
    updateComments(user)
    if (user.username === $("#author").text() || user.role === "admin") {
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
    } else {
        $(".comment-delete").remove()
    }
})