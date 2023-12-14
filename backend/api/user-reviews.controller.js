import UserReviewsDAO from '../dao/user-reviewsDAO.js'

export default class UserReviewsController {
  static async apiPostUserReview(req, res, next) {
    try {
      const listingId = req.body.listing_id
      const userReview = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      const userReviewResponse = await UserReviewsDAO.addUserReview(
        listingId,
        userInfo,
        userReview,
        date,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateUserReview(req, res, next) {
    try {
      const userReviewId = req.body.userReview_id
      const text = req.body.text
      const date = new Date()

      const userReviewResponse = await UserReviewsDAO.updateUserReview(
        userReviewId,
        req.body.user_id,
        text,
        date,
      )

      var { error } = userReviewResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (userReviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update userReview - user may not be original poster",
        )
      }

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteUserReview(req, res, next) {
    try {
      const userReviewId = req.query.id
      const userId = req.body.user_id

      const userReviewResponse = await UserReviewsDAO.deleteUserReview(
        userReviewId,
        userId
      )

      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}