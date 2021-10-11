const express = require('express');
const app = express();
const moment = require('moment');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));
const { getExtension, checkMimetype, getDataFromFile, handleImage, saveTxt, createFolder,deleteFolder } = require('./fileFunctions');
const { sendMail} = require('./nodemailer');
const { ifError } = require('assert');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));

  app.use(fileUpload({
    limits: {
        fileSize: 100000000 //1mb
    },
    abortOnLimit: true,
    limitHandler: () => {
        console.log('file too big')
    }
}));








app.post('/register', async (req,res) => {
    if(validate(req.body) == "passed"){
      if(!checkMimetype(req.files.report) || !checkMimetype(req.files.documentation) || !checkMimetype(req.files.registration)){
        res.send("Plik musi być: .pdf, .docx, .odt lub .txt")
        return;
      }
      const date = Date.now();
      await createFolder(date)
  
      const a1 = await handleImage(req,req.files.report, 'sprawozdanie', date);
      const a2 = await handleImage(req,req.files.documentation, 'dokumentacja', date);
      const a3 = await handleImage(req,req.files.registration, 'rejestracja', date);

      
      let dataToSave=`
      Kategoria:${req.body.category}
      Wielkość zespołu:${req.body.teamSize}
      Wyjaśnienie (jeśli zespół ma 3 członków):${req.body.teamSize == 3 ? req.body.explanation : "/" }
      `

      if(req.body.teamSize >= 1){
        let u1=
        `
        Imie: ${req.body.u1Name}
        Nazwisko: ${req.body.u1Surname}
        Klasa: ${req.body.u1Class}
        Data urodzenia: ${req.body.u1Birthday}
        Szkola: ${req.body.u1School}
        Email: ${req.body.u1Email}
        Telefon: ${req.body.u1Tel}
        Procent wykonanej pracy: ${req.body.u1Workdone}
        `
          dataToSave+=u1;
      }  
      if(req.body.teamSize >= 2){
        let u2=
        `
        Imie: ${req.body.u2Name}
        Nazwisko: ${req.body.u2Surname}
        Klasa: ${req.body.u2Class}
        Data urodzenia: ${req.body.u2Birthday}
        Szkola: ${req.body.u2School}
        Email: ${req.body.u2Email}
        Telefon: ${req.body.u2Tel}
        Procent wykonanej pracy: ${req.body.u2Workdone}
        `
          dataToSave+=u2;
      }
      if(req.body.teamSize == 3){
        let u3=
        `
        Imie: ${req.body.u3Name}
        Nazwisko: ${req.body.u3Surname}
        Klasa: ${req.body.u3Class}
        Data urodzenia: ${req.body.u3Birthday}
        Szkola: ${req.body.u3School}
        Email: ${req.body.u3Email}
        Telefon: ${req.body.u3Tel}
        Procent wykonanej pracy: ${req.body.u3Workdone}
        `
          dataToSave+=u3;
      }
      dataToSave += `\n Liczba promotorów: ${req.body.promotors} \n`
      for(let i = 0; i<req.body.promotors; i++){
        let promotor = `
        Imie: ${req.body[`p${i}Name`]}
        Nazwisko: ${req.body[`p${i}Surame`]}
        Email: ${req.body[`p${i}Email`]}
        Telefon: ${req.body[`p${i}Tel`]}
        `
        dataToSave += promotor;
      }

        const attachments = [
          {
            path: `./docs/${date}/${a1}`
          },
          {
            path: `./docs/${date}/${a2}`
          },
          {
            path: `./docs/${date}/${a3}`
          }
        ]


        saveTxt(dataToSave, date)
        sendMail(dataToSave, date, attachments);

    } else{
        res.send(validate(req.body));
    }
})



function validate(req){
    if(req.category != 'didactic' && req.category != 'ecological' && req.category != 'technical' && req.category != 'software') return 'Niepoprawna kategoria';
    if(req.teamSize != 1 && req.teamSize != 2 && req.teamSize != 3) return 'Nieprawidłowa wielkość zespołu'; 


    if(req.teamSize >= 1){
       if(stringContainsNumber(req.u1Name) || req.u1Name.length < 3) return "Imie nie moze zawierac liczb i musi mieć conajmniej 3 litery";
       if(stringContainsNumber(req.u1Surname) || req.u1Surname.length < 3) return "Nazwisko nie moze zawierac liczb i musi mieć conajmniej 3 litery"
       if(!(new RegExp("[1-9][aA-zZ]{3}", "g").test(req.u1Class))) return "nieprawidlowa klasa";
       if(!(moment(req.u1Birthday, "YYYY-MM-DD", true).isValid())) return "nieprawidlowa data";
       if(isNaN(req.u1Tel)) return "nieprawidlowy numer tel";
       if(isNaN(req.u1Workdone) || req.u1Workdone > 100) return "nieprawidlowy procent pracy";
    }
    if(req.teamSize >= 2){
        if(stringContainsNumber(req.u2Name) || req.u2Name.length < 3) return "Imie nie moze zawierac liczb i musi mieć conajmniej 3 litery"
        if(stringContainsNumber(req.u2Surname) || req.u2Surname.length < 3) return "Nazwisko nie moze zawierac liczb i musi mieć conajmniej 3 litery"
        if(!(new RegExp("[1-9][aA-zZ]{3}", "g").test(req.u2Class))) return "nieprawidlowa klasa";
        if(!(moment(req.u2Birthday, "YYYY-MM-DD", true).isValid())) return "nieprawidlowa data";
        if(isNaN(req.u2Tel)) return "nieprawidlowy numer tel";
        if(isNaN(req.u2Workdone) || req.u2Workdone > 100) return "nieprawidlowy procent pracy";
     }
     if(req.teamSize >= 3){
        if(stringContainsNumber(req.u3Name) || req.u3Name.length < 3) return "Imie nie moze zawierac liczb i musi mieć conajmniej 3 litery"
        if(stringContainsNumber(req.u3Surname) || req.u3Surname.length < 3) return "Nazwisko nie moze zawierac liczb i musi mieć conajmniej 3 litery"
        if(!(new RegExp("[1-9][aA-zZ]{3}", "g").test(req.u3Class))) return "nieprawidlowa klasa";
        if(!(moment(req.u3Birthday, "YYYY-MM-DD", true).isValid())) return "nieprawidlowa data";
        if(isNaN(req.u3Tel)) return "nieprawidlowy numer tel";
        if(isNaN(req.u3Workdone) || req.u3Workdone > 100) return "nieprawidlowy procent pracy";
     }

     for(let i = 0; i < req.promotors; i++){
       if(req[`p${i}Name`])
       if(stringContainsNumber(req[`p${i}Name`]) || req[`p${i}Name`].length < 3) return "Imie nie moze zawierac liczb i musi mieć conajmniej 3 litery"
       if(stringContainsNumber(req[`p${i}Surame`]) || req[`p${i}Surame`].length < 3) return "Nazwisko nie moze zawierac liczb i musi mieć conajmniej 3 litery"
       if(isNaN(req[`p${i}Tel`])) return "nieprawidlowy numer tel";
       
     }


     if(req.rodo != 'on') return 'zaznacz rodo';


     return 'passed';
}


function stringContainsNumber(_string) {
    return /\d/.test(_string);
}




app.listen(4000, ()=>{
    console.log("Server started");
})