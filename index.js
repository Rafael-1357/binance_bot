require('dotenv').config()

const BASE_URL = process.env.BASE_URL
const URL_STATUS = '/sapi/v1/system/status';

async function start() {
    const status = await fetch(`${BASE_URL}${URL_STATUS}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    })

    const statusResponse = await status.json();
    return statusResponse
}

start().then(response => {
    console.log(response);
}).catch(error => {
    console.error('Error:', error);
})



