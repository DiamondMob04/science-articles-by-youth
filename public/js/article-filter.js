function refreshKeywords() {
    const keywords = $("#filter-keywords").val().replace(/[^0-9a-zA-Z\s]/g, "")
    const currPage = window.location.href.split("/").pop().split("?")[0]
    if (keywords.trim() === "") {
        return window.location.href = currPage
    }
    return window.location.href = `/${currPage}?tags=${keywords}`
}

// When the enter key is pressed and you're selecting the text field.
$(document).keyup((event) => {
    if ($("#filter-keywords").is(":focus") && event.key == "Enter") {
        refreshKeywords()
    }
})

// When the filter button is clicked.
$("#filter-submit").click(() => {
    refreshKeywords()
})