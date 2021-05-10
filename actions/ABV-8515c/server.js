function(properties, context) {
    
    var email_provider;
    var postmark;
    var sendgrid;
    try {
        var email_provider = properties.email_provider.toLowerCase().trim();
        postmark = email_provider.includes("postmark");
        sendgrid = email_provider.includes("sendgrid") || postmark === false;
    } catch (err) {
        sendgrid = true;
    }
      
    if (sendgrid === true) {

        const options = {
            uri: "https://api.sendgrid.com/v3/verified_senders/resend/" + properties.id,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + context.keys["API Key"]
            },
            json: true
        };


    //  return {"error": "test"}
        let response = context.request(options);
        // check if response is 2XX
        // else, return error
        var success = false;
        var error = null;
        if (response.statusCode > 199 && response.statusCode < 300) {
            success = true;
        }
        else {
            error = "Status Code: " + response.statusCode + " \nbody: " + JSON.stringify(response.body);
        }
        return {
            "error": error,
            "success": success,
            "responseCode": response.statusCode,
            //"responseDump" : JSON.stringify(response)
        }
    }
    else if (postmark === true) {

        // https://postmarkapp.com/developer/api/signatures-api#sender-signature

        const options = {
            uri: "https://api.postmarkapp.com/senders/" + properties.id + "/resend",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-Postmark-Account-Token": context.keys["Postmark Account API Token"]
            },
            json: true
        };


        //  return {"error": "test"}
        let response = context.request(options);

        /* return {
                "responseDump": JSON.stringify(response)
            }*/



        // check if response is 2XX
        // else, return error
        var success = false;
        var error = null;
        if (response.statusCode > 199 && response.statusCode < 300) {
            success = true;
        }
        else {
            error = "Status Code: " + response.statusCode + " \nbody: " + JSON.stringify(response.body);
        }

        return {
            "error": error,
            "success": success,
            "responseCode": response.statusCode,
            //"responseDump" : JSON.stringify(response)
        }

    }
    
}