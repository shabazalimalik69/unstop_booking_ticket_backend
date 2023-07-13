require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

const seats = [];
for (let row = 1; row <= 10; row++) {
  const seatRow = [];
  const seatsInRow = row === 10 ? 3 : 7;
  for (let number = 1; number <= seatsInRow; number++) {
    seatRow.push({ row, number, available: true });
  }
  seats.push(seatRow);
}

app.get("/",(req,res)=>{
  res.send("Home Page");
})

app.post('/api/bookings', (req, res) => {
  const { numberOfSeats } = req.body;
  let bookedSeats = [];

  for (let row = 0; row < seats.length; row++) {
    let consecutiveSeats = 0;
    let startIndex = -1;

    for (let number = 0; number < seats[row].length; number++) {
      if (seats[row][number].available) {
        if (consecutiveSeats === 0) {
          startIndex = number;
        }
        consecutiveSeats++;

        if (consecutiveSeats === numberOfSeats) {
          bookedSeats = seats[row]
            .slice(startIndex, startIndex + consecutiveSeats)
            .map((seat) => {
              seat.available = false;
              return { row: seat.row, number: seat.number };
            });
          break;
        }
      } else {
        consecutiveSeats = 0;
        startIndex = -1;
      }
    }

    if (bookedSeats.length > 0) {
      break;
    }
  }

  if (bookedSeats.length > 0) {
    res.status(200).json({ message: 'Seats booked successfully', seats: bookedSeats });
  } else {
    res.status(400).json({ message: 'No available seats' });
  }
});

// Start the server
const port = process.env.Port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
