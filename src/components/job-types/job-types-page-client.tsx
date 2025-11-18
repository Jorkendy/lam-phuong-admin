"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateJobTypeDialog } from "./create-job-type-dialog";
import { DeleteJobTypeDialog } from "./delete-job-type-dialog";
import type { JobType } from "@/types/job-type";

interface JobTypesPageClientProps {
  initialJobTypes: JobType[];
}

export function JobTypesPageClient({
  initialJobTypes,
}: JobTypesPageClientProps) {
  const router = useRouter();
  const [jobTypes, setJobTypes] = useState<JobType[]>(initialJobTypes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteJobType, setDeleteJobType] = useState<JobType | null>(null);

  const handleJobTypeCreated = useCallback(
    (newJobType: JobType) => {
      setJobTypes((prev) => [...prev, newJobType]);
      setIsCreateDialogOpen(false);
      router.refresh();
    },
    [router]
  );

  const handleJobTypeDeleted = useCallback(
    (deletedSlug: string) => {
      setJobTypes((prev) => prev.filter((jt) => jt.slug !== deletedSlug));
      setDeleteJobType(null);
      router.refresh();
    },
    [router]
  );

  return (
    <div className="container mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Loại công việc</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý danh sách loại công việc
                </p>
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm loại công việc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {jobTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Chưa có loại công việc nào
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu bằng cách thêm loại công việc đầu tiên của bạn
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm loại công việc
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">STT</TableHead>
                  <TableHead>Tên loại công việc</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobTypes.map((jobType, index) => (
                  <TableRow key={jobType.id}>
                    <TableCell className="text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {jobType.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {jobType.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteJobType(jobType)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateJobTypeDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onJobTypeCreated={handleJobTypeCreated}
      />

      {deleteJobType && (
        <DeleteJobTypeDialog
          jobType={deleteJobType}
          open={!!deleteJobType}
          onOpenChange={(open) => !open && setDeleteJobType(null)}
          onJobTypeDeleted={handleJobTypeDeleted}
        />
      )}
    </div>
  );
}

