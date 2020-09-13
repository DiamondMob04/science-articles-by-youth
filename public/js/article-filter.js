// When the filter button is clicked.
$("#filter-submit").click(() => {
    const keywords = $("#filter-keywords").val().replace(/[^0-9a-zA-Z\s]/g, "")
    const currPage = window.location.href.split("/").pop().split("?")[0]
    if (keywords.trim() === "") {
        return window.location.href = currPage
    }
    return window.location.href = `/${currPage}?tags=${keywords}`
})