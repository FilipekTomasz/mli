const fs = require('fs');


function getExtension(filename) {
    return filename.substring(filename.indexOf('.'));
}

function checkMimetype(file) {
    if (file.mimetype == "application/msword" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
    || file.mimetype == "application/pdf" || file.mimetype == "text/plain") {
        return true;
    } else {
        return false;
    }
}

function getDataFromFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
                resolve('err');
            } else {
                resolve(data)
            }
        })
    })
}

function handleImage(req, file, name, folder) {
    return new Promise((resolve, reject) => {
        const extension = getExtension(file.name);
        const fileName = folder + name + extension;

        if (file.truncated) {
            console.log('Plik jest zbyt duży, max=1mb')

        }
        else {

                file.mv(`./docs/${folder}/${fileName}`, function (err) {
                    if (err){
                        console.log(err);
                        resolve('default.png');
                    }
                    else {
                        resolve(fileName);
                    }
                });

            //}
            
        }
    })
}

function createFolder(date){
    return new Promise((resolve, reject) => {
    fs.mkdir(`./docs/${date}`, { recursive: true }, (err) => {
        if (err){
            console.log(err);
            resolve('err');
        } else {
            resolve();
        }

    })
    })
}
function deleteFolder(folder){
    return new Promise((resolve, reject) => {
    fs.rmdir(`./docs/${folder}`, { recursive: true }, (err) => {
        if (err){
            console.log(err);
            resolve('err');
        } else {
            resolve();
        }

    })
    })
}


function saveTxt(data, folder){
    fs.writeFile(`./docs/${folder}/${Date.now()}.txt`, data, function (err) {
        if (err) return console.log(err);
        console.log('Saved file');
      });
}

module.exports = { getExtension, checkMimetype, getDataFromFile, handleImage, saveTxt, createFolder,deleteFolder };