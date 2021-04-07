function(properties, context) {


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
            "responseDump" : JSON.stringify(response),
            "id": id,
            "verified": verified
        }



}