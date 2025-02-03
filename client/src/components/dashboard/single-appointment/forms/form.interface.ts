export interface ReportItem {
	description: string;
	costCode: string;
	images: {
    url: string;
    isDeleted: boolean;
  }[];
	[key: string]: string | string[];

}
export interface Report {
	createdAt: Date;
  title: string;
  description: string;
  images: {
    url: string;
    isDeleted: boolean;
  }[];
  type: string;
  parts: string;
  links: string[];
  user: string;
  approvalNeeded: boolean | null;
  issueId?: string;
  items?: ReportItem[];
}