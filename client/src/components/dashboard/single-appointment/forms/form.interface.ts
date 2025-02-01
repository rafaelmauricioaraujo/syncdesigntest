export interface ReportItem {
	description: string;
	costCode: string;
	images: string[];
	[key: string]: string | string[];

}
export interface Report {
	createdAt: Date;
  title: string;
  description: string;
  images: string[];
  type: string;
  parts: string;
  links: string[];
  user: string;
  approvalNeeded: boolean | null;
  items?: ReportItem[];
}