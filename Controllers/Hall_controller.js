//Importing date-fns to use format method
import {format} from 'date-fns';

//All rooms details in a local variable
let roomsDetails = [
    {
        room_id : 1,
        room_no : 101,
        room_name : 'Standard Room',
        room_booked_dates : [],
        amenities : 'Tv, fan, Bed, Cupboard',
        seats : 4,
        rent_per_hr : 2000
    },
    {
        room_id : 2,
        room_no : 102,
        room_name : 'Deluxe Room',
        room_booked_dates : [],
        amenities : 'Tv, fan, queen Bed, Cupboard, dressing table',
        seats : 4,
        rent_per_hr : 5000
    },
    {
        room_id : 3,
        room_no : 103,
        room_name : 'Super-Deluxe Room',
        room_booked_dates : [],
        amenities : 'Tv, fan, king Bed, Cupboard, dressing table, sofa, ac',
        seats : 10,
        rent_per_hr : 10000
    }
];

//Booking room details in a local variable
let     bookingRoom = [];

//server running
export const serverConnect = (req, res)=>{
    res.status(200).json({message : `Hall Booking API Running, kindly check the API in Postman`});
}

//Creating a new room
export const createRoom =  (req, res)=>{
    try{

        //getting body values through req.body
        const {room_no, room_name, amenities, seats, rent_per_hr} = req.body;

        //checking for unique room no
        let index = roomsDetails.findIndex(room=> room.room_no === room_no);
        if(index !== -1){
            return res.status(404).json({message : `The given Room No already exist, try to give unique Room No`});
        }

        //if the room no is unique, creating a new room
        let newRoom = {
            ...(req.body),
            room_id : roomsDetails.length+1,
            room_booked_dates : [],
        }

        //adding the new room in roomsDetails
        roomsDetails.push(newRoom);

        //sending response
         res.status(201).json({message : `New Room Created Successfully`, data : newRoom});

    }catch(err){

        //throw error if anything goes wrong
        res.status(500).json({
            message : `Internal Server Error!`
        })
        console.log(err);
    }
    
}


//Getting all room details
export const getAllRoomDetails =  (req, res)=>{
    try{

        //If no rooms created means
        if(roomsDetails.length === 0){
            return res.status(404).json({ message: `There is no Room not yet created or available` });
        }

        //sending response
         res.status(200).json({message : `Data Fetched Suceesfully`, allRooms: roomsDetails});

    }catch(err){

         //throw error if anything goes wrong
        res.status(500).json({
            message : `Internal Server Error!`
        })
        console.log(err);
    }
    
}


//Checking the particular room's availability and then, booking a room
export const roomBooking = (req, res) => {
    try {

        //getting body values through req.body
        const { customer_name, date, start_time, end_time, room_id } = req.body;

        //getting booking date
        let dateTime = new Date();
        let today = format(dateTime, 'yyyy-MM-dd');

        // checking the room is exist
        const roomIndex = roomsDetails.findIndex(room => room.room_id === room_id);
        if (roomIndex === -1) {
            return res.status(404).json({ message: `There is no Room with the given id ${room_id}` });
        }

        //checking the room date availability
        let room = roomsDetails[roomIndex];
        let isBooked = room.room_booked_dates.some(bookedDate => bookedDate === date);
        if (isBooked) {
            return res.status(400).json({ message: `Room ${room.room_no} is already booked in the date ${date}` });
        }

        //if the date is in past, don't book the room throw error
        if (date < today) {
            return res.status(400).json({ message: "Booking date must be today or in the future" });
        }

        //checking the booking room details, if the given room is booked
        let roomDateCheck = bookingRoom.some(e=> e.date === date && e.room_id === room_id);
        if(roomDateCheck){
            return res.status(404).json({ message: `For the given room id : ${room_id}, the given date is not available` });
        }

        //creating a room booked object
        let bookedRoom = {
            ...(req.body),
            booking_status : "Booked",
            booking_date : today,
            booking_id : bookingRoom.length+1
        }

        // adding the booked room to bookingRoom
        bookingRoom.push(bookedRoom);

        // Updating the room status 
        room.room_booked_dates.push(date);

        //sending the response as room booked
        res.status(200).json({ message: `Room ${room.room_no} booked successfully`, roomBookedDetails : {room_name: room.room_name, ...bookedRoom} });

    } catch (err) {

        //throw error if anything goes wrong
        res.status(500).json({
            message: `Internal Server Error!`
        });
        console.log(err);
    }
}

