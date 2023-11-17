import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import ListingsDAO from './dao/listingsDAO.js'
import UserReviewsDAO from './dao/user-reviewsDAO.js'

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