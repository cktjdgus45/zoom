import express from 'express';

const PORT_NUM = 3000;

const app = express();

app.listen(PORT_NUM, () => {
    console.log(`server listening on ${PORT_NUM}`);
})