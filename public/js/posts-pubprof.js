var currentSkip = 0
var limitation = 3

const styleFormat = (word) => {
    return word.replace(/<[a-zA-Z]+>/g, "").replace(/\b[^\s]{18,}\b/g, (w) => { 
        return `<span style="word-break: break-all !important;">${w}</span>` 
    })
}

async function fetchOwnPosts(username) {
    try {
        let response = await fetch(`/posts?skip=${currentSkip}&limit=${limitation}&owner=${username}&unverified=false`)
        let json = await response.json()
        if (currentSkip == 0 && json.posts.length == 0) {
            $(".find-more").css({ transform: "scale(1)", background: "gray" }).attr("disabled", true)
            $("#search-bar").hide()
            $(".find-more").hide()
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
            post.imageLink = (post.thumbnail) ? `/image/${post.thumbnail}` : "/img/def-thumbnail.jpg"
            $(".article-gallery").append(`
            <article>
                <img class="article-thumbnail" src="${post.imageLink}" onerror="$(this).attr('src', '/img/def-thumbnail.jpg')" alt="Article thumbnail image">
                <div class="article-right">
                    <h3 class="article-title">${post.title}</h3>
                    <h4 class="article-info">${post.author} / ${post.timestamp} / ${post.comments}</h4>
                    <p class="article-desc">${post.contents}</p>
                    <div class="article-tags">
                        ${post.preformattedTags}
                    </div>
                    <button class="read-more" onclick="window.location.href='/article/${post.identifier}'">Read More</button>
                </div>
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