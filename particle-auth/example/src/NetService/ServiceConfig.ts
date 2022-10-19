import { ParticleInfo } from './ParticleInfo'

export function ServiceConfig(projectId: string, clientKey: string) {
    ParticleInfo.projectId = projectId
    ParticleInfo.clientKey = clientKey
}