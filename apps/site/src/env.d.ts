/// <reference path="../.astro/types.d.ts" />

declare namespace App {
	interface Locals {
		sanity: import("./lib/sanity/context").SanityRequestContext;
	}
}
