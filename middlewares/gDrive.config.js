const { google } = require('googleapis');
const OAuth2Data = require('../credentials.json');

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const SCOPES = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

// const oauth2 = google.oauth2({
//     auth: oAuth2Client,
//     version: "v2"
// })

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})

// Création de dossier dans le dossier
// var folderMetadata = {
//     'name': '"nom du dossier"',
//     'mimeType': 'application/vnd.google-apps.folder'
// };

// drive.files.create({
//     resource: folderMetadata,
//     fields: { id: 'id', name: 'name' }
// }, function (err, file) {
//     if (err) {
//         // Handle error
//         console.error(err);
//     } else {
//         console.log('Folder Id: ', file.data.id);
//         const folderId = file.data.id

//         // Uploader des images dans dossier

//         const filemetadata = {
//             name: nomSlice,
//             parents: [folderId]
//         }

//         const media = {
//             mimeType: value.mimetype,
//             body: fs.createReadStream(value.path)
//         }

//         drive.files.create({
//             resource: filemetadata,
//             media: media,
//             fields: 'id'
//         }, (err, file) => {
//             if (err) throw err
//             // console.log(file.data.id);
//             let fileId = file.data.id

//             // partager pour être vu par tous
//             drive.permissions.create({
//                 fileId: fileId,
//                 requestBody: {
//                     role: 'reader',
//                     type: 'anyone'
//                 }
//             })
//             drive.files.get({
//                 fileId,
//                 fields: 'webViewLink'
//             })

//         })
//     }
// });


  // module.exports.oAuth2Client = oAuth2Client
 