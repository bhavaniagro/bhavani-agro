import * as dispatchRepo from "../repositories/dispatch.repository";

export async function fetchAllDispatches() {
    return await dispatchRepo.getAllDispatches();
}

export async function addDispatch(data: Record<string, unknown>) {
    return await dispatchRepo.createDispatch(data);
}

export async function editDispatch(id: string, data: Record<string, unknown>) {
    return await dispatchRepo.updateDispatch(id, data);
}

export async function removeDispatch(id: string) {
    return await dispatchRepo.deleteDispatch(id);
}
