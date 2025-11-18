import { cookies } from "next/headers";
import { JobTypesPageClient } from "@/components/job-types/job-types-page-client";
import { getJobTypes } from "@/lib/job-types";
import type { JobType } from "@/types/job-type";

export default async function JobTypesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lp_auth_token")?.value;

  let jobTypes: JobType[] = [];
  try {
    jobTypes = await getJobTypes(token || undefined);
  } catch (error) {
    // Only log non-unauthorized errors
    if (error instanceof Error && error.message !== "Unauthorized") {
      console.error("Failed to fetch job types:", error);
    }
    // Continue with empty array on error
  }

  return <JobTypesPageClient initialJobTypes={jobTypes} />;
}

