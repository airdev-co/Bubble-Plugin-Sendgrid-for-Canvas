function(properties, context) {


        const options = {
            uri: "https://api.sendgrid.com/v3/verified_senders",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + context.keys["API Key"]
            },
            body: {
                "nickname": properties.nickname,
                "from_email": properties.from_email,
                "from_name": properties.from_name,
                "reply_to": properties.reply_to,
                "address": properties.street_address_line_1 + properties.street_address_line_2,
                "city": properties.city,
                "country": properties.country
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
            "responseDump" : JSON.stringify(response)
        }



}