function(properties, context) {


        const options = {
            uri: "https://api.sendgrid.com/v3/mail_settings",
            method: "GET",
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