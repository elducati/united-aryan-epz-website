function sendEmail() {
    // get input values from contact form.
    var from = document.getElementById("from").value;
    var subject = document.getElementById("subject").value;
    var body = document.getElementById("body").value;
    var error_message = document.getElementById("error_message");
    error_message.style.padding = "10px";

    var text;

    if (from.indexOf("@") == -1 || from.length < 6) {
        text = "Please enter valid email";
        error_message.innerHTML = text;
        return false;
    }
    if (subject.length < 5) {
        text = "Subject is too small";
        error_message.innerHTML = text;
        return false;
    }
    if (body.length <= 5) {
        text = "Your message should be more than 5 characters";
        error_message.innerHTML = text;
        return false;
    }


    Email.send({
        SecureToken: "c1024365-e690-4a1f-9223-a3c1513dd9f1", //This is the token used to encrypt SMTP credentials
        To: 'info@unitedaryan.net',
        From: from,
        Subject: subject,
        Body: body
    }).then(
        // message => alert("Send Succesfully")
    );
    document.getElementById("form").reset();



    return true;
}