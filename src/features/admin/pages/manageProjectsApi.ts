import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/core/services/projectService';
import { getGroups } from '@/core/services/groupService';
import type { CreateProjectDTO } from '@/core/services/projectService';
import type { UpdateProjectInput } from '@/core/services/projectService';

export async function fetchProjects() {
  return await getProjects();
}

export async function fetchGroups() {
  return await getGroups();
}

export async function createProjectApi(input: CreateProjectDTO) {
  return await createProject(input);
}

export async function updateProjectApi(id: string, input: UpdateProjectInput) {
  return await updateProject(id, input);
}

export async function deleteProjectApi(id: string) {
  return await deleteProject(id);
}

export default {
  fetchProjects,
  fetchGroups,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
};
