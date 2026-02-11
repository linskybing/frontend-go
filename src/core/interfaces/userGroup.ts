export interface GetGroupsByUserResponse {
  code: number;
  message: string;
  data: {
    [key: string]: {
      UID: string;
      UserName: string;
      Groups: UserGroupGroup[];
    };
  };
}

export interface GetUsersByGroupResponse {
  code: number;
  message: string;
  data: {
    [key: string]: {
      GID: string;
      GroupName: string;
      Users: UserGroupUser[];
    };
  };
}

export interface UserGroup {
  UID: string;
  GID: string;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface UserGroupUser {
  UID: string;
  Username: string;
  Role: 'admin' | 'manager' | 'user';
}

export interface UserGroupGroup {
  GID: string;
  GroupName: string;
  Role: 'admin' | 'manager' | 'user';
}
