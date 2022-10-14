import express from 'express';
import path from 'path';



const PORT_NUM = 3000;

const app = express();
const __dirname = path.resolve();
console.log(__dirname);

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public/"));

app.get("/", (req, res, next) => {
    res.render("home");
})



app.listen(PORT_NUM, () => {
    console.log(`server listening on ${PORT_NUM}`);
})