const jsonType = { "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
const textType = { "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Origin": "*", "Content-Type": "text/plain" };
const noType = { "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE", "Access-Control-Allow-Credentials": true, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Origin": "*" };

module.exports = {
    jsonType,
    textType,
    noType
}