import type { Lead } from "../../src/types/erp";
import { db } from "../config/firebase";

const leadsCollection = db.collection("leads");

function normalizeLead(
    id: string,
    data: FirebaseFirestore.DocumentData
): Lead {
    const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString().split("T")[0]
        : typeof data.createdAt === "string"
            ? data.createdAt
            : new Date().toISOString().split("T")[0];

    return {
        id,
        leadName: typeof data.leadName === "string" ? data.leadName : data.name ?? "",
        company: typeof data.company === "string" ? data.company : "",
        contactPerson:
            typeof data.contactPerson === "string" ? data.contactPerson : "",
        mobile: typeof data.mobile === "string" ? data.mobile : "",
        email: typeof data.email === "string" ? data.email : "",
        location: typeof data.location === "string" ? data.location : "",
        productInterested:
            typeof data.productInterested === "string"
                ? data.productInterested
                : "",
        expectedQuantityMT:
            typeof data.expectedQuantityMT === "number"
                ? data.expectedQuantityMT
                : 0,
        leadSource:
            typeof data.leadSource === "string" ? data.leadSource : "",
        estimatedValue:
            typeof data.estimatedValue === "number"
                ? data.estimatedValue
                : 0,
        followUpDate:
            typeof data.followUpDate === "string" ? data.followUpDate : "",
        salesperson:
            typeof data.salesperson === "string" ? data.salesperson : "",
        status: data.status ?? "New",
        notes: typeof data.notes === "string" ? data.notes : "",
        createdAt,
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
    const docRef = await leadsCollection.add({
        ...data,
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

    await leadRef.update({
        ...data,
        updatedAt: new Date(),
    });

    const updatedDoc = await leadRef.get();

    return normalizeLead(updatedDoc.id, updatedDoc.data() ?? {});
}

export async function deleteLead(id: string): Promise<void> {
    await leadsCollection.doc(id).delete();
}
