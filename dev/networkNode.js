const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require('uuid')// creates a unique random string, used as node address
const port = process.argv[2]; // refers to the start command to start server in packge.json 

const nodeAddress = uuid.v1().split('-').join('');

const LeekToken = new Blockchain(); 

app.use(bodyParser.json()); // parses json data i.e amount info
app.use(bodyParser.urlencoded({ extended: false })); // parses form data

app.get('/blockchain', function (req, res){
    res.send(LeekToken);
});

app.post('/transaction', function (req, res){
    const blockIndex = LeekToken.CreateNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

app.get('/mine', function (req, res){
    const lastBlock = LeekToken.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transaction: LeekToken.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = LeekToken.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = LeekToken.hashBlock(previousBlockHash, currentBlockData, nonce);

    LeekToken.CreateNewTransaction(3, "00", nodeAddress);

    const newBlock = LeekToken.CreateNewBlock(nonce, previousBlockHash, blockHash);
    res.json({
        note: "A new block has been successfully mined!",
        block: newBlock
    });
});



app.listen(port, function () {
    console.log(`Listening on port ${port}...`);
});
