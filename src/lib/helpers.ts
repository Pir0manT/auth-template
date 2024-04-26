import { AlertColor } from '@mui/lab'

type Result = { code?: string; message?: string; tokenFactor?: boolean }
export type SeverityResult = {
  severity: AlertColor | undefined
  message: string
}

function createSeverityResult(result: Result): SeverityResult {
  const severityMap: Record<string, AlertColor> = {
    error: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info',
  }
  if (result.code && result.message) {
    return {
      severity: severityMap[result.code] || undefined,
      message: result.message,
    }
  } else {
    return {
      severity: undefined,
      message: '',
    }
  }
}

export function setResult<T extends Result>(
  result: T,
  setResultFunction: (result: SeverityResult) => void
) {
  const severityResult = createSeverityResult(result)
  setResultFunction(severityResult)
}
