"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Briefcase } from "lucide-react";
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
import { CreateJobCategoryDialog } from "./create-job-category-dialog";
import { DeleteJobCategoryDialog } from "./delete-job-category-dialog";
import type { JobCategory } from "@/types/job-category";

interface JobCategoriesPageClientProps {
  initialJobCategories: JobCategory[];
}

export function JobCategoriesPageClient({
  initialJobCategories,
}: JobCategoriesPageClientProps) {
  const router = useRouter();
  const [jobCategories, setJobCategories] = useState<JobCategory[]>(initialJobCategories);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteJobCategory, setDeleteJobCategory] = useState<JobCategory | null>(null);

  const handleJobCategoryCreated = useCallback(
    (newJobCategory: JobCategory) => {
      setJobCategories((prev) => [...prev, newJobCategory]);
      setIsCreateDialogOpen(false);
      router.refresh();
    },
    [router]
  );

  const handleJobCategoryDeleted = useCallback(
    (deletedSlug: string) => {
      setJobCategories((prev) => prev.filter((jc) => jc.slug !== deletedSlug));
      setDeleteJobCategory(null);
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
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Danh mục công việc</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý danh sách danh mục công việc
                </p>
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục công việc
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {jobCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Chưa có danh mục công việc nào
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu bằng cách thêm danh mục công việc đầu tiên của bạn
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm danh mục công việc
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">STT</TableHead>
                  <TableHead>Tên danh mục công việc</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobCategories.map((jobCategory, index) => (
                  <TableRow key={jobCategory.id}>
                    <TableCell className="text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {jobCategory.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {jobCategory.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteJobCategory(jobCategory)}
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

      <CreateJobCategoryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onJobCategoryCreated={handleJobCategoryCreated}
      />

      {deleteJobCategory && (
        <DeleteJobCategoryDialog
          jobCategory={deleteJobCategory}
          open={!!deleteJobCategory}
          onOpenChange={(open) => !open && setDeleteJobCategory(null)}
          onJobCategoryDeleted={handleJobCategoryDeleted}
        />
      )}
    </div>
  );
}

