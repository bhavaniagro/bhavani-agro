import * as qcInspectionRepo from "../repositories/qcInspection.repository";

export async function fetchAllQCInspections() {
    return await qcInspectionRepo.getAllQCInspections();
}

export async function addQCInspection(data: Record<string, unknown>) {
    return await qcInspectionRepo.createQCInspection(data);
}

export async function editQCInspection(id: string, data: Record<string, unknown>) {
    return await qcInspectionRepo.updateQCInspection(id, data);
}

export async function removeQCInspection(id: string) {
    return await qcInspectionRepo.deleteQCInspection(id);
}
