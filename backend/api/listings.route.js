import express from 'express'
import ListingsCtrl from './listings.controller.js'
import UserReviewsCtrl from './user-reviews.controller.js'

const router = express.Router()

router.route('/').get(ListingsCtrl.apiGetListings)
router.route('/id/:id').get(ListingsCtrl.apiGetListingById)
router.route('/property_types').get(ListingsCtrl.apiGetListingPropertyTypes)
router.route('/countries').get(ListingsCtrl.apiGetListingCountries)

router
  .route("/user-review")
  .post(UserReviewsCtrl.apiPostUserReview)
  .put(UserReviewsCtrl.apiUpdateUserReview)
  .delete(UserReviewsCtrl.apiDeleteUserReview)

export default router