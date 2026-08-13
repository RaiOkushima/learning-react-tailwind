import { useReducer } from 'react'
import { calculatorReducer, formatResult, initialCalculatorState } from '../utils/calculator'
import type { Operator } from '../utils/calculator'

const baseButtonClass = 'rounded-xl py-4 text-xl font-medium transition-colors active:scale-95'
const numberButtonClass = `${baseButtonClass} bg-slate-700 text-white hover:bg-slate-600`
const functionButtonClass = `${baseButtonClass} bg-slate-300 text-slate-900 hover:bg-slate-200`

function operatorButtonClass(active: boolean) {
  return `${baseButtonClass} ${active ? 'bg-white text-blue-600' : 'bg-blue-600 text-white hover:bg-blue-500'}`
}

function Calculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState)

  const pending =
    state.previousValue !== null && state.operator ? `${formatResult(state.previousValue)} ${state.operator}` : ''

  const isActiveOperator = (operator: Operator) => state.operator === operator && state.waitingForNewValue

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">電卓</h1>
      <p className="mt-2 text-slate-600">ReactとTailwind CSSだけで実装したシンプルな電卓です。</p>

      <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-slate-900 p-4 shadow-lg">
        <div className="mb-4 space-y-1 rounded-xl bg-slate-800 px-4 py-6 text-right">
          <p className="h-5 text-sm text-slate-400">{pending}</p>
          <p data-testid="calculator-display" className="truncate text-4xl font-semibold text-white">
            {state.display}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            className={`${functionButtonClass} col-span-3`}
            onClick={() => dispatch({ type: 'clear' })}
          >
            AC
          </button>
          <button
            type="button"
            className={operatorButtonClass(isActiveOperator('÷'))}
            onClick={() => dispatch({ type: 'operator', operator: '÷' })}
          >
            ÷
          </button>

          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '7' })}>
            7
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '8' })}>
            8
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '9' })}>
            9
          </button>
          <button
            type="button"
            className={operatorButtonClass(isActiveOperator('×'))}
            onClick={() => dispatch({ type: 'operator', operator: '×' })}
          >
            ×
          </button>

          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '4' })}>
            4
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '5' })}>
            5
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '6' })}>
            6
          </button>
          <button
            type="button"
            className={operatorButtonClass(isActiveOperator('-'))}
            onClick={() => dispatch({ type: 'operator', operator: '-' })}
          >
            -
          </button>

          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '1' })}>
            1
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '2' })}>
            2
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'digit', digit: '3' })}>
            3
          </button>
          <button
            type="button"
            className={operatorButtonClass(isActiveOperator('+'))}
            onClick={() => dispatch({ type: 'operator', operator: '+' })}
          >
            +
          </button>

          <button
            type="button"
            className={`${numberButtonClass} col-span-2`}
            onClick={() => dispatch({ type: 'digit', digit: '0' })}
          >
            0
          </button>
          <button type="button" className={numberButtonClass} onClick={() => dispatch({ type: 'decimal' })}>
            .
          </button>
          <button type="button" className={operatorButtonClass(false)} onClick={() => dispatch({ type: 'equals' })}>
            =
          </button>
        </div>
      </div>
    </section>
  )
}

export default Calculator
