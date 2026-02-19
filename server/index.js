import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Routes from './routes/route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to handle incoming JSON and URL-encoded data
app.use(bodyParser.json());  // Handles JSON data
app.use(bodyParser.urlencoded({ extended: true }));  // Handles URL-encoded data

app.use(cors());

app.use('/', Routes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
