const axios = require('axios');

const sendRequest = async (vendor, url, method, data, header, token) => {
    if (vendor == "sudo") {
        var base_uri = process.env.SUDO_BASEURL;
        var headers = {
            'Authorization': 'Bearer ' + process.env.SUDO_KEY
        }   
    } else if(vendor == "sudo-vault"){
        var base_uri = process.env.SUDO_BASEURL;
        var headers = {
            'Authorization': 'Bearer ' + process.env.SUDO_KEY
        }
    } else if (vendor == "safehaven") {
        // Refresh SafeHaven Access Token to avoid "expired token" error
        const auth = await axios({
            method: 'POST',
            url: process.env.SAFEHAVEN_BASEURL+"/oauth2/token",
            headers: { },
            data: {
                'grant_type': 'client_credentials',
                'client_id': process.env.SAFEHAVEN_oAuth2ClientID,
                'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                'client_assertion': process.env.SAFEHAVEN_oAuth2ClientAssertion
            }
        })
        .then(response => {
            // console.log(`statusCode: ${response.status}`)
            // console.log(response.data)
            return response.data;
        })
        .catch(error => {
            console.error(error)
            res.status(403).send({
                error
            });
        });
        var base_uri = process.env.SAFEHAVEN_BASEURL;
        var headers = {
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer '+auth.access_token, 
            'ClientID': auth.ibs_client_id
        }
    }

    const request = await axios({
            method: method,
            url: base_uri + url,
            headers: headers,
            data: data
        })
        .then(response => {
            // console.log(response.data);
            return response.data;
        });
    // console.log(request);
    return request;
};

module.exports = sendRequest;