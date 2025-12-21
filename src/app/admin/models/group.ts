import { Activity } from './activity';
export class Group {
  constructor(
    public groupId: number,
    public groupName: string,
    public Activities: Activity[]
  ) { }
}




