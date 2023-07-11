const express = require("express")
const app = express()
app.use(express.json());
///end point
//http://localhost:9000/

let roomData= [
    {
        "room_id":"R101",
        "priceperHr":100,
        "no_of_seats":20,
        "amenities":{
            "TV":true,
            "AC":true,
            "heater":false,
            "pool":false
    }
    },
    {
        "room_id":"R102",
        "priceperHr":200,
        "no_of_seats":40,
        "amenities":{
            "TV":true,
            "AC":false,
            "heater":true,
            "pool":false
    }
    },
    {
        "room_id":"R103",
        "priceperHr":300,
        "no_of_seats":60,
        "amenities":{
            "TV":false,
            "AC":true,
            "heater":false,
            "pool":false
    }
    }
]

const booking = [{
    "bookingID":"B1",
    "room_id":"R102",
    "customer_name":"Santosh",
    "bookingDate":"20230530",
    "startTime": "12noon",
    "endTime": "11:59am",
    "status":"expired",
    "booked_On": "5/05/2023"
},{
    "bookingID":"B2",
    "room_id":"R101",
    "customer_name":"Visha",
    "bookingDate":"20230601",
    "startTime": "12noon",
    "endTime": "11:59am",
    "status":"expired",
    "booked_On": "25/05/2023"
},
{
    "bookingID":"B3",
    "room_id":"R101",
    "customer_name":"Ananya",
    "bookingDate":"20230630",
    "startTime": "12noon",
    "endTime": "11:59am",
    "status":"booked",
    "booked_On": "5/06/2023"
}
]

// Get all room details
app.get("/roomdetails/all",(req,res)=>{
    res.status(200).json({Roomdetails : roomData})
})
// CREATE A ROOM
app.post("/room/create",(req,res)=>{
    let newRoom = req.body;
   let idExists =  roomData.find((val)=>val.room_id === newRoom.room_id);
   if(idExists !== undefined){
    res.status(400).json({message:"room already exists"});
   }
   else{
    roomData.push(newRoom);
    res.status(201).json({data:roomData})
   }
})

// book a room
app.post("/booking/create/:id",(req,res)=>{
    try{
        const {id} = req.params;
        let bookRoom = req.body;
        let date = new Date();
        let dFormat = date.toLocaleDateString();
        let idExists =  roomData.find((val)=>val.room_id ===id);
        if(idExists === undefined){
        res.status(400).json({message:"room doesn't exists"});
   }
        let matchId = booking.filter((val)=>val.room_id===id)
        if(matchId.length>0){
            let dateCheck = matchId.filter((d)=>{return d.bookingDate=== bookRoom.bookingDate})
        if(dateCheck.length===0){
            let newId = "B"+(booking.length+1);
            let newBooking = {...bookRoom,bookingID: newId, roomID:id, status:"booked", booked_On: dFormat}
            booking.push(newBooking)
            return res.status(201).json({message:"hall booked", Bookings:booking, added:newBooking});
        }
        else{
            return res.status(400).json({message:"hall already booked for this date, choose another hall", Bookings:booking});
        }
        }
        else{
            let newID = "B"+(booking.length + 1);
            let newbooking = {...bookRoom, bookingID: newID, roomID:id, status:"booked",booked_On: dFormat}
            booking.push(newbooking);
            return res.status(201).json({message:"hall booked", Bookings:booking, added:newbooking});

    }
        
        } 
        
    
    catch(err){
        res.status(400).json({message:"error booking room",  data:booking});
        }
})

app.get('/customers', (req, res) => {
    
      const customerDetails = booking.map(booking => {
        const { customer,room_id, bookingDate, startTime, endTime } = booking;
        return { customer, room_id, bookingDate, startTime, endTime };
      });
     
      res.json(customerDetails);
      
    
  });

  app.get('/customer/:name', (req, res) => {
    const { name } = req.params;
    const customer = booking.find(cust => cust.customer_name === name);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    const customerBookings = booking.map(booking => {
      const { customer,roomId, startTime, endTime, bookingID, status, bookingDate,booked_On } = booking;
      return { customer, roomId, startTime, endTime, bookingID, status, bookingDate,booked_On };
    });
    res.json(customerBookings);
  });

app.listen(9000,()=>{
    console.log("server started")
})