import mongodb from 'mongodb'
const ObjectId = mongodb.ObjectID

let userReviews

export default class UserReviewsDAO {
  static async injectDB(conn) {
    if (userReviews) {
      return
    }
    try {
      userReviews = await conn.db(process.env.LISTREVIEWS_NS).collection("userReviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async addUserReview(listing_id, user, userReview, date) {
    try {
      const userReviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: userReview,
        listing_id: listing_id
      }

      return await userReviews.insertOne(userReviewDoc)
    } catch (e) {
      console.error(`Unable to post userReview: ${e}`)
      return { error: e}
    }
  }

  static async updateUserReview(userReviewId, userId, text, date) {
    try {
      const updateResponse = await userReviews.updateOne(
        { user_id: userId, _id: ObjectId(userReviewId)},
        { $set: { text: text, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update userReview: ${e}`)
      return { error: e }
    }
  }

  static async deleteUserReview(userReviewId, userId) {
    try {
      const deleteResponse = await userReviews.deleteOne(
        { _id: ObjectId(userReviewId), user_id: userId}
      )

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete userReview: ${e}`)
      return { error: e}
    }
  }
}