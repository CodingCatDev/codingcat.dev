/**
 * Sets up the AI Assist plugin with CodingCat.dev preset prompts for Posts and Podcasts
 */

import { assist } from "@sanity/assist";

import podcastType from "../schemas/documents/podcast";
import postType from "../schemas/documents/post";

export const assistWithPresets = () =>
	assist({
		__presets: {
			[postType.name]: {
				fields: [
					{
						path: "content",
						instructions: [
							{
								_key: "post-content-preset",
								title: "Draft technical tutorial from title",
								icon: "block-content",
								prompt: [
									{
										_key: "post-prompt-1",
										_type: "block",
										style: "normal",
										markDefs: [],
										children: [
											{
												_key: "post-span-1",
												_type: "span",
												marks: [],
												text: "Given the draft title ",
											},
											{
												_key: "post-ref-1",
												_type: "sanity.assist.instruction.fieldRef",
												path: "title",
											},
											{
												_key: "post-span-2",
												_type: "span",
												marks: [],
												text: " for a CodingCat.dev web development tutorial, write a practical, developer-focused article with clear h2/h3 section headings, concrete code examples or architectural breakdowns, bulleted key takeaways, and a concise wrap-up. Do not repeat the title at the top of the body.",
											},
										],
									},
								],
							},
						],
					},
					{
						path: "excerpt",
						instructions: [
							{
								_key: "post-excerpt-preset",
								title: "Summarize post into excerpt",
								icon: "blockquote",
								prompt: [
									{
										_key: "post-excerpt-prompt-1",
										_type: "block",
										style: "normal",
										markDefs: [],
										children: [
											{
												_key: "post-excerpt-span-1",
												_type: "span",
												marks: [],
												text: "Create a concise 1–2 sentence excerpt for ",
											},
											{
												_key: "post-excerpt-ref-1",
												_type: "sanity.assist.instruction.fieldRef",
												path: "content",
											},
											{
												_key: "post-excerpt-span-2",
												_type: "span",
												marks: [],
												text: " that complements ",
											},
											{
												_key: "post-excerpt-ref-2",
												_type: "sanity.assist.instruction.fieldRef",
												path: "title",
											},
											{
												_key: "post-excerpt-span-3",
												_type: "span",
												marks: [],
												text: " without repeating it verbatim. Keep it under 160 characters for cards and SEO.",
											},
										],
									},
								],
							},
						],
					},
				],
			},
			[podcastType.name]: {
				fields: [
					{
						path: "content",
						instructions: [
							{
								_key: "podcast-content-preset",
								title: "Generate episode show notes",
								icon: "block-content",
								prompt: [
									{
										_key: "podcast-prompt-1",
										_type: "block",
										style: "normal",
										markDefs: [],
										children: [
											{
												_key: "podcast-span-1",
												_type: "span",
												marks: [],
												text: "Write structured CodingCat.dev podcast show notes for episode ",
											},
											{
												_key: "podcast-ref-1",
												_type: "sanity.assist.instruction.fieldRef",
												path: "title",
											},
											{
												_key: "podcast-span-2",
												_type: "span",
												marks: [],
												text: " including an engaging episode overview, key topics discussed (with h2/h3 headings and bullet points), and takeaways for web developers.",
											},
										],
									},
								],
							},
						],
					},
					{
						path: "excerpt",
						instructions: [
							{
								_key: "podcast-excerpt-preset",
								title: "Summarize episode into excerpt",
								icon: "blockquote",
								prompt: [
									{
										_key: "podcast-excerpt-prompt-1",
										_type: "block",
										style: "normal",
										markDefs: [],
										children: [
											{
												_key: "podcast-excerpt-span-1",
												_type: "span",
												marks: [],
												text: "Write a 1–2 sentence podcast episode summary based on ",
											},
											{
												_key: "podcast-excerpt-ref-1",
												_type: "sanity.assist.instruction.fieldRef",
												path: "content",
											},
											{
												_key: "podcast-excerpt-span-2",
												_type: "span",
												marks: [],
												text: " that complements the episode title ",
											},
											{
												_key: "podcast-excerpt-ref-2",
												_type: "sanity.assist.instruction.fieldRef",
												path: "title",
											},
											{
												_key: "podcast-excerpt-span-3",
												_type: "span",
												marks: [],
												text: " and fits cleanly in podcast cards and RSS descriptions.",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		},
	});
