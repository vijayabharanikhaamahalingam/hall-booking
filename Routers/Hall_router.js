//Importing express to use Router method
import express from 'express';

//Importing the controller functions
import { createRoom, customerBookDetails, getAllBookedRoomDetails, getAllCustomerWithRoomDetails, getAllRoomDetails, pageNotFound, roomBooking, serverConnect } from '../Controllers/Hall_controller.js';

//creating the router
const router = express.Router();

//make routing as per the given api

router.get('/', serverConnect);
router.post('/createRoom', createRoom);
router.get('/allRooms', getAllRoomDetails);
router.post('/roomBooking', roomBooking);
router.get('/allBookedRoomDetails', getAllBookedRoomDetails);
router.get('/allBookedCustomerDetails', getAllCustomerWithRoomDetails);
router.get('/customerBookDetails/:customer_name', customerBookDetails);
router.get('*', pageNotFound)

//exporting the router to use 
export default router;