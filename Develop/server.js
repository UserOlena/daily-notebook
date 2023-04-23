require('dotenv').config();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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


app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})


app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title || (title && text)) {
        fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, dbNotes) => {
            if (err) {
                res.status(500).json(err);;
            } else {
                const notes = JSON.parse(dbNotes);
                const id = uuidv4();
                const newNote = { title, text, id };
                notes.push(newNote);

                writeToFile(notes, res);
            }
        })
    }
})


app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, dbNotes) => {
        if (err) {
            res.sendStatus(500);
        } else {
            const notes = JSON.parse(dbNotes).filter(element => element.id !== id);
            writeToFile(notes, res);
        }
    })
})


function writeToFile(notes, res) {
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(notes), (err) => {
        if (err) {
            console.log(`Occured problem while writing the file.`);
            res.status(500).json(err);
        } else {
            console.log('File has been written succesfully!');
            res.sendStatus(200);
        }
    });
}

app.listen(PORT, () => console.log(`Server listening on PORT http://localhost:${PORT}`));
