function(properties, context) {
    
    var email_provider;
    var postmark;
    var sendgrid;
    var cc_emails = null;
    var bcc_emails = null;
    try {
        var email_provider = properties.email_provider.toLowerCase().trim();
        postmark = email_provider.includes("postmark");
        sendgrid = email_provider.includes("sendgrid") || postmark === false;
    } catch (err) {
        sendgrid = true;
    }
      
    if (sendgrid === true) {

        var log = "";


        // sample return for debugging
        // return {"error": typeof properties.to, "responseDump": JSON.stringify(properties.to.get(0, properties.to.length()))}

        // Create email recipient arrays
        
        if (properties.to === null || properties.to === undefined || properties.to === "") {
            returnError = "\"To email\" input must not be empty. Failed to send email."
            
            if (properties.throw_errors === true)
                throw returnError;
            return {
                error: "\"To email\" input must not be empty. Failed to send email.",
                success: false
            };
        }
    
        var to_emails = properties.to.split(",").map(s => s.trim());
        to_emails = deDuplicateArray(to_emails);
        if (properties.cc && properties.cc !== null && properties.cc !== undefined && properties.cc !== "") {
            var cc_emails = properties.cc.split(",").map(s => s.trim());
            cc_emails = deDuplicateArray(cc_emails);
        }
        if (properties.bcc && properties.bcc !== null && properties.bcc !== undefined && properties.bcc !== "") {
            var bcc_emails = properties.bcc.split(",").map(s => s.trim());
            bcc_emails = deDuplicateArray(bcc_emails);
        }

        var resp = removeDuplicateToEmailsAcrossArrays(to_emails, cc_emails, bcc_emails);
        cc_emails = resp[0];
        bcc_emails = resp[1];
        log += resp[2];
      
        to_emails = to_emails.map(toEmail => {return {"email": toEmail}});
        if (properties.cc) {
            cc_emails = cc_emails.map(toEmail => {return {"email": toEmail}});
        }
        if (properties.bcc) {
            bcc_emails = bcc_emails.map(toEmail => {return {"email": toEmail}});
        }

        var htmlString = properties.html;

        // check if there are attachments, and attach them to the email
        var attachments = [];
        var urls = [];
        if (properties.attachments !== null && properties.attachments.length() > 0) {
            properties.attachments.get(0, properties.attachments.length()).forEach(url => {
                // download base 64 for the file(s)
                if (!urls.includes(url))
                    var url_to_get = (!url.includes("http")) ? "https:" + url: url;

                    getBase64FromURL(url_to_get, function(base64, url) {
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
    

        var extraParams;
        if (properties.extra_parameters !== undefined && properties.extra_parameters !== null && properties.extra_parameters !== "") {
            try {
                extraParams = JSON.parse(properties.extra_parameters);
            } catch (err) {
                var returnError = "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";       
                console.error(returnError);
                console.error(err);
                // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";

                if (properties.throw_errors === true)
                    throw returnError;
                    
                return {
                    "success": false,
                    "error": returnError
                };
            }
            if (typeof extraParams !== "object") {
                // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";
                var returnError = "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";                

                if (properties.throw_errors === true)
                    throw returnError;

                return {
                    "success": false,
                    "error": returnError
                };
            }
        }


        // sample return for debugging
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
                    [{"to": to_emails, 
                    "cc": cc_emails, 
                    "bcc": bcc_emails,
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
    
        if (extraParams !== undefined && Array.isArray(extraParams))
            extraParams.forEach(paramObj => {
                var key = Object.keys(paramObj)[0];
               options.body[key] = paramObj[key];
            });
        else if (extraParams !== undefined)
            Object.keys(extraParams).forEach(key => {
               options.body[key] = extraParams[key];
            });


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


    // sample return for debugging
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
        

        if (properties.throw_errors === true && success === false)
            throw error;


        return {
            "error": error,
            //"log": log,
            //"requestDump": JSON.stringify(options),
            "success": success,
            "responseCode": response.statusCode,
            //"responseDump" : JSON.stringify(response)
        }
    }
    else if (postmark === true) {
        try {
            const postmark = require("postmark");
            const mime = require('mime-types');

            // https://sendgrid.com/docs/API_Reference/api_v3.html
            // https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html

            var log = "";

            var htmlString = properties.html;
            var plainText = properties.plain_text;



            if (properties.to === null || properties.to === undefined || properties.to === "") {
                returnError = "\"To email\" input must not be empty. Failed to send email."
                
                if (properties.throw_errors === true)
                    throw returnError;
                return {
                    error: "\"To email\" input must not be empty. Failed to send email.",
                    success: false
                };
            }
    
            var to_emails = properties.to.split(",").map(s => s.trim());
            to_emails = to_emails.map(toEmail => {return {"email": toEmail}});
            to_emails = to_emails.join(",");
            if (properties.cc && properties.cc !== null && properties.cc !== undefined && properties.cc !== "") {
                var cc_emails = properties.cc.split(",").map(s => s.trim());
                cc_emails = cc_emails.map(toEmail => {return {"email": toEmail}});
                cc_emails = cc_emails.join(",");
            }
            if (properties.bcc && properties.bcc !== null && properties.bcc !== undefined && properties.bcc !== "") {
                var bcc_emails = properties.bcc.split(",").map(s => s.trim());
                bcc_emails = bcc_emails.map(toEmail => {return {"email": toEmail}});
                bcc_emails = bcc_emails.join(",");
            }

            // check if there are attachments, and attach them to the email
            var attachments = [];
            var urls = [];
            if (properties.attachments !== null && properties.attachments.length() > 0) {
                properties.attachments.get(0, properties.attachments.length()).forEach(url => {
                    // download base 64 for the file(s)
                    if (!urls.includes(url))
                        var url_to_get = (!url.includes("http")) ? "https:" + url: url;
    
                        getBase64FromURL(url_to_get, function(base64, url) {
                            // handle weird urls
                            var filename = url.split('/').pop().split('#')[0].split('?')[0];
                            attachments.push({
                                "Name": filename,
                                "Content": base64,
                                "ContentType": mime.lookup(filename)
                            });
                            urls.push(url);
                        });
                });
            }


            // sample return for debugging
            // return {
            //     "error": JSON.stringify(attachments),
            //     "success": false,
            //     "responseCode": 1234,
            //     "responseDump" : ""
            // }
            
            var from = (properties.fromName !== "" && properties.fromName !== null && properties.fromName !== undefined) ? properties.fromName + " <" + properties.fromEmail + ">" : properties.fromEmail;

            var postmarkBody = {
                "From": from,
                "ReplyTo": properties.replyTo,
                "To": properties.to,
                "Cc": cc_emails,
                "Bcc": bcc_emails,
                "Subject": properties.subject,
                "TextBody": plainText,
                "HtmlBody": htmlString,
                "TrackOpens": true,
                "TrackLinks": "HtmlOnly",
                "Attachments": attachments,
                /*[{
                "Name": "readme.txt",
                "Content": "dGVzdCBjb250ZW50",
                "ContentType": "text/plain"
                },
                {
                "Name": "report.pdf",
                "Content": "dGVzdCBjb250ZW50",
                "ContentType": "application/octet-stream"
                }],*/
                "MessageStream": "outbound",
            }


            // delete empty fields from send email options JSON
            function cleanPostmarkBody() {
            if (properties.cc === null || properties.cc.length === 0)
                delete postmarkBody.cc;
            if (properties.bcc === null || properties.bcc.length === 0)
                delete postmarkBody.bcc;
            if (properties.replyTo === null || properties.replyTo.trim() === "")
                delete postmarkBody.ReplyTo;
            if (attachments.length === 0)
                delete postmarkBody.Attachments;
            }

            cleanPostmarkBody();


            var extraParams;
            if (properties.extra_parameters !== undefined && properties.extra_parameters !== null && properties.extra_parameters !== "") {
                try {
                    var returnError = "Unable to parse extra parameters in Postmark Send basic email action. Throwing error, email will not be sent.";
                    extraParams = JSON.parse(properties.extra_parameters);
                } catch (err) {
                    console.error(returnError);
                    console.error(err);
                    // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";
                    
                    if (properties.throw_errors === true)
                        throw returnError;

                    return {
                        "success": false,
                        "error": returnError
                    };
                }
                if (typeof extraParams !== "object") {
                    // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";
                    
                    if (properties.throw_errors === true)
                        throw returnError;
                        
                    return {
                        "success": false,
                        "error": returnError
                    };
                }
            }
    
            if (extraParams !== undefined && Array.isArray(extraParams))
                extraParams.forEach(paramObj => {
                    var key = Object.keys(paramObj)[0];
                    postmarkBody[key] = paramObj[key];
                });
            else if (extraParams !== undefined)
                Object.keys(extraParams).forEach(key => {
                    postmarkBody[key] = extraParams[key];
                });

        // sample return for debugging
        //  return {"error": "test"}
            var client = new postmark.ServerClient(context.keys["Postmark Server API Token"]);
            var ret;

            var result = context.async(async callback => {

                try {
                    var response = await client.sendEmail(
                        postmarkBody,
                        function(err, data) {
                            console.log(err)
                            console.log(data)

                            ret = {
                                "response" : data,
                            };
                            return ret;
                        }
                    );
                    callback(null, response);
                }
                catch (err) {
                    callback(err);
                }
            });

        // sample return for debugging
            // return {"error": "early return"}

            var success = ret.response.ErrorCode === 0;

            if (properties.throw_errors === true && success === false)
                throw JSON.stringify(ret);

            return {
                "success": success,
                "error": JSON.stringify(ret),
                //"responseDump": JSON.stringify(result),
                // "requestDump" : JSON.stringify(postmarkBody)
            };

        } catch (err) {
            
            if (properties.throw_errors === true)
                throw err.toString();

            return {
                //"responseDump": "error catch block",
                "error": err.toString()
            };
        }
    }
    

  // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  function deDuplicateArray(array) {
    if (array === null || array === undefined)
    return null;
    var seen = {};
    return array.filter(function(item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });    
  }
      
  function removeDuplicateToEmailsAcrossArrays(to, cc, bcc) {
    var log = "";
    var check_cc = cc !== null && cc !== undefined;
    var check_bcc = bcc !== null && bcc !== undefined;
    log += "check_cc: " + check_cc + "  check_bcc: " + check_bcc;
    if (check_cc || check_bcc)
      for (var i = 0; i < to.length; i++) {
        // log += "  loop 1: " + i + ", to: " + JSON.stringify(to) + ", typeof to: " + typeof to + ", typeof to[i]: " + typeof to[i] + ", to[i]: " +  JSON.stringify(to[i]) + ", cc.includes(to[i]): " + cc.includes(to[i]);
        log += ",  cc: " + JSON.stringify(cc);
        if (check_cc && cc.includes(to[i])) {
            log += "  loop 1: " + i + " cc before removal: " + cc;
            log += "  loop 1: " + i + " removing value " + cc[cc.indexOf(to[i])];
            cc.splice(cc.indexOf(to[i]), 1);
            log += "  loop 1: " + i + " cc after removal: " + cc;
        }
        if (check_bcc && bcc.includes(to[i]))
          bcc.splice(bcc.indexOf(to[i]), 1);
      }
    if (check_cc && check_bcc)
      for (var j = 0; j < cc.length; j++) {
        log += "  loop 2: " + i;
        if (bcc.includes(cc[j]))
          bcc.splice(bcc.indexOf(cc[j]), 1);
      }
    return [cc, bcc, log];
  }

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


}