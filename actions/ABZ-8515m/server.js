    function(properties, context) {

        var log;
        
        const options = {
            uri: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + context.keys["API Key"]
            },
            body: JSON.parse(properties.html),
            /* sample body: 
                {
                    "personalizations": 
                    [{"to": [{"email": "c.anderson76@gmail.com"}], 
                    "cc":[{"email": "c.anderson76+1@gmail.com"}], 
                    "bcc": [{"email": "c.anderson76+2@gmail.com"}],
                    "reply_to": [{"email": "dev@airdev.co",
                                "name": "Dev"}], 
                    "subject": "Hello, World!"}], 
                "from": {"email": "dev@airdev.co",
                        "name": "Dev"}, 
                "content":[{       
                    "type": "text/html", 
                    "value": "INSERT EMAIL HTML CONTENT HERE"     
                }] 
            }
            */
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