import * as vehicleRepo from "../repositories/vehicle.repository";

export async function fetchAllVehicles() {
    return await vehicleRepo.getAllVehicles();
}

export async function addVehicle(data: Record<string, unknown>) {
    return await vehicleRepo.createVehicle(data);
}

export async function editVehicle(id: string, data: Record<string, unknown>) {
    return await vehicleRepo.updateVehicle(id, data);
}

export async function removeVehicle(id: string) {
    return await vehicleRepo.deleteVehicle(id);
}
