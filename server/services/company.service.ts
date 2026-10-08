import * as companyRepo from "../repositories/company.repository";

export async function fetchCompanyProfile() {
    return await companyRepo.getCompanyProfile();
}

export async function editCompanyProfile(data: Record<string, unknown>) {
    return await companyRepo.updateCompanyProfile(data);
}
