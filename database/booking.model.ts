import {
  model,
  models,
  Schema,
  Types,
  type HydratedDocument,
  type Model,
} from "mongoose"

import { Event } from "./event.model"

export interface BookingData {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

type BookingDocument = HydratedDocument<BookingData>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const bookingSchema = new Schema<BookingData>(
  {
    // The reference keeps bookings linked to their source event.
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [emailPattern, "Email must be valid."],
    },
  },
  { timestamps: true },
)

bookingSchema.index({ eventId: 1 })

bookingSchema.pre("save", async function (this: BookingDocument) {
  // Reject bookings that point to an event that no longer exists.
  const eventExists = await Event.exists({ _id: this.eventId })

  if (!eventExists) {
    throw new Error("Cannot create a booking for an event that does not exist.")
  }
})

export const Booking: Model<BookingData> =
  (models.Booking as Model<BookingData> | undefined) ??
  model<BookingData>("Booking", bookingSchema)
