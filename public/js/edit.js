var imageId = undefined;

const format = (word) => {
    // Replaces words longer than 18 characters to {thisformattinginstead}
    return word.replace(/<[a-zA-Z]+>/g, "").replace(/\b[^\s]{18,}\b/g, (w) => { 
        return `<span style="word-break: break-all !important;">${w}</span>` 
    })
}

const styleFormat = (word) => {
    return word.replace(/<[a-zA-Z]+>/g, "").replace(/\b[^\s]{18,}\b/g, (w) => { 
        return `<span style="word-break: break-all !important;">${w}</span>` 
    })
}

const toIdentifier = (word) => {
    return word.trim().toLowerCase().replace(/[^a-zA-Z]/g, "")
}

$(document).ready(async () => {
    const titleInput = $("#title-input")
    const contentsInput = $("#contents-input")
    const tagInput = $("#tag-input")
    const defaultTitle = "Title"
    const defaultContents = "Contents"
    titleInput.val($("#prev-title-input").text())
    contentsInput.val($("#prev-contents-input").text())
    if($("#prev-is-paper").text() === "true") {
        $("#is-paper").attr("checked", true)
    }
    let prevTags =  $("#prev-tag-input").text().split(" ")
    for (let i = 0; i < prevTags.length; i++) {
        $(`<p class="inserted-tag">${format(prevTags[i])}</p>`).insertBefore("#tag-example")
    }
    var info = undefined
    var json = undefined;
    try {
        info = await fetch("/info")
        json = await info.json()
    } catch (error) {
        window.location.href = "/login"
    }
    $(".article-info").text(`${$("#prev-author").text()} / January 1, 1970 / 0 Comments`)
    titleInput.on("input", () => {
        if (titleInput.val().length === 0) {
            $(".article-title").text(defaultTitle)
        }
        if ((titleInput.val().length > 30 || titleInput.val().length < 6) && titleInput.val().length !== 0) {
            titleInput.css("border", "1px solid red")
        } else {
            titleInput.css("border", "1px solid black")
        }
        if (titleInput.val().length <= 30) {
            $(".article-title").html(format(titleInput.val()))
        }
    })
    contentsInput.on("input", () => {
        if (contentsInput.val().length === 0) {
            $(".article-desc").text(defaultContents)
        }
        if (contentsInput.val().length < 200 && contentsInput.val().length !== 0) {
            contentsInput.css("border", "1px solid red")
        } else {
            contentsInput.css("border", "1px solid black")
        }
        if (contentsInput.val().length < 100) {
            $(".article-desc").html(styleFormat(contentsInput.val().substr(0, 100)))
        } else {
            $(".article-desc").html(styleFormat(contentsInput.val().substr(0, 100)) + "...")
        }
    })
    tagInput.on("input", () => {
        if ((tagInput.val().length < 3 || tagInput.val().length > 16) && tagInput.val().length !== 0) {
            tagInput.css("border", "1px solid red")
        } else {
            tagInput.val(tagInput.val().replace(/\s/g, ""))
            tagInput.css("border", "1px solid black")
        }
        if (tagInput.val().length <= 16) {
            $("#tag-example").text(format(tagInput.val()))
        }
    })
    $("#submit-tag").click(() => {
        if (tagInput.val().length >= 3 && tagInput.val().length <= 16) {
            $(`<p class="inserted-tag">${format(tagInput.val())}</p>`).insertBefore("#tag-example")
            tagInput.val("")
            $("#tag-example").text("")
        }
    })
    $("#delete-tag").click(() => {
        $(".inserted-tag").each(function() {
            if ($(this).text().toLowerCase() === tagInput.val().toLowerCase() ) {
                $(this).remove()
                tagInput.val("")
                $("#tag-example").text("")
            }
        })
    })
    $("#thumbnail-form").submit((event) => {
        event.preventDefault()
        let photo = document.querySelector("#file-input").files[0];
        let formData = new FormData();
        formData.append("image", photo);
        fetch('/image', {
            method: "POST", 
            body: formData
        }).then((json) => { return json.json() }).then((parsed) => {
            if (!parsed.error) {
                $(".article-thumbnail").attr("src", `/image/${parsed.id}`).attr("alt", parsed.id)
                imageId = parsed.id
            } else {
                alert("That file is too large or invalid.")
            }
        });
    })
    $("#publish-article").click(async () => {
        let formattedTags = ""
        $(".inserted-tag").each(function() {
            formattedTags += $(this).text() + " "
        })
        if (toIdentifier(titleInput.val()) !== toIdentifier($("#prev-title-input").text())) {
            const res = await fetch("/article/" + toIdentifier(titleInput.val()))
            if (res.ok) {
                return $("#status-message").stop(true).text("Your title is already too close to the name of an existing article.").css("color", "red").fadeIn(1000).delay(3000).fadeOut(1000)
            }
        }
        fetch(`/post/${toIdentifier($("#prev-title-input").text())}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleInput.val(), 
                thumbnail: imageId, 
                contents: contentsInput.val(), 
                tags: formattedTags,
                isPaper: $("#is-paper").is(":checked")
            })
        }).then(async (res) => {
            if (res.ok) {
                let link = await res.json()
                window.location.href = link.url
            } else {
                $("#status-message").stop(true).text("Something went wrong when trying to save your article. Ensure that all limitations are met.").css("color", "red").fadeIn(1000).delay(3000).fadeOut(1000)
            }
        })
    })
    titleInput.trigger("input")
    contentsInput.trigger("input")
})