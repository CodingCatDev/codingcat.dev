import { defineField, defineType } from "sanity";
import { HiOutlineBan } from "react-icons/hi";

export default defineType({
	name: "bookingBlackout",
	title: "Portal Booking Blackout",
	type: "document",
	icon: HiOutlineBan,
	fields: [
		defineField({
			name: "title",
			title: "Blackout Label",
			type: "string",
			description: 'For example, "AWS re:Invent 2026 (Las Vegas)"',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "startDate",
			title: "Start Date (Inclusive, America/New_York)",
			type: "date",
			description: "First calendar day blocked on /book and /portal rebooking.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "endDate",
			title: "End Date (Inclusive, America/New_York)",
			type: "date",
			description: "Last calendar day blocked on /book and /portal rebooking.",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "active",
			title: "Active",
			type: "boolean",
			description:
				"Uncheck to temporarily re-open these dates without deleting the blackout record.",
			initialValue: true,
		}),
		defineField({
			name: "reason",
			title: "Guest-Facing Message (Optional)",
			type: "string",
			description:
				"Shown if a guest attempts to submit a slot inside this window. Does not affect Google Calendar or Sanity coworker bookings.",
		}),
	],
	preview: {
		select: {
			title: "title",
			startDate: "startDate",
			endDate: "endDate",
			active: "active",
		},
		prepare({ title, startDate, endDate, active }) {
			const range =
				startDate && endDate ? `${startDate} to ${endDate}` : "Dates unset";
			return {
				title: title || "Portal Blackout",
				subtitle: `${active === false ? "[Inactive] " : ""}${range}`,
			};
		},
	},
});
