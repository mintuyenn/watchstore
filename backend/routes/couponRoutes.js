import express from 'express';
const router = express.Router();
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
  getAvailableCoupons, 
} from '../controllers/couponController.js';
// Import middleware bảo vệ
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/validate').post(validateCoupon); 

// ⭐ ROUTE MỚI: GET /api/coupons/available
router.route('/available').get(getAvailableCoupons);


router.route('/')
  .get(protect, admin, getCoupons)    
  .post(protect, admin, createCoupon); 
// DELETE /api/coupons/:id
router.route('/:id')
  .delete(protect, admin, deleteCoupon); 

export default router;
