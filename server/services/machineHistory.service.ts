import * as historyRepo from "../repositories/machineHistory.repository";

export async function fetchMachineHistory() {
    return await historyRepo.getAllMachineHistory();
}

export async function addMachineHistory(data: Record<string, unknown>) {
    return await historyRepo.createMachineHistory(data);
}

export async function removeMachineHistory(id: string) {
    return await historyRepo.deleteMachineHistory(id);
}
