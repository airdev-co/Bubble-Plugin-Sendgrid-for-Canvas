function(properties, context) {

// https://sendgrid.com/docs/API_Reference/api_v3.html
// https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html


    var log = "";
    
    var buttonCSS = properties.button ? ".btn-primary {text-decoration: none; color: #FFF; background-color: " + properties.buttonColor + "; border: solid " + properties.buttonColor + "; border-width: 10px 20px; line-height: 2; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; }" : "";

    var buttonHTML = properties.button ? '<tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td class="content-block" style="margin: 0;padding: 0 0 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;line-height: 1.5;"><a class="btn-primary" href="' + properties.buttonLink + '" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;color: #FFF;text-decoration: none;background-color: ' + properties.buttonColor + ';border: solid ' + properties.buttonColor + ';border-width: 10px 20px;line-height: 2;font-weight: bold;text-align: center;cursor: pointer;display: inline-block;border-radius: 5px;text-transform: capitalize;">' + properties.buttonText + '</a></td> </tr>' : "";

    // only include signature if it isn't empty
    var signature = (properties.signature !== null && properties.signature !== undefined) ? properties.signature : "";
   
    var plainText = properties.body;
    
    if (signature !== "") 
        plainText = plainText + "\n" + signature; 
    
    if (properties.signature !== null) {
        signature = '<tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td class="content-block" style="margin: 0;padding: 0 0 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;line-height: 1.5;">' + signature + '</td> </tr>';
    } 
    
    var logo = properties.logo;
    if (!logo.includes("http"))
        logo = logo.replace("//", "https://");


    htmlString = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <head style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <title style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"></title> <meta name="viewport" content="width=device-width" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <style type="text/css" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> * {margin: 0; padding: 0; font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; } img {max-width: 100%; } body {-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6; } table td {vertical-align: top; } body {background-color: #f6f6f6; } .body-wrap {background-color: #f6f6f6; width: 100%; } .container {display: block !important; max-width: 600px !important; margin: 0 auto !important; /* makes it centered */ clear: both !important; } .content {max-width: 600px; margin: 0 auto; display: block; padding: 20px; } .main {background: #fff; border: 1px solid #e9e9e9; border-radius: 3px; } .content-wrap {padding: 20px; } .content-block {padding: 0 0 20px; line-height: 1.5; } .header {width: 100%; margin-bottom: 20px; } .footer {width: 100%; clear: both; color: #999; padding: 20px; } .footer a {color: #999; } .footer p, .footer a, .footer unsubscribe, .footer td {font-size: 12px; } .column-left {float: left; width: 50%; } .column-right {float: left; width: 50%; } h1, h2, h3 {font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; color: #000; margin: 40px 0 0; line-height: 1.2; font-weight: 400; } h1 {font-size: 32px; font-weight: 500; } h2 {font-size: 24px; } h3 {font-size: 18px; } h4 {font-size: 14px; font-weight: 600; } p, ul, ol {margin-bottom: 10px; font-weight: normal; } p li, ul li, ol li {margin-left: 5px; list-style-position: inside; } a {color: #348eda; text-decoration: underline; } ' + buttonCSS + '.last {margin-bottom: 0; } .first {margin-top: 0; } .padding {padding: 10px 0; } .aligncenter {text-align: center; } .alignright {text-align: right; } .alignleft {text-align: left; } .clear {clear: both; } .alert {font-size: 16px; color: #fff; font-weight: 500; padding: 20px; text-align: center; border-radius: 3px 3px 0 0; } .alert a {color: #fff; text-decoration: none; font-weight: 500; font-size: 16px; } .alert.alert-warning {background: #ff9f00; } .alert.alert-bad {background: #d0021b; } .alert.alert-good {background: #68b90f; } .invoice {margin: 40px auto; text-align: left; width: 80%; } .invoice td {padding: 5px 0; } .invoice .invoice-items {width: 100%; } .invoice .invoice-items td {border-top: #eee 1px solid; } .invoice .invoice-items .total td {border-top: 2px solid #333; border-bottom: 2px solid #333; font-weight: 700; } @media only screen and (max-width: 640px) {h1, h2, h3, h4 {font-weight: 600 !important; margin: 20px 0 5px !important; } h1 {font-size: 22px !important; } h2 {font-size: 18px !important; } h3 {font-size: 16px !important; } .container {width: 100% !important; } .content, .content-wrapper {padding: 10px !important; } .invoice {width: 100% !important; } } </style> </head> <body style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;-webkit-font-smoothing: antialiased;-webkit-text-size-adjust: none;height: 100%;line-height: 1.6;background-color: #f6f6f6;width: 100% !important;"> <table class="body-wrap" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;background-color: #f6f6f6;width: 100%;"> <tbody style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;">&nbsp;</td><td class="container" width="600" style="margin: 0 auto !important;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;display: block !important;max-width: 600px !important;clear: both !important;"> <div class="content" style="margin: 0 auto;padding: 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;max-width: 600px;display: block;"> <table cellpadding="0" cellspacing="0" class="main" width="100%" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;background: #fff;border: 1px solid #e9e9e9;border-radius: 3px;"> <tbody style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td class="content-wrap" style="margin: 0;padding: 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;"><center><img src="' + logo + '" alt="logo" width=150></center><br><br> <table cellpadding="0" cellspacing="0" width="100%" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <tbody style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td class="content-block" style="margin: 0;padding: 0 0 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;line-height: 1.5;">' + properties.body.replace(/\n/g,"<br>") + '</td> </tr> ' + buttonHTML + signature + ' </tbody> </table> </td> </tr> </tbody> </table> </div> </td> <td style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;">&nbsp;</td> </tr> </tbody> </table> </body> </html>';

   // htmlString = htmlString.replace(/\n/g, "");


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

    if (properties.to === null)
        return {
            error: "\"To email\" input must not be empty. Failed to send email.",
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
    // var to = "";
    // var cc  = "";
    // var bcc  = "";

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
    
    var extraParams;
    if (properties.extra_parameters !== undefined && properties.extra_parameters !== null && properties.extra_parameters !== "") {
        try {
            extraParams = JSON.parse(properties.extra_parameters);
        } catch (err) {
            console.error("Unable to parse extra parameters in SendGrid Send basic email action. Throwing error, email will not be sent.");
            console.error(err);
            // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";
            return {
                "success": false,
                "error": "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent."
            };
        }
        if (typeof extraParams !== "object") {
            // throw "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent.";
            return {
                "success": false,
                "error": "Unable to parse extra parameters in SendGrid Send basic email action. Due to this error, this email will not be sent."
            };
        }
    }
    
    
    const options = {
        uri: "https://api.sendgrid.com/v3/mail/send",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + context.keys["API Key"],
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
                "type": "text/plain",
                "value": plainText
            },{
                "type": "text/html",
                "value": htmlString
            }],
            "attachments": attachments,
            // "headers": {
            //   "List-Unsubscribe": "<https://endmw3avmoasuqb.m.pipedream.net>, <mailto:chris@airdev.co>, <http://airdev.co/unsubscribe>"
            // }
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
    
    // Fields to be replaced in the following fields: signature, subject, button text, body, from name, reply to name
    // "[{"key":"test1key","value":"test1value 4"},{"key":"test2","value":"test2value 4"},{"key":"test3","value":"test3value 4"}]"
    // since signature and button text have already been added to the body html, can just replace those all there
    function mailMerge(mailMergeArray) {
        mailMergeArray.forEach(keyValuePair => {
            //subject
            options.body.personalizations[0].subject = options.body.personalizations[0].subject.split(keyValuePair.key).join(keyValuePair.value);
            // body plain text and html
            options.body.content[0].value = options.body.content[0].value.split(keyValuePair.key).join(keyValuePair.value);
            options.body.content[1].value = options.body.content[1].value.split(keyValuePair.key).join(keyValuePair.value);
            
            // reply to name
            if (options.body.reply_to !== undefined && options.body.reply_to.name !== undefined && options.body.reply_to.name !== null)
                options.body.reply_to.name =  options.body.reply_to.name.split(keyValuePair.key).join(keyValuePair.value);
            // from name
            if (options.body.from.name !== undefined && options.body.from.name !== null)
                options.body.from.name = options.body.from.name.split(keyValuePair.key).join(keyValuePair.value);
        });
    }

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

    // run mailMerge, acts directly on the options object
    mailMerge(properties.mailMerge);
    
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
    
    // error = JSON.stringify(properties.mailMerge); 
    // "[{"key":"test1key","value":"test1value 4"},{"key":"test2","value":"test2value 4"},{"key":"test3","value":"test3value 4"}]"
    return {
        "error": properties.body,
        "success": success,
        "responseCode": response.statusCode,
        "responseDump" : JSON.stringify(response),
        //"requestDump" : JSON.stringify(options),
    }


}