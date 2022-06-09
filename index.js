 import express from "express";
 import dotenv from "dotenv";
 import cors from "cors";
import { MongoClient } from "mongodb";


//we loaded the express module into its own variable

const app=express();
dotenv.config();  //dotenv is a module that loads environment variables from a .env file into process.env
const PORT = process.env.PORT ||9000;
app.use(express.json());  //parses incoming JSON requests and puts the parsed data in req.body
app.use(cors()); 

async function createConnection() {
    const client = new MongoClient(process.env.MONGO_URL);
  
    await client.connect();
    console.log("Successfully connected");
    return client;
  }
  
  createConnection();
  
  //Get Home page
app.get("/", (request, response) => {
    response.send("Assign Mentor to Students API");
    console.log('Home Page')
  });
  
  //create mentors
  app.post('/mentors',async(request,response)=>{
  const client=await createConnection();
  const newMentor=request.body;
  const mentors=await client.db('assign-mentors').collection('mentors').insertMany(newMentor);
  response.send(mentors);
  })
  
  //display all mentors
  
  app.get('/mentors',async(request,response)=>{
    const client=await createConnection();
    const mentors=await client.db('assign-mentors').collection('mentors').find({}).toArray();
    response.send(mentors);
    })
    
      //create students
  app.post('/students',async(request,response)=>{
    const client=await createConnection();
    const newStudent=request.body;
    const students=await client.db('assign-mentors').collection('students').insertMany(newStudent);
    response.send(students);
    })
    
    //display all mentors
    
    app.get('/students',async(request,response)=>{
        const client=await createConnection();
        const students=await client.db('assign-mentors').collection('students').find({}).toArray();
        response.send(students);
        })
    
  //Get students with no mentors
app.get("/students/NotAssigned", async (request, response) => {
    const client = await createConnection();
  
    const student = await client
      .db("assign-mentors")
      .collection("students")
      .find({ mentorId: "" })
      .toArray();
  
    console.log(student);
    response.send(student);
  });
  
  //select one mentor and add multiple students
app.post("/mentors/:id", async (request, response) => {
    const client = await createConnection();
    const mentorId = request.params.id;
    const newStudents = request.body;
  
    const result = await newStudents.map((el) => {
      return {
        studentId:el.studentId,
        studentName: el.studentName,
        mentorID: mentorId,
      };
    });
  
    const student = await client
      .db("assign-mentors")
      .collection("students")
      .insertMany(result);
  
    console.log(student);
    response.send(student);
  });
  
  //Get student by Mentor ID
  app.get("/mentors/:id",async(request,response)=>{
  const client = await createConnection();
  const id=request.params.id;
  const student= await client.db("assign-mentors").collection("students").find({ mentorId:id}).toArray();
  response.send(student);
  console.log(id);
  })
  
  //Get student by ID
  app.get("/students/:id", async(request, response) => {
    const client = await createConnection();
    const id = request.params.id;
  
    const student = await client.db("assign-mentors")
      .collection("students")
      .find({studentId:id})
      .toArray();
  
    console.log(id);
    response.send(student);
  });
  
  //Get student by ID and change mentor
app.patch("/students/:id/:mentorId", async (request, response) => {
    const client = await createConnection();
    const id = request.params.id;
    const mentorId = request.params.mentorId;
  
    const student = await client
      .db("assign-mentors")
      .collection("students")
      .updateOne({ studentId: id }, { $set: { mentorId: mentorId } });
  
    console.log(student);
    response.send(student);
  });
  
  //Delete student by ID
  app.delete("/students/:id", async (request, response) => {
    const client = await createConnection();
    const id = request.params.id;
  
    const student = await client
      .db("assign-mentors")
      .collection("students")
      .deleteOne({ studentId:id });
  
    console.log(student);
    response.send(student);
  });
  
  app.listen(9000, () =>console.log( "Server is working"));