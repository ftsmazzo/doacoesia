export type Donor = {
  id: string;
  name: string;
  donorType: "PF" | "PJ";
  document: string;
  email: string;
  phone?: string;
};

export type DonationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED";

export type Donation = {
  id: string;
  title: string;
  description: string;
  targetAxis: string;
  proposedQuantity?: number;
  status: DonationStatus;
  donor: Donor;
  createdAt: string;
};

export type DonationListResponse = {
  data: Donation[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
};

export type DonationDocument = {
  id: string;
  donationId: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  objectKey: string;
  createdAt: string;
};

export type DashboardSummary = {
  status: {
    received: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  axis: Array<{
    axis: string;
    received: number;
    underReview: number;
    approved: number;
    rejected: number;
  }>;
};
