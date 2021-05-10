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
                uri: "https://api.sendgrid.com/v3/verified_senders",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + context.keys["API Key"]
                },
                json: true
            };


        //  return {"error": "test"}
            let response = context.request(options);

            /*return {
                "responseDump": JSON.stringify(response)
            }*/

        var verified;
        var id;
        var request;
        try {
            request = response.body.results.filter(result => result.from_email.toLowerCase() === properties.email)[0];
            id = request.id;
            verified = request.verified;
        } catch (err) {
            console.error(err);
            console.error("Failed to get request ID");
        }

            // check if response is 2XX
            // else, return error
            var success = false;
            var error = null;
            if (response.statusCode > 199 && response.statusCode < 300 && id !== null && id !== undefined) {
                success = true;
            }
            else {
                error = "Status Code: " + response.statusCode + " \nbody: " + JSON.stringify(response.body) + " \nid: " +  id;
            }

            return {
                "error": error,
                "success": success,
                "responseCode": response.statusCode,
                //"responseDump" : JSON.stringify(response),
                "id": id,
                "verified": verified
            };
    }
    else if (postmark === true) {
        
        // https://postmarkapp.com/developer/api/signatures-api#list-sender-signatures

        const options = {
            uri: "https://api.postmarkapp.com/senders?count=50&offset=0",
            method: "GET",
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

        var request;
        var request_id;
        var confirmed;
        try {
	        request = response.body.SenderSignatures.filter(result => result.EmailAddress.toLowerCase() === properties.email)[0]; 
            request_id = request.ID;
            confirmed = request.Confirmed;       
        } catch (err) {
            
        }


        // check if response is 2XX
        // else, return error
        var success = false;
        var error = null;
        if (response.statusCode > 199 && response.statusCode < 300) {
            success = true;
        }
        else {

        }

        return {
            "error": error,
            "success": success,
            "responseCode": response.statusCode,
            //"responseDump" : JSON.stringify(response),
            "verified": confirmed,
            "id": request_id
        }
    }



}