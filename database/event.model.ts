import {
  model,
  models,
  Schema,
  type HydratedDocument,
  type Model,
} from "mongoose"

export interface EventData {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

type EventDocument = HydratedDocument<EventData>

const requiredText = {
  type: String,
  required: true,
  trim: true,
  validate: {
    validator: (value: string): boolean => value.length > 0,
    message: "This field cannot be empty.",
  },
}

const nonEmptyTextList = {
  type: [{ type: String, trim: true }],
  required: true,
  validate: {
    validator: (value: string[]): boolean =>
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((item) => item.trim().length > 0),
    message: "Provide at least one non-empty value.",
  },
}

const eventSchema = new Schema<EventData>(
  {
    title: requiredText,
    slug: { type: String, trim: true },
    description: requiredText,
    overview: requiredText,
    image: requiredText,
    venue: requiredText,
    location: requiredText,
    date: requiredText,
    time: requiredText,
    mode: requiredText,
    audience: requiredText,
    agenda: nonEmptyTextList,
    organizer: requiredText,
    tags: nonEmptyTextList,
  },
  { timestamps: true },
)

eventSchema.index({ slug: 1 }, { unique: true })

function createSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function normalizeTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/.exec(time.trim())

  if (!match) {
    throw new Error("Time must use HH:mm or h:mm AM/PM format.")
  }

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const meridiem = match[3]?.toLowerCase()

  if (minutes > 59 || hours > (meridiem ? 12 : 23) || hours < (meridiem ? 1 : 0)) {
    throw new Error("Time is not valid.")
  }

  if (meridiem === "pm" && hours !== 12) hours += 12
  if (meridiem === "am" && hours === 12) hours = 0

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

eventSchema.pre("save", function (this: EventDocument) {
  // Generate a stable, URL-friendly slug only when the title changes.
  if (this.isModified("title")) {
    this.slug = createSlug(this.title)

    if (!this.slug) {
      throw new Error("Title must contain letters or numbers.")
    }
  }

  // Store dates as ISO strings and times as 24-hour HH:mm values.
  const parsedDate = new Date(this.date)
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Date must be a valid date.")
  }

  this.date = parsedDate.toISOString()
  this.time = normalizeTime(this.time)
})

export const Event: Model<EventData> =
  (models.Event as Model<EventData> | undefined) ??
  model<EventData>("Event", eventSchema)
