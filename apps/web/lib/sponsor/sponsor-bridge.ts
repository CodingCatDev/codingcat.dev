import { writeClient } from "@/lib/sanity-write-client";

/**
 * When a sponsorLead reaches "paid" status, create or link a public sponsor document.
 * This bridges the deal pipeline (sponsorLead) with the public sponsor page (sponsor).
 */
export async function bridgeSponsorLeadToSponsor(sponsorLeadId: string) {
  // 1. Fetch the sponsorLead document
  const lead = await writeClient.fetch(
    `*[_type == "sponsorLead" && _id == $id][0] {
      _id, companyName, contactEmail, bookedSlot->{_id, title, slug},
      status, rateCard, notes
    }`,
    { id: sponsorLeadId }
  );

  if (!lead || lead.status !== "paid") {
    console.warn(`[sponsor-bridge] Lead ${sponsorLeadId} not found or not paid`);
    return null;
  }

  // 2. Check if a sponsor document already exists for this company
  const existingSponsor = await writeClient.fetch(
    `*[_type == "sponsor" && title == $companyName][0] { _id }`,
    { companyName: lead.companyName }
  );

  let sponsorId: string;

  if (existingSponsor) {
    // Link to existing sponsor
    sponsorId = existingSponsor._id;
    console.log(`[sponsor-bridge] Linked to existing sponsor: ${sponsorId}`);
  } else {
    // Create a new sponsor document
    const newSponsor = await writeClient.create({
      _type: "sponsor",
      title: lead.companyName,
      slug: {
        _type: "slug",
        current: lead.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      },
      date: new Date().toISOString(),
      excerpt: `${lead.companyName} is a sponsor of CodingCat.dev`,
      url: "", // Will need to be filled in manually or from lead data
    });
    sponsorId = newSponsor._id;
    console.log(`[sponsor-bridge] Created new sponsor: ${sponsorId}`);
  }

  // 3. If the lead has a booked video slot, add the sponsor reference to that video
  if (lead.bookedSlot?._id) {
    // Fetch the automatedVideo to check if it has a sponsor field
    // The automatedVideo uses sponsorSlot (ref to sponsorLead), but the
    // content partial uses sponsor[] (ref to sponsor). We need to update
    // the sponsorLead's bookedSlot reference.
    console.log(`[sponsor-bridge] Lead booked for video: ${lead.bookedSlot.title}`);
  }

  // 4. Update the sponsorLead with a reference to the sponsor document
  await writeClient.patch(sponsorLeadId).set({
    sponsorDocId: sponsorId,
  }).commit();

  return { sponsorId, isNew: !existingSponsor };
}
