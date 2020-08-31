var currentSkip = 0
var limitation = 9

async function fetchMembers() {
    try {
        let response = await fetch(`/users?skip=${currentSkip}&limit=${limitation}`)
        let json = await response.json()
        $("#template-member").remove()
        if (currentSkip == 0 && json.users.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            return $("#err-message").text(`Could not find any users.`)
        }
        $("#err-message").remove()
        if (!json.moreUsers) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
        } else {
            currentSkip += limitation
        }
        for (let i = 0; i < json.users.length; i++) {
            let user = json.users[i]
            $(".triple-threat").append(`
            <div class="member-block" onclick="window.location.href = '/user/${user.username}'">
            <img class="banner" src="/img/def-thumbnail.jpg">
            <div class="overlay"></div>
            <h2 class="prof-username${user.role === "admin" ? " admin-color" : ""}">${user.username}</h2>
            <img class="prof-avatar" src="/avatar/${user.username}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
            </div>`)
        }
    } catch(error) {
        $("#err-message").text(`Could not contact user database.`)
        throw new Error("Could not contact user database.")
    }
}

async function fetchAdmins() {
    try {
        let response = await fetch(`/users?skip=${currentSkip}&limit=${limitation}&admin=true`)
        let json = await response.json()
        $("#template-member").remove()
        if (currentSkip == 0 && json.users.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            return $("#err-message").text(`Could not find any users.`)
        }
        $("#err-message").remove()
        if (!json.moreUsers) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
        } else {
            currentSkip += limitation
        }
        for (let i = 0; i < json.users.length; i++) {
            let user = json.users[i]
            $(".triple-threat").append(`
            <div class="member-block" onclick="window.location.href = '/user/${user.username}'">
            <img class="banner" src="/img/def-thumbnail.jpg">
            <div class="overlay"></div>
            <h2 class="prof-username admin-color">${user.username}</h2>
            <img class="prof-avatar" src="/avatar/${user.username}" onerror="$(this).attr('src', '/img/avatar.jpg')" alt="User profile picture">
            </div`)
        }
    } catch(error) {
        $("#err-message").text(`Could not contact user database.`)
        throw new Error("Could not contact user database.")
    }
}

$(".find-more").click(() => {
    fetchMembers()
})