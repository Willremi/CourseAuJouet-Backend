const { google } = require('googleapis');
const OAuth2Data = require('../credentials.json');

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const REFRESH_TOKEN = "1//04m9f7L5BKVBLCgYIARAAGAQSNwF-L9Ir7PfEkZkkMDYQY2humdujOYyAglbH3u6GSiX34sBWQJf4DzwbI-PxMUNFsvb9rKuFvlU"

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
let folderName = 'Mega Drive Mini'
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

/**
 * Suppression des fichiers ou dossiers
 * @param {string} id id d'un fichier(idFile) ou dossier (folderId)
 */
async function suppression(id) {
    await drive.files.delete({
        'fileId': id
    })
    console.log(`l'élément ${id} a bien été supprimé`);
}

// suppression("1BeflO2Tvp3t9DPmMPh4KqVL8bXjWLQOC")

// Si dossier produit n'existe pas (à faire)
// async function searchFolder(folderName) {
//     return new Promise((resolve, reject) => {
//         drive.files.list(
//           {
//             q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
//             fields: 'files(id, name)',
//           },
//           (err, res) => {
//             if (err) {
//               return reject(err);
//             }
  
//             return resolve(res.data.files ? res.data.files[0] : null);
//           },
//         );
//       });
// }

// let folder = searchFolder(folderName).catch((err) => {
//     console.log(err);
//     return null
// })

module.exports = {
    drive,
    shareFiles
};
