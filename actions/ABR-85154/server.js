function(properties, context) {
      
    if (properties.email_provider === "Sendgrid") {


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
    
    	/* return {
            "responseDump": JSON.stringify(response)
        }*/
    	try {
            if (response.body.results !== undefined && response.body.results !== null)
                if (response.body.results.length > 0)
	                var emails  = response.body.results.map(result => result.from_email);
        } catch(err) {
        }
    
    	// if emails are not assigned by above WF, there was an error OR there were no emails
    	if (emails === undefined) {
            if (response.statusCode > 199 && response.statusCode < 300)
                return {
                    "success": true,
                    "responseDump": JSON.stringify(response),
                    "responseCode": response.statusCode,
                    "emails": []
                };
            else // error
                return {
                    "success": false,
                    "responseDump": JSON.stringify(response),
                    "responseCode": response.statusCode,
                    "emails": []
                };
        }
    	
    
    
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
            "responseDump" : JSON.stringify(response),
            "emails": emails
        };
    }
    else if (properties.email_provider === "Postmark") {
        
        // https://postmarkapp.com/developer/api/signatures-api#list-sender-signatures

        const options = {
            uri: "https://api.postmarkapp.com/senders?count=" + properties.count + "&offset=" + properties.offset,
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
        var emails = []
        try {
            if (response.body.SenderSignatures !== undefined && response.body.SenderSignatures !== null)
                if (response.body.SenderSignatures.length > 0)
                    emails  = response.body.SenderSignatures.map(result => result.EmailAddress);
        } catch(err) {

        }



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
            "responseDump" : JSON.stringify(response),
            "emails": emails
        }
    }



}