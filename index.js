const express = require("express");

const cookieSession = require("cookie-session");
const path = require("path");
const {
    WebsocketNotification,
} = require("@inrupt/solid-client-notifications");

const {
    getSessionFromStorage,
    getSessionIdFromStorageAll,
    Session,
    fetch
} = require("@inrupt/solid-client-authn-node");


const { SCHEMA_INRUPT, RDF, AS, OWL } = require("@inrupt/vocab-common-rdf");

const {
    getSolidDataset,
    getThing,
    getStringNoLocale,
    getUrlAll,
    addUrl,
    addStringNoLocale,
    createSolidDataset,
    createThing,
    getPodUrlAll,
    getThingAll,
    getUrl,
    removeThing,
    saveSolidDatasetAt,
    setThing,
    getAgentAccess,
    getAgentAccessAll,
} = require("@inrupt/solid-client");

const app = express();
const port = 3000;

// The following snippet ensures that the server identifies each user's session
// with a cookie using an express-specific mechanism
app.use(
    cookieSession({
        name: "session",
        // These keys are required by cookie-session to sign the cookies.
        keys: [
            "Required, but value not relevant for this demo - key1",
            "Required, but value not relevant for this demo - key2",
        ],
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
    );

app.use(express.json());    
    
    const session = new Session();
    session.login({
        // 2. Use the authenticated credentials to log in the session.
        clientId: `8b33eb63-3726-4cf9-a587-623f84c73ab0`,
        clientSecret: `6729326b-d4bf-4b48-a5fb-f3c6736d682a`,
        oidcIssuer: "https://login.inrupt.com"
    });
    

    // Server Function 1 (SF001): GET ALL THE DEVICES.
    // URL to test: http://localhost:3000/getDevices/?resource=https://storage.inrupt.com/fc07b31b-5d6d-49cd-9ef2-df45bbaf43a0/dosing-data/
    app.get("/getDevices", async (req, res, next) => {
      
        if (typeof req.query["resource"] === "undefined") {
          res.send(
            "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
            );
        }
          
            if (session.info.isLoggedIn) {
                var responseFromSolid = await (await session.fetch(req.query["resource"])).text();
                console.log(responseFromSolid);            
                res.send("<p>Performed authenticated fetch.</p>" + responseFromSolid);
            }            
    });


    app.listen(port, () => {
        console.log(
          `Server running on port [${port}]. `
          );
        });