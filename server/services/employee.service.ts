import * as employeeRepo from "../repositories/employee.repository";

export async function fetchEmployees() {
    return await employeeRepo.getAllEmployees();
}

export async function addEmployee(data: Record<string, unknown>) {
    return await employeeRepo.createEmployee(data);
}

export async function editEmployee(id: string, data: Record<string, unknown>) {
    return await employeeRepo.updateEmployee(id, data);
}

export async function removeEmployee(id: string) {
    return await employeeRepo.deleteEmployee(id);
}
