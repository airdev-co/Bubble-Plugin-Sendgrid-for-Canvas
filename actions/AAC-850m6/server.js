    function(properties, context) {

        var log;

        // Create email recipient arrays
        // return {"error": typeof properties.to, "responseDump": JSON.stringify(properties.to.get(0, properties.to.length()))}
        /*
        var to  = [];
        properties.to.get(0, properties.to.length()).forEach(email => to.push({"email": email}));
        var cc  = [];
        if (properties.cc !== null && properties.cc.length() > 0)
            properties.cc.get(0, properties.cc.length()).forEach(email => cc.push({"email": email}));
        var bcc  = [];
        if (properties.bcc !== null && properties.bcc.length() > 0)
            properties.bcc.get(0, properties.bcc.length()).forEach(email => bcc.push({"email": email}));
            */
        
        if (to === null)
            return {
                error: "To email must not be empty",
                success: false
            };
        
        var to = properties.to.split(",").map(s => s.trim());
        to = to.map(toEmail => {return {"email": toEmail}});
        if (properties.cc) {
            var cc = properties.cc.split(",").map(s => s.trim());
            cc = cc.map(toEmail => {return {"email": toEmail}});
        }
        if (properties.bcc) {
            var bcc = properties.bcc.split(",").map(s => s.trim());
            bcc = bcc.map(toEmail => {return {"email": toEmail}});
        }

        var htmlString = properties.html;//.replace(/\n/g, "");


        // Function to download file and convert to base64
        function getBase64FromURL(url, callback) {

            var axios = require("axios");

            let image = context.async(async callback => {   
                var image = await axios.get(url, {responseType: 'arraybuffer'});
                callback(null, image);
            });

            // log += Object.keys(image).join();
            log += JSON.stringify(image.headers);

            let filebase64 = Buffer.from(image.data).toString('base64');

            // attachments.push("test1");
            callback(filebase64, url);
        }

        // check if there are attachments
        var attachments = [];
        var urls = [];
        if (properties.attachments !== null && properties.attachments.length() > 0) {
            properties.attachments.get(0, properties.attachments.length()).forEach(url => {
                // download base 64 for the file(s)
                if (!urls.includes(url))
                    getBase64FromURL("https:" + url, function(base64, url) {
                        // handle weird urls
                        var filename = url.split('/').pop().split('#')[0].split('?')[0];
                        attachments.push({
                            "content": base64,
                            "filename": filename
                        });
                        urls.push(url);
                    });
            });
        }


        // return {
        //     "error": JSON.stringify(attachments),
        //     "success": false,
        //     "responseCode": 1234,
        //     "responseDump" : ""
        // }
        const options = {
            uri: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + context.keys["API Key"]
            },
            body: {
                "personalizations": 
                    [{"to": to, 
                    "cc": cc, 
                    "bcc": bcc,
                    "subject": properties.subject}], 
                "from": {"email": properties.fromEmail,
                         "name": properties.fromName}, 
                "reply_to": {"email": properties.replyTo, 
                            "name": properties.replyToName}, 
                "content":[{       
                    "type": "text/html", 
                    "value": htmlString     
                }],
                "attachments": attachments
            },
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


        // delete empty fields from HTTP request options JSON
        if (properties.cc === null || properties.cc.length === 0)
            delete options.body.personalizations[0].cc;
        if (properties.bcc === null || properties.bcc.length === 0)
            delete options.body.personalizations[0].bcc;
        if (properties.replyTo === null || properties.replyTo.trim() === "")
            delete options.body["reply_to"];
        else if (options.body["reply_to"] !== null && options.body["reply_to"] !== undefined && (properties.replyToName === null || properties.replyToName.trim() === ""))
            delete options.body["reply_to"].name;
        if (properties.fromName === null || properties.fromName.trim() === "")
            delete options.body.from.name;
        if (attachments.length === 0)
            delete options.body.attachments;

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