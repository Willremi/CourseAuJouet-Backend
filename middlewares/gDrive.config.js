const { google } = require('googleapis');
const OAuth2Data = require('../credentials.json');

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const REFRESH_TOKEN = "1//04QXIuS-dff6UCgYIARAAGAQSNwF-L9IriQ49Cxx6DnJJC7pubyIQjvg0Dly9Gds6FGMuaNKJy0Chf2u_9nDQph7GuI4f7SgUQO0"

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

// const oauth2 = google.oauth2({
//     auth: oAuth2Client,
//     version: "v2"
// })

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

function shareFiles(fileId) {
    drive.permissions.create({
        fileId: fileId, 
        requestBody: {
            role: 'reader',
            type: 'anyone'
        }
    })
    drive.files.get({
        fileId, 
        fields: 'webViewLink'
    })
}
let idFolder = '1fmOhPjyD_JTzjS6LnaHHH9FFi215Ml4Z'
let tableau = []
async function listFile() {
    const res = await drive.files.list({
        q: `'${idFolder}' in parents`,
        fields: "files(id, name)"
    })
    let idFiles = res.data.files
    idFiles.forEach(
        // console.log(item.id)
        item => tableau.push(item.id)
    );
    console.log(tableau);
}
// listFile()

    drive.files.list({
        q: `'${idFolder}' in parents`,
        fields: "files(id, name)"
    }).then((res) => {
        // console.log(res.data.files)
        let fichiers = res.data.files
        fichiers.forEach(
            item => tableau.push(item.id)
        )
        // console.log(fichiers);
        // console.log("tableau : ", tableau);
    })
    .catch(err => console.log(err))

// list(idFolder)
module.exports = {
    drive,
    shareFiles
};
