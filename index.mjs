import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

// /* Root route (homepage)*/
app.get('/', (req, res) => {
   res.render('index', { currentPage: '/' });
});

// /* AIassistance route*/
app.get('/aiapp', async (req, res) => {
   // let apiKey = process.env.API_KEY;
   // const genAI = new GoogleGenerativeAI(apiKey);
   // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
   // const prompt = "Briefly introduce yourself as an AI assistant and ask me to ask you anything";
   // const result = await model.generateContent(prompt);
   // console.log(result.response.text());
   // res.render('aiapp', { currentPage: '/aiapp' });
   res.render('aiapp', { currentPage: '/aiapp' });
});

// Retrieves userMessage and Gemini Response for AI chat
app.post("/aiapp", async (req,res)=> {
   // console.log("Inside app.post /aiapp...");
   const userMessage = req.body.user_message;
   // console.log(userMessage);
   try {
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
      const chat = model.startChat({
         history:[
            {
               role:"user",
               parts: [{text: "Hello"}],
            },
            {
               role:"model",
               parts: [{text: "Hello, I am an AI assistant. Ask me anything!"}],
            },
         ],
         generationConfig: {
            maxOutputTokens: 100,
         },
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response.text();
      // console.log(response);
      res.json({reply: response});
   }catch(error){
      console.error("Error generating content: ", error);
      res.status(500).json({error: "Failed to generate content"});
   }
});

 /* Benefits route */
app.get('/benefits', (req, res) => {
   res.render('benefits', { currentPage: '/benefits' });

 });

 /* Process route */
app.get('/process', (req, res) => {
   res.render('process', { currentPage: '/process' });

 });

/* Technologies route */
app.get('/technologies', (req, res) => {
    res.render('technologies', { currentPage: '/technologies' });
 });


app.listen(2999, () => {
   console.log('server started');
});
