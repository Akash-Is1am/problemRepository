// ------------------------------------------- INITIAL --------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the directory where server.js is located
app.use(express.static(path.join(__dirname, '')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// ------------------------------------------- INITIAL --------------------------------


// ---------------------------------------- ADD PROBLEM -------------------------------
// Route to serve add_problem.html
app.get('/add', (req, res) => {
    res.sendFile(__dirname + '/add_problem.html');
});

// Route to handle form submission
app.post('/add', (req, res) => {
    // Parse form data
    const newProblem = {
        name: req.body.name,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        platforms: req.body.platforms.split(',').map(tag => tag.trim()),
        level: req.body.level,
        link: req.body.link
    };

    // Read existing problems from problems.json
    fs.readFile('problems.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Parse JSON data
        let problems = JSON.parse(data);

        // Add new problem to existing problems
        problems.push(newProblem);

        // Write updated problems back to problems.json
        fs.writeFile('problems.json', JSON.stringify(problems, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('New problem added successfully:', newProblem);
            const script = `
                <script>
                    alert('New problem added successfully!');
                    window.location.href = '/add'; // Redirect back to the add problem page
                </script>
            `;
            res.send(script);
        });
    });
});
// ---------------------------------------- ADD PROBLEM -------------------------------

// ---------------------------------------- UPDATE PROBLEM COUNT -------------------------------

// Function to update counts in the JSON file
function updateCounts(section, newCount) {
    const userDataFilePath = path.join(__dirname, 'userdata.json');
    fs.readFile(userDataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const counts = JSON.parse(data);
        counts[section] = newCount;

        fs.writeFile(userDataFilePath, JSON.stringify(counts), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Counts updated successfully.');
        });
    });
}

// Route to handle updating counts
app.post('/update-count', (req, res) => {
    const { section, count } = req.body;
    updateCounts(section, count);
    res.send('Count updated successfully.');
});

// ---------------------------------------- UPDATE PROBLEM COUNT -------------------------------

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
