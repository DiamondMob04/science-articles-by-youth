$(document).ready(async () => {

    const userAuth = await fetch("/info")
    if (!userAuth.ok) {
        $("#editor-form").remove()
        $("#ambassador-form").remove()
        $(".form-message").text("You are not currently logged in. Only authenticated users can submit a form.")
    } else {
        const recentlySent = await fetch("/email/recently-sent")
        if (recentlySent.ok) {
            $("#editor-message").hide()
            $("#ambassador-message").hide()
        } else {
            $("#editor-form").remove()
            $("#ambassador-form").remove()
        }
    }

    $(".text-block").css({opacity: 0.1})
    $(".text-block").waypoint(function(direction) {
        $(this[0, "element"]).addClass("fade-in")
    }, { offset: "95%" })

    /*
    edit-name
    edit-email
    edit-exp
    edit-write-exp
    edit-feedback
    edit-changes
    edit-why
    */
    $("#editor-form").submit((e) => {
        e.preventDefault()
        $("#editor-form").hide()
        $("#ambassador-form").hide()
        $("#ambassador-message").show()
        $("#editor-message").text("We are currently sending in your form...").fadeIn(1000)
        fetch("/email/editor-form", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: $("#edit-name").val(),
                email: $("#edit-email").val(),
                editExperience: $("#edit-exp").val(),
                writeExperience: $("#edit-write-exp").val(),
                feedback: $("#edit-feedback").val(),
                changes: $("#edit-changes").val(),
                reason: $("#edit-why").val()
            })
        }).then((res) => {
            $(".text-block").css({opacity: 1})
            if (res.ok) {
                $("#editor-message").text("Your form has been successfully sent in! We will take a look and send you back an email!")
            } else {
                $("#editor-message").text("Your form was not sent in successfully. Try reloading your page and trying again!")
            }
        })
    })
    /*
    amb-name
    amb-email
    amb-article
    amb-exp
    amb-attract
    amb-describe-say
    amb-social-media
    */
    $("#ambassador-form").submit((e) => {
        e.preventDefault()
        $("#ambassador-form").hide()
        $("#editor-form").hide()
        $("#editor-message").show()
        $("#ambassador-message").text("We are currently sending in your form...").fadeIn(1000)
        fetch("/email/ambassador-form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: $("#amb-name").val(),
                email: $("#amb-email").val(),
                ambExperience: $("#amb-exp").val(),
                publishing: $("#amb-article").val(),
                attract: $("#amb-attract").val(),
                describe: $("#amb-describe-say").val(),
                socialMedia: $("#amb-social-media").val()
            })
        }).then((res) => {
            $(".text-block").css({opacity: 1})
            if (res.ok) {
                $("#ambassador-message").text("Your form has been successfully sent in! We will take a look and send you back an email!").fadeIn(1000)
            } else {
                $("#ambassador-message").text("Your form was not sent in successfully. Try reloading your page and trying again!").fadeIn(1000)
            }
        })
    })
})