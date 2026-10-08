import * as machineryRepo from "../repositories/machinery.repository";

export async function fetchMachinery() {
    return await machineryRepo.getAllMachinery();
}

export async function addMachinery(data: Record<string, unknown>) {
    return await machineryRepo.createMachinery(data);
}

export async function editMachinery(id: string, data: Record<string, unknown>) {
    return await machineryRepo.updateMachinery(id, data);
}

export async function removeMachinery(id: string) {
    return await machineryRepo.deleteMachinery(id);
}
