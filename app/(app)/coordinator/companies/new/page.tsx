import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompanyForm } from "@/components/coordinator/CompanyForm";

export const metadata: Metadata = { title: "Add Company" };

export default function NewCompanyPage() {
  return (
    <div>
      <PageHeader
        title="Add company"
        description="Fill in the details to list a new company for campus placements"
      />
      <CompanyForm />
    </div>
  );
}