//Getting booked room details
export const getAllBookedRoomDetails = (req, res)=>{
    try{

        //If no booked rooms means
        if(bookingRoom.length === 0){
            return res.status(404).json({ message: `There is no Room not yet booked` });
        }

        let bookedRoomInfo = bookingRoom.map(booking=>{
            let room = roomsDetails.find(e=> e.room_id === booking.room_id)
            return {
                room_name : room.room_name,
                booked_status : booking.booking_status,
                customer_name : booking.customer_name,
                date : booking.date,
                start_time : booking.start_time,
                end_time : booking.end_time
            }
        });

        //sending response
        res.status(200).json({message : `Data Fetched Suceesfully`, allBookedRooms: bookedRoomInfo});

   }catch(err){

        //throw error if anything goes wrong
       res.status(500).json({
           message : `Internal Server Error!`
       })
       console.log(err);
   }
} 

//Getting all customer with room data
export const getAllCustomerWithRoomDetails = (req, res)=>{
    try{

        //If no booked rooms means
        if(bookingRoom.length === 0){
            return res.status(404).json({ message: `There is no Room not yet booked` });
        }

            //filtering the necessary details from bookingRoom as well as roomsDetails
            let customerDetails = bookingRoom.map(booking=>{
            let room = roomsDetails.find(e=> e.room_id === booking.room_id)
            return {
                customer_name : booking.customer_name,
                room_name : room.room_name,
                date : booking.date,
                start_time : booking.start_time,
                end_time : booking.end_time
            }
        });

        //sending response
        res.status(200).json({message : `Data Fetched Suceesfully`, BookedRoomsCustomerDetails: customerDetails});
    }catch(err){

        //throw error if anything goes wrong
        res.status(500).json({
            message : `Internal Server Error!`
        })
        console.log(err);
    }
}

//Particular customer booking/booked room details
export const customerBookDetails = (req, res)=>{
    try{

        //getting the customer name from params
        const { customer_name } = req.params;

        //filtering the particular customer booking details
        let oneCustomerDetails = bookingRoom.filter(bookedRoom => bookedRoom.customer_name === customer_name);

        //throw error if the given customer name not found in the bookingRoom details 
        if(oneCustomerDetails.length === 0){
            return res.status(404).json({
                message : `There is no booked room details to show, for the given customer name : ${customer_name}`
            })
         }  

        //Again filtering the roomDetails to get the room Details
        oneCustomerDetails = oneCustomerDetails.map(booking => {
            let room = roomsDetails.find(room => room.room_id === booking.room_id);
            booking.room_name = room.room_name;
            return booking; 
        });

        //making the response output
        let resCustomer = {
            customer_name : customer_name,
            booking_count: oneCustomerDetails.length,
            roomInfo : oneCustomerDetails.map(e => ({
                room_name: e.room_name,
                date: e.date,
                start_time: e.start_time,
                end_time: e.end_time,
                booking_id: e.booking_id,
                booking_date: e.booking_date,
                booking_status: e.booking_status
            }))
        };
         //  console.log(oneCustomerDetails);    

         //sending response
         res.status(200).json({message : `Data Fetched Suceesfully`, data : resCustomer});

    }catch(err){

        //throw error if anything goes wrong
        res.status(500).json({
            message : `Internal Server Error!`
        })
        console.log(err);
    }
    
}   

//Page Not Found 
export const pageNotFound = (req, res)=>{
    res.status(404).json({message : `For the given API Endpoint, there is no page available`});
}