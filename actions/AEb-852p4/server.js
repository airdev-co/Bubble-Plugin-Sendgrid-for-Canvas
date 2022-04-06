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
  
    // generate HTML (just do this once)
  
    // https://sendgrid.com/docs/API_Reference/api_v3.html
    // https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html
  
    // var buttonCSS = properties.button ? ".btn-primary {text-decoration: none; color: #FFF; background-color: " + properties.buttonColor + "; border: solid " + properties.buttonColor + "; border-width: 10px 20px; line-height: 2; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; }" : "";
  
    // var buttonHTML = properties.button ? '<tr style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;"> <td class="content-block" style="margin: 0;padding: 0 0 20px;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;vertical-align: top;line-height: 1.5;"><a class="btn-primary" href="' + properties.buttonLink + '" style="margin: 0;padding: 0;font-family: &quot;Helvetica Neue&quot;, &quot;Helvetica&quot;, Helvetica, Arial, sans-serif;box-sizing: border-box;font-size: 14px;color: #FFF;text-decoration: none;background-color: ' + properties.buttonColor + ';border: solid ' + properties.buttonColor + ';border-width: 10px 20px;line-height: 2;font-weight: bold;text-align: center;cursor: pointer;display: inline-block;border-radius: 5px;text-transform: capitalize;">' + properties.buttonText + '</a></td> </tr>' : "";

    var buttonHTML = properties.button ? `<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 30px 25px;font-family:'Lato',sans-serif;" align="left"> <div align="left"> <a href="${properties.buttonLink}" target="_blank" style="box-sizing: border-box;display: inline-block;font-family:'Lato',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: ${properties.buttonColor}; border-radius: 6px; -webkit-border-radius: 6px; -moz-border-radius: 6px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;"> <span style="display:block;padding:10px 20px;line-height:160%;"><strong><span style="font-size: 14px; line-height: 22.4px; font-family: helvetica, sans-serif;">${properties.buttonText}</span></strong></span> </a> </div></td></tr></tbody></table>` : "";
  
    // only include signature if it isn't empty
    var signature = (properties.signature !== null && properties.signature !== undefined) ? properties.signature : "";
  
    var plainText = properties.body;
    
    if (properties.signature !== null && signature !== "") {
        plainText = plainText + "\n" + signature; 
        signature = `<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 30px 40px;font-family:'Lato',sans-serif;" align="left"> <div style="color: #6b7280; line-height: 140%; text-align: left; word-wrap: break-word;"> <p style="line-height: 140%; font-size: 14px; text-align: left;"><span style="font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">${signature}</span></p></div></td></tr></tbody></table>`;
    } 
  
    var logo = properties.logo;
    if (!logo.slice(0,5).includes("http"))
        logo = logo.replace("//", "https://");

    var header = "";
    if (properties.header !== null && properties.header !== "") {
        header = `<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 20px;font-family:'Lato',sans-serif;" align="left"> <div style="color: #111827; line-height: 120%; text-align: left; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 120%; text-align: left;"><span style="font-family: helvetica, sans-serif; font-size: 14px; line-height: 16.8px;"><strong><span style="font-size: 22px; line-height: 26.4px;">${properties.header}</span></strong></span></p></div></td></tr></tbody></table>`;
        plainText = properties.header + "\n" + plainText;
    }

    var body_image = "";
    if (properties.body_image !== null && properties.body_image !== "") {
        if (!properties.body_image.slice(0,5).includes("http"))
            body_image = properties.body_image.replace("//", "https://");
        body_image = `<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 30px 30px;font-family:'Lato',sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="${body_image}" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 540px;" width="540"/> </td></tr></table> </td></tr></tbody></table>`;
    }

    var copyright = "";
    if (properties.copyright !== null && properties.copyright !== "") {
        copyright = `<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:20px 20px 30px;font-family:'Lato',sans-serif;" align="left"> <div style="color: #6b7280; line-height: 140%; text-align: center; word-wrap: break-word;"> <p style="font-size: 14px; line-height: 140%;"><span style="font-family: helvetica, sans-serif; font-size: 12px; line-height: 16.8px;">${properties.copyright}<br/></span></p></div></td></tr></tbody></table>`;
    }
  
  
    htmlString = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings></xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css"> table, td{color: #111827;}a{color: #0000ee; text-decoration: underline;}@media only screen and (min-width: 620px){.u-row{/*width: 600px !important;*/}.u-row .u-col{vertical-align: top;}.u-row .u-col-100{/*width: 600px !important;*/}}@media (max-width: 620px){.u-row-container{max-width: 100% !important; padding-left: 0px !important; padding-right: 0px !important;}.u-row .u-col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.u-row{width: calc(100% - 40px) !important;}.u-col{width: 100% !important;}.u-col > div{margin: 0 auto;}}body{margin: 0; padding: 0;}table,tr,td{vertical-align: top; border-collapse: collapse;}p{margin: 0;}.ie-container table,.mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors='true']{color: inherit !important; text-decoration: none !important;}</style> <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #fafafa;color: #111827"> <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #fafafa;" cellpadding="0" cellspacing="0"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div class="u-row-container" style="padding: 40px 10px 10px;background-color: transparent"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;/*min-width: 600px;*/display: table-cell;vertical-align: top;"> <div style="background-color: #ffffff;width: 100% !important;"> <div style="padding: 0px;border-top: 1px solid #e7e9eb;border-left: 1px solid #e7e9eb;border-right: 1px solid #e7e9eb;border-bottom: 1px solid #e7e9eb;"> <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:40px 0px 30px;font-family:'Lato',sans-serif;" align="left"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td style="padding-right: 0px;padding-left: 0px;" align="center"> <img align="center" border="0" src="${logo}" alt="logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 150px;" width="150"/> </td></tr></table> </td></tr></tbody></table>${header}<table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px;font-family:'Lato',sans-serif;" align="left"> <div style="color: #6b7280; line-height: 140%; text-align: left; word-wrap: break-word;"> <p style="line-height: 140%; font-size: 14px; text-align: left;"><span style="font-family: helvetica, sans-serif; font-size: 14px; line-height: 19.6px;">${properties.body.replace(/\n/g,"<br>")}</span></p></div></td></tr></tbody></table>${body_image}${buttonHTML}${signature} </div></div></div></div></div></div><div class="u-row-container" style="padding: 0px;background-color: #fafafa"> <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;"> <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;"> <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;"> <div style="width: 100% !important;"> <div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"> ${copyright} </div></div></div></div></div></div></body></html>`;
  
    // htmlString = htmlString.replace(/\n/g, "");
      
    if (sendgrid === true) {
  
        // Create email recipient arrays
        // return {"error": typeof properties.to, "responseDump": JSON.stringify(properties.to.get(0, properties.to.length()))}
        /*
        var to  = [];
        properties.to.get(0, properties.to.length()).forEach(email => to.push({"email": email}));
            */
  
        if (properties.to === null || properties.to === undefined || properties.to === "") {
            returnError = "\"To email\" input must not be empty. Failed to send email."
            
            if (properties.throw_errors === true)
                throw returnError;
            return {
                error: "\"To email\" input must not be empty. Failed to send email.",
                success: false
            };
        }
        var log = "to: " + properties.to;
  
        var to_emails = properties.to.split(",").map(s => s.trim());
        to_emails = deDuplicateArray(to_emails);
      //   to = to.map(toEmail => {return {"email": toEmail}});
        log += "  to2: " + to_emails;
  
  
      //   to = deDuplicateArray(to);
      //   log += "  to3: " + to;
  
        // to_emails = to_emails.map(toEmail => {return {"email": toEmail}});
  
        // check if there are attachments
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

        var personalization_recipients = to_emails.map(toEmail => {
                return {
                    "to" : [
                        {
                            "email": toEmail
                        }
                    ],
                    "subject": properties.subject
                };
            }
        );
  
  
        const options = {
            uri: "https://api.sendgrid.com/v3/mail/send",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + context.keys["API Key"],
            },
            body: {
                "personalizations": personalization_recipients, 
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
        function sendgridMailMerge(mailMergeArray) {
            mailMergeArray.forEach(keyValuePair => {
                //subject
                options.body.personalizations.map(personalization => {
                    personalization.subject = personalization.subject.split(keyValuePair.key).join(keyValuePair.value);
                })
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
        if (properties.replyTo === null || properties.replyTo.trim() === "")
            delete options.body["reply_to"];
        else if (options.body["reply_to"] !== null && options.body["reply_to"] !== undefined && (properties.replyToName === null || properties.replyToName.trim() === ""))
            delete options.body["reply_to"].name;
        if (properties.fromName === null || properties.fromName.trim() === "")
            delete options.body.from.name;
        if (attachments.length === 0)
            delete options.body.attachments;
  
        // run mailMerge, acts directly on the options object
        sendgridMailMerge(properties.mailMerge);
  
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
            //"log": log,
            "success": success,
            "responseCode": response.statusCode,
            //"responseDump" : JSON.stringify(response),
            //"requestDump" : JSON.stringify(options),
        };
    }
    else if (postmark === true) {
        return {
            "error": "Postmark not supported by this action",
            "success": false
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