export type Operator = '+' | '-' | '×' | '÷'

export type CalculatorState = {
  display: string
  previousValue: number | null
  operator: Operator | null
  waitingForNewValue: boolean
  isError: boolean
}

export type CalculatorAction =
  | { type: 'digit'; digit: string }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }
  | { type: 'clear' }

export const initialCalculatorState: CalculatorState = {
  display: '0',
  previousValue: null,
  operator: null,
  waitingForNewValue: false,
  isError: false,
}

const MAX_DISPLAY_DIGITS = 15

function calculate(a: number, b: number, operator: Operator): number | null {
  switch (operator) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '×':
      return a * b
    case '÷':
      return b === 0 ? null : a / b
  }
}

export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return 'Error'
  if (value !== 0 && (Math.abs(value) >= 1e12 || Math.abs(value) < 1e-9)) {
    return value.toExponential(6)
  }
  return parseFloat(value.toPrecision(12)).toString()
}

export function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  if (state.isError && action.type !== 'clear') {
    return calculatorReducer(initialCalculatorState, action)
  }

  switch (action.type) {
    case 'digit': {
      if (state.waitingForNewValue) {
        return { ...state, display: action.digit, waitingForNewValue: false }
      }
      if (state.display === '0') {
        return { ...state, display: action.digit }
      }
      if (state.display.replace('-', '').length >= MAX_DISPLAY_DIGITS) return state
      return { ...state, display: state.display + action.digit }
    }

    case 'decimal': {
      if (state.waitingForNewValue) return { ...state, display: '0.', waitingForNewValue: false }
      if (state.display.includes('.')) return state
      return { ...state, display: state.display + '.' }
    }

    case 'operator': {
      const current = parseFloat(state.display)
      if (state.operator !== null && state.waitingForNewValue) {
        return { ...state, operator: action.operator }
      }
      if (state.operator !== null && state.previousValue !== null) {
        const result = calculate(state.previousValue, current, state.operator)
        if (result === null || !Number.isFinite(result)) {
          return { ...initialCalculatorState, display: 'Error', isError: true }
        }
        return {
          display: formatResult(result),
          previousValue: result,
          operator: action.operator,
          waitingForNewValue: true,
          isError: false,
        }
      }
      return { ...state, previousValue: current, operator: action.operator, waitingForNewValue: true }
    }

    case 'equals': {
      if (state.operator === null || state.previousValue === null) return state
      const current = parseFloat(state.display)
      const result = calculate(state.previousValue, current, state.operator)
      if (result === null || !Number.isFinite(result)) {
        return { ...initialCalculatorState, display: 'Error', isError: true }
      }
      return {
        display: formatResult(result),
        previousValue: null,
        operator: null,
        waitingForNewValue: true,
        isError: false,
      }
    }

    case 'clear':
      return initialCalculatorState
  }
}
