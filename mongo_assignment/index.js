const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection failed", err));

const bookSchema = new mongoose.Schema({
    name:String,
    author:String,
    price:Number
})

const Book = mongoose.model("Assignment_1",bookSchema);


app.get("/books",async (req,res)=>{
    try{
       const bookData = await Book.find();
       res.status(200).json(bookData);
    }
    catch(err){
       res.status(404).json({message:"Books not find for this route"});
    }
});


app.post("/books", async (req, res) => {
  try {
    const bookPost = new Book(req.body);
    await bookPost.save();

    res.status(201).json(bookPost);   // ✅ this is fine

  } catch (err) {
    res.status(400).json({ 
      message: "Book is not added in the data",
      error: err.message   // ✅ small improvement (helps debugging)
    });
  }
});


app.get('/books/:id',async(req,res)=>{
     const bookId = req.params.id;
    try{
      const books = await Book.findById(bookId);
      if(!books){
        res.status(404).json({message:"Book not find with this id"});
      }
      res.status(200).json(books);
    }
    catch(err){
      res.status(500).send(err);
    }
})


app.put('/books/:id',async (req,res)=>{
    try{
       const bookPut = await Book.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true });
       res.status(200).json(bookPut);
    }
    catch(err){
       res.status(500).send(err);
    }
})


app.post('/add-multiplebooks',async(req,res)=>{
    try{
        const multiBooks = await Book.insertMany(req.body);
        res.status(200).json(multiBooks);
    }
    catch(err){
      res.status(404).json({message:"Data does not added successfully"});
    }
})


app.delete('/books/:id',async(req,res)=>{
   try{
       const deletedBook = await Book.findByIdAndDelete(req.params.id);
       res.status(200).json(deletedBook);
   }
   catch(err){
      res.status(404).json({message:"Data with given id not deleted"});
   }
})


app.patch('/books/:id',async(req,res)=>{
    try{
        const patchId = await Book.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators: true});
        res.status(200).json(patchId);
    }
    catch(err){
        res.status(404).json({message:"Data not patch with this id"});
    }
})

app.listen(3000,()=>{
   console.log("runs on the port 3000");
})