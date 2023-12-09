import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

let listings

export default class ListingsDAO {
  static async injectDB(conn) {
    if (listings) {
      return
    }
    try {
      listings = await conn.db(process.env.LISTREVIEWS_NS).collection("listingsAndReviews")
    }
    catch (e) {
      console.error(
        `Unable to establish a collection handle in listingsDAO: ${e}`,
      )
    }
  }

  static async getListings({
    filters = null,
    page = 1,
    listingsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("name" in filters) {
        query = { $text : { $search: "\"" + filters["name"] + "\""} }
      } else if ("property_type" in filters) {
        query = { "property_type": { $eq: filters["property_type"] } }
      } else if ("country" in filters) {
        query = { "address.country" : { $eq: filters["country"] } }
      }
    }

    let cursor

    try {
      cursor = await listings.find(query)
    }
    catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { listingsList: [], totalNumListings: 0 }
    }

    const displayCursor = cursor.limit(listingsPerPage).skip(listingsPerPage * (page - 1))

    try {
      const listingsList = await displayCursor.toArray()
      const totalNumListings = await listings.countDocuments(query)

      return { listingsList, totalNumListings }
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem couting documents, ${e}`)
      return { listingsList: [], totalNumListings: 0 }
    }
  }

  static async getListingByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: id,
          }
        },
        {
          $lookup: {
            from: "userReviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$listing_id", "$$id"]
                  }
                }
              },
              {
                $sort: {
                  date: -1
                }
              }
            ],
            as: "userReviews"
          }
        },
        {
          $addFields: {
            userReviews: "$userReviews"
          }
        }
      ]

      return await listings.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getListingsByID: ${e}`)
      throw e
    }
  }

  static async getPropertyTypes() {
    let property_types = []
    try {
      property_types = await listings.distinct('property_type')
      return property_types
    } catch (e) {
      console.error(`Unable to get property types: ${e}`)
      return property_types
    }
  }

  static async getCountries() {
    let countries = []
    try {
      countries = await listings.distinct('address.country')
      return countries
    } catch (e) {
      console.error(`Unable to get countries: ${e}`)
      return countries
    }
  }
}