import { getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { getMyForms } from '@/core/services/formService';
import { Project } from '@/core/interfaces/project';

export interface DashboardSummary {
  projects: Project[];
  groupCount: number;
  formCount: number;
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const [projects, groups, forms] = await Promise.all([
    getProjects(),
    getGroupsByUser(userId),
    getMyForms(),
  ]);

  const userGroupIds = new Set(groups.map((g) => g.GID));
  const userProjects = projects.filter((p) => userGroupIds.has(p.GID));

  return {
    projects: userProjects,
    groupCount: groups.length,
    formCount: forms.length,
  };
}
