export interface ProductGroup {
  id: string;
  name: string;
  slug: string;
}

export interface CreateProductGroupRequest {
  name: string;
}

export interface CreateProductGroupResponse {
  data: ProductGroup;
  message: string;
  success: true;
}

export interface ProductGroupsResponse {
  data: ProductGroup[];
  message: string;
  success: true;
}

export interface DeleteProductGroupResponse {
  data: string;
  message: string;
  success: true;
}

export interface ProductGroupError {
  error: {
    code: string;
    details?: Record<string, unknown>;
    message: string;
  };
  message: string;
  success: false;
}

