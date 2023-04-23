require('dotenv').config();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
// const uuid = uuidv4();
const express = require('express');
const app = express();

PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));


app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`);
})


app.get('/api/notes', (req, res) => {
    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, dbNotes) => {
        if (err) {
            return err;
        } else {
            return res.json(JSON.parse(dbNotes));
        }
    });
});


app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title || (title && text)) {
        fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, dbNotes) => {
            if (err) {
                return res.status(500).json(err);;
            } else {
                const notes = JSON.parse(dbNotes);
                const id = uuidv4();
                const newNote = { title, text, id };
                notes.push(newNote);

                fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(notes), (err) => {
                    if (err) {
                        console.log(`Occured problem while writing the file.`);
                        return res.status(500).json(err);
                    } else {
                        console.log('File has been written succesfully!');
                        return res.status(200);
                    }
                })
            }
        })
    }
})

app.listen(PORT, () => console.log(`Server listening on PORT http://localhost: ${PORT}`));