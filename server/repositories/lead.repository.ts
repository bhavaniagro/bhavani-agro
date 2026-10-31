import type { Lead } from "../../client/src/types/erp";
import { db } from "../config/firebase";

const leadsCollection = db.collection("leads");

function normalizeLead(
    id: string,
    data: FirebaseFirestore.DocumentData
): Lead {
    const rawCreatedAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : typeof data.createdAt === "string"
            ? data.createdAt
            : new Date().toISOString();

    const rawUpdatedAt = data.updatedAt?.toDate
        ? data.updatedAt.toDate().toISOString()
        : typeof data.updatedAt === "string"
            ? data.updatedAt
            : rawCreatedAt;

    const createdAt = rawCreatedAt.split("T")[0];

    const leadName = typeof data.leadName === "string"
        ? data.leadName
        : typeof data.name === "string"
            ? data.name
            : "";

    const company = typeof data.company === "string"
        ? data.company
        : typeof data.companyName === "string"
            ? data.companyName
            : "";

    const contactPerson = typeof data.contactPerson === "string"
        ? data.contactPerson
        : leadName;

    const address = typeof data.address === "string"
        ? data.address
        : typeof data.location === "string"
            ? data.location
            : "";

    const location = typeof data.location === "string"
        ? data.location
        : address;

    const expectedQuantityMT = typeof data.expectedQuantityMT === "number"
        ? data.expectedQuantityMT
        : typeof data.expectedQuantityMT === "string" && !isNaN(Number(data.expectedQuantityMT))
            ? Number(data.expectedQuantityMT)
            : 0;

    const estimatedValue = typeof data.estimatedValue === "number"
        ? data.estimatedValue
        : typeof data.estimatedValue === "string" && !isNaN(Number(data.estimatedValue))
            ? Number(data.estimatedValue)
            : 0;

    return {
        id,
        leadName,
        company,
        contactPerson,
        mobile: typeof data.mobile === "string" ? data.mobile : typeof data.mobileNumber === "string" ? data.mobileNumber : "",
        email: typeof data.email === "string" ? data.email : "",
        location,
        address,
        productInterested:
            typeof data.productInterested === "string"
                ? data.productInterested
                : "",
        expectedQuantityMT,
        leadSource:
            typeof data.leadSource === "string" ? data.leadSource : "Direct Enquiry",
        estimatedValue,
        followUpDate:
            typeof data.followUpDate === "string" ? data.followUpDate : "",
        followUpTime:
            typeof data.followUpTime === "string" ? data.followUpTime : "",
        salesperson:
            typeof data.salesperson === "string" ? data.salesperson : "",
        status: data.status ?? "New",
        notes: typeof data.notes === "string" ? data.notes : "",
        lostReason: typeof data.lostReason === "string" ? data.lostReason : "",
        createdAt,
        updatedAt: rawUpdatedAt,
    };
}

export async function getAllLeads(): Promise<Lead[]> {
    const snapshot = await leadsCollection.get();

    return snapshot.docs.map((doc) =>
        normalizeLead(doc.id, doc.data())
    );
}

export async function createLead(
    data: Record<string, unknown>
): Promise<Lead> {
    const address = (typeof data.address === "string" ? data.address : typeof data.location === "string" ? data.location : "");
    const location = (typeof data.location === "string" ? data.location : address);

    const docRef = await leadsCollection.add({
        ...data,
        address,
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const createdDoc = await docRef.get();

    return normalizeLead(createdDoc.id, createdDoc.data() ?? {});
}
export async function updateLead(
    id: string,
    data: Record<string, unknown>
): Promise<Lead> {
    const leadRef = leadsCollection.doc(id);

    const updatePayload: Record<string, unknown> = {
        ...data,
        updatedAt: new Date(),
    };

    if (data.address !== undefined && data.location === undefined) {
        updatePayload.location = data.address;
    } else if (data.location !== undefined && data.address === undefined) {
        updatePayload.address = data.location;
    }

    await leadRef.update(updatePayload);

    const updatedDoc = await leadRef.get();

    return normalizeLead(updatedDoc.id, updatedDoc.data() ?? {});
}

export async function deleteLead(id: string): Promise<void> {
    await leadsCollection.doc(id).delete();
}
