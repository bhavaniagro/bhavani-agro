import * as documentRepo from "../repositories/document.repository";

export async function fetchDocuments() {
    return await documentRepo.getAllDocuments();
}

export async function addDocument(data: Record<string, unknown>) {
    return await documentRepo.createDocument(data);
}

export async function editDocument(id: string, data: Record<string, unknown>) {
    return await documentRepo.updateDocument(id, data);
}

export async function removeDocument(id: string) {
    return await documentRepo.deleteDocument(id);
}
