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
        var base_uri = process.env.SAFEHAVEN_BASEURL;
        var headers = header
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