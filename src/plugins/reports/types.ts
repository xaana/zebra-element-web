// export enum StepStatus {
//   DONE = 'done',
//   CURRENT = 'current',
//   PENDING = 'pending',
// }

export type StepItem = {
  id: number
  text: string
  // status: StepStatus
  title: string
  description: string
  nextStepTitle: string
}

export type Template = {
  name: string
  description: string
  id: string
  createdAt: Date
  content: Object
}

export type File = {
  id: string
  name: string
  owner: string
  createdAt: Date
}
