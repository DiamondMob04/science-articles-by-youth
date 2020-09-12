// When the filter button is clicked.
$("#filter-submit").click(() => {
    const keywords = $("#filter-keywords").val().replace(/[^0-9a-zA-Z\s]/g, "")
    const linkEnd = window.location.href.split("/").pop()
    if (keywords.trim() === "") {
        return window.location.href = linkEnd
    }
    return window.location.href = `/blog?tags=${keywords}`
})