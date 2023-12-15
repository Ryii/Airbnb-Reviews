// import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import ListingsDAO from './dao/listingsDAO.js'
import UserReviewsDAO from './dao/user-reviewsDAO.js'

//* Server.js imports

import express from 'express'
import cors from 'cors'
import listings from './api/listings.route.js'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()

app.use(cors())
app.use(express.json())


app.use('/api/v1/listings', listings)

// app.use(express.static("build"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
//  });

app.use(express.static(path.join(__dirname, "../frontend/build")))

// app.use('*', (req, res) => res.status(404).json({ error: "not found :(" }))
app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) res.status(500).send(err);
    }
  )
})


//* 

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
  process.env.LISTINGS_DB_URI,
  {
    poolSize: 50,
    wtime: 2500,
    useNewUrlParse: true
  }
)
.catch(err => {
  console.error(err.stack)
  process.exit(1)
})
.then(async client => {
  await ListingsDAO.injectDB(client);
  await UserReviewsDAO.injectDB(client);
  
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})