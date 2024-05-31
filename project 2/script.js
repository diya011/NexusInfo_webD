const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

//i haven't made any databases so simply initializing as null
const users = [];

//Login part
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(404).send('User not found');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (result) {
            // Here you would typically create a session or token for the user
            return res.send('Login successful');
        } else {
            return res.status(401).send('Incorrect password');
        }
    });
});

//signup 
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email, password: hashedPassword });
        res.send('Signup successful');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

