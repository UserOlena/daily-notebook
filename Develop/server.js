require('dotenv').config();
const express = require('express');
const fs = require('fs');
const app = express();

PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));


app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`);
})


app.get('/api/notes', (req, res) => {
    console.log('Im called');
    fs.readFile(`${__dirname}/db/db.json`, 'utf8', (err, data) => {
        if (err) {
            return err;
        } else {
            return res.json(JSON.parse(data));
        }
    });
});



app.listen(PORT, () => console.log(`Server listening on PORT http://localhost: ${PORT}`));