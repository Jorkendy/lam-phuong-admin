"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Package } from "lucide-react";
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
import { CreateProductGroupDialog } from "./create-product-group-dialog";
import { DeleteProductGroupDialog } from "./delete-product-group-dialog";
import type { ProductGroup } from "@/types/product-group";

interface ProductGroupsPageClientProps {
  initialProductGroups: ProductGroup[];
}

export function ProductGroupsPageClient({
  initialProductGroups,
}: ProductGroupsPageClientProps) {
  const router = useRouter();
  const [productGroups, setProductGroups] = useState<ProductGroup[]>(initialProductGroups);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteProductGroup, setDeleteProductGroup] = useState<ProductGroup | null>(null);

  const handleProductGroupCreated = useCallback(
    (newProductGroup: ProductGroup) => {
      setProductGroups((prev) => [...prev, newProductGroup]);
      setIsCreateDialogOpen(false);
      router.refresh();
    },
    [router]
  );

  const handleProductGroupDeleted = useCallback(
    (deletedSlug: string) => {
      setProductGroups((prev) => prev.filter((pg) => pg.slug !== deletedSlug));
      setDeleteProductGroup(null);
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
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Nhóm sản phẩm</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý danh sách nhóm sản phẩm
                </p>
              </div>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhóm sản phẩm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {productGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Chưa có nhóm sản phẩm nào
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu bằng cách thêm nhóm sản phẩm đầu tiên của bạn
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhóm sản phẩm
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">STT</TableHead>
                  <TableHead>Tên nhóm sản phẩm</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productGroups.map((productGroup, index) => (
                  <TableRow key={productGroup.id}>
                    <TableCell className="text-muted-foreground font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {productGroup.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {productGroup.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteProductGroup(productGroup)}
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

      <CreateProductGroupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProductGroupCreated={handleProductGroupCreated}
      />

      {deleteProductGroup && (
        <DeleteProductGroupDialog
          productGroup={deleteProductGroup}
          open={!!deleteProductGroup}
          onOpenChange={(open) => !open && setDeleteProductGroup(null)}
          onProductGroupDeleted={handleProductGroupDeleted}
        />
      )}
    </div>
  );
}

