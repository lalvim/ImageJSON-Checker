export type Label = {
    isCorrect: boolean
    observation?: string
  }
  
  export type ShowLabelProps = {
    fileName: string
    jsonData: any
    imageName: string
    existingLabel?: Label
  }