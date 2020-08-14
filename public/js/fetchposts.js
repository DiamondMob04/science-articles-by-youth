var currentSkip = 0
var limitation = 9

async function fetchPosts() {
    try {
        let response = await fetch(`/posts?skip=${currentSkip}&limit=${limitation}`)
        let json = await response.json()
        if (currentSkip == 0 && json.posts.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            return $("#err-message").text(`Could not find any articles.`)
        }
        $("#err-message").hide()
        if (!json.morePosts) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
        } else {
            currentSkip += limitation
        }
        for (let i = 0; i < json.posts.length; i++) {
            let post = json.posts[i]
            $(".article-gallery").append(`
                <article>
                    <h3 class="article-title">${post.title}</h3>
                    <h4 class="article-info">Created by ${post.author}</h4>
                    <img class="article-thumbnail" src="/img/space-bg.jpg">
                    <p class="article-desc">${post.contents}</p>
                    <div class="article-tags">
                        ${post.preformattedTags}
                    </div>
                    <button class="read-more" onclick="window.location.href='/article/${post.id}'">Read More</button>
                </article>`)
        }
        setTimeout(() => {
            $(".member-block").css("animation", "none")
        }, 1000)
    } catch(error) {
        $("#err-message").text(`Could not contact article database.`)
        throw new Error("Could not contact article database.")
    }
}

async function fetchUserPosts(id) {
    try {
        let response = await fetch(`/posts?skip=${currentSkip}&limit=${limitation}&owner=${id}`)
        let json = await response.json()
        if (currentSkip == 0 && json.posts.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            return $("#err-message").text(`Could not find any articles.`)
        }
        $("#err-message").hide()
        if (!json.morePosts) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
        } else {
            currentSkip += limitation
        }
        for (let i = 0; i < json.posts.length; i++) {
            let post = json.posts[i]
            $(".article-gallery").append(`
                <article>
                    <h3 class="article-title">${post.title}</h3>
                    <p class="article-desc">${post.contents}</p>
                    <div class="article-tags">
                        ${post.preformattedTags}
                    </div>
                    <button class="read-more" onclick="window.location.href='/article/${post.id}'">Read More</button>
                </article>`)
        }
        setTimeout(() => {
            $(".member-block").css("animation", "none")
        }, 1000)
    } catch(error) {
        $("#err-message").text(`Could not contact article database.`)
        throw new Error("Could not contact article database.")
    }
}