const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();

PORT = process.env.PORT || 3001;

app.use(express.static('develop/public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));


// defining a route that matches "/notes" url and sends notes.html file to the client
app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/develop/public/notes.html`);
})


// retrieves and sends the existing notes from the db to the client to display notes on the page
app.get('/api/notes', (req, res) => {
    fs.readFile(`${__dirname}/develop/db/db.json`, 'utf8', (err, dbNotes) => {
        if (err) {
            res.sendStatus(500);
        } else {
            return res.json(JSON.parse(dbNotes));
        }
    });
});


// defining a route that matches any HTTP GET request with any path and sends index.html file to the client
app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/develop/public/index.html`);
})


// gets new note data from the client and saves it in the db
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title || (title && text)) {
        fs.readFile(`${__dirname}/develop/db/db.json`, 'utf8', (err, dbNotes) => {
            if (err) {
                res.sendStatus(500);
            } else {
                const notes = JSON.parse(dbNotes);
                const newNote = { 
                    title, 
                    text, 
                    id: uuidv4(),
                };

                notes.push(newNote);

                writeToFile(notes, res);
            }
        })
    }
})


// deletes the note from the db whenever client sends such a request and provides that specific note's id
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(`${__dirname}/develop/db/db.json`, 'utf8', (err, dbNotes) => {
        if (err) {
            res.sendStatus(500);
        } else {
            const notes = JSON.parse(dbNotes).filter(element => element.id !== id);

            writeToFile(notes, res);
        }
    })
})


// function writes to the db whenever there are any changes made to the notes on the client side
function writeToFile(notes, res) {
    fs.writeFile(`${__dirname}/develop/db/db.json`, JSON.stringify(notes), (err) => {
        if (err) {
            console.log(`Occured problem while writing the file.`);
            res.sendStatus(500);
        } else {
            console.log('File has been written succesfully!');
            res.sendStatus(200);
        }
    });
}


app.listen(PORT, () => console.log(`Server listening on PORT http://localhost:${PORT}`));
