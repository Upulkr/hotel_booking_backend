import { prismaclient } from "../../index.js";
import { BadRequestsException } from "../exceptions/bad-request.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnprocessableEntity } from "../exceptions/validation.js";

export const book = async (req, res, next) => {
  try {
    const {
      hotelId,
      checkIn,
      checkOut,
      userId,
      phone,
      hotelName,
      price,
      adults,
      children,
      rooms,
      name,
    } = req.body;
    const user = await prismaclient.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (user) {
      let booking = await prismaclient.booking.findFirst({
        where: {
          checkIn,
          checkOut,
          rooms,
          adults,
          children,
          hotelName,
          phone,
          price,
          userId,
          name,
        },
      });
      if (booking) {
        res.json({
          message: "BOOKING ALREADY EXISTS",
        });
        console.log("BOOKING ALREADY EXISTS");
        return next(
          new BadRequestsException(
            "booking exists",
            ErrorCode.BOOKING_ALREADY_EXISTS
          )
        );
      }
      booking = await prismaclient.booking.create({
        data: {
          checkIn,
          hotelName,
          checkOut,
          rooms,
          adults,
          children,
          hotelId,
          phone,
          price,
          userId,
          name,
        },
      });

      res.json({ booking, message: "Booking is created successfully" });
    }
  } catch (error) {
    console.log(error);
    next(
      new UnprocessableEntity(
        error?.issues,
        "failed to create booking",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
export const deletebook = async (req, res, next) => {
  try {
    const { id, checkIn, checkOut, userId, phone, hotelName, bookingId } =
      req.body;
    console.log(bookingId);
    const user = await prismaclient.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (user) {
      let booking = await prismaclient.booking.findFirst({
        where: {
          id: bookingId,
        },
      });

      if (booking) {
        await prismaclient.booking.delete({
          where: {
            id: bookingId,
          },
        });
        res.json({
          message: "booking deleted successfully",
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(
      new UnprocessableEntity(
        error?.issues,
        "failed to delete booking",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const updatebook = async (req, res, next) => {
  try {
    const {
      email,
      checkIn,
      checkOut,
      userId,
      phone,
      hotelId,
      bookingId,
      rooms,
      price,
      adults,
      children,
    } = req.body;
    const user = await prismaclient.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next(
        new UnprocessableEntity("User not found", ErrorCode.USER_NOT_FOUND)
      );
    }
    if (user) {
      const booking = await prismaclient.booking.findUnique({
        where: {
          id: bookingId,
        },
      });
      if (booking) {
        const updatedBooking = await prismaclient.booking.update({
          where: {
            id: bookingId,
          },
          data: {
            hotelId,
            checkIn,
            checkOut,
            userId,
            phone,
            rooms,
            price,
            adults,
            children,
          },
        });

        res.json({
          message: "Booking updated successfully",
          booking: updatedBooking,
        });
      }
    }
  } catch (error) {
    console.log(error);
    next(
      new UnprocessableEntity(
        error?.issues,
        "not able to update booking",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const getbook = async (req, res, next) => {
  try {
    const { bookingId, userId } = req.query;

    if (!bookingId || !userId) {
      return res
        .status(400)
        .json({ error: "bookingId and userId are required" });
    }

    console.log("Booking ID:", bookingId, "User ID:", userId);

    const user = await prismaclient.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        bookings: true,
      },
    });

    if (user) {
      const booking = await prismaclient.booking.findUnique({
        where: {
          id_userId: {
            id: bookingId,
            userId: userId,
          },
        },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json(booking);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    next(
      new UnprocessableEntity(
        error?.issues,
        "Not able to get booking",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
export const getbookone = async (req, res, next) => {
  try {
    const { bookingId } = req.query;

    const booking = await prismaclient.booking.findUnique({
      where: {
        id: bookingId,
      },
    });
    res.json(booking);
  } catch (error) {
    console.log(error);
    next(
      new UnprocessableEntity(
        error?.issues,
        "not able to get booking",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
