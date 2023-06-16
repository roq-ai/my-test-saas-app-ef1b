import { UserInterface } from 'interfaces/user';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface ContentItemInterface {
  id?: string;
  title: string;
  content: string;
  status: string;
  creator_id?: string;
  editor_id?: string;
  reviewer_id?: string;
  company_id?: string;
  created_at?: any;
  updated_at?: any;

  user_content_item_creator_idTouser?: UserInterface;
  user_content_item_editor_idTouser?: UserInterface;
  user_content_item_reviewer_idTouser?: UserInterface;
  company?: CompanyInterface;
  _count?: {};
}

export interface ContentItemGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  content?: string;
  status?: string;
  creator_id?: string;
  editor_id?: string;
  reviewer_id?: string;
  company_id?: string;
}
