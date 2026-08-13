import { describe, it, expect } from 'vitest'
import { calculatorReducer, formatResult, initialCalculatorState } from './calculator'
import type { CalculatorState } from './calculator'

function dispatchAll(state: CalculatorState, actions: Parameters<typeof calculatorReducer>[1][]): CalculatorState {
  return actions.reduce(calculatorReducer, state)
}

describe('calculatorReducer', () => {
  it('数字を入力すると display に連結される', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '1' },
      { type: 'digit', digit: '2' },
    ])
    expect(state.display).toBe('12')
  })

  it('先頭が 0 のときは数字で上書きされる', () => {
    const state = calculatorReducer(initialCalculatorState, { type: 'digit', digit: '5' })
    expect(state.display).toBe('5')
  })

  it('小数点は1つの数値に1回しか入力できない', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '3' },
      { type: 'decimal' },
      { type: 'digit', digit: '1' },
      { type: 'decimal' },
      { type: 'digit', digit: '4' },
    ])
    expect(state.display).toBe('3.14')
  })

  it('基本演算: 2 + 3 = 5', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'equals' },
    ])
    expect(state.display).toBe('5')
  })

  it('連続演算: 5 + 3 + 2 = 10', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '3' },
      { type: 'operator', operator: '+' },
      { type: 'digit', digit: '2' },
      { type: 'equals' },
    ])
    expect(state.display).toBe('10')
  })

  it('演算子を連続で押すと差し替えられ previousValue は変化しない', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '+' },
      { type: 'operator', operator: '×' },
      { type: 'digit', digit: '2' },
      { type: 'equals' },
    ])
    expect(state.previousValue).toBeNull()
    expect(state.display).toBe('10')
  })

  it('ゼロ除算は Error になる', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '÷' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
    ])
    expect(state.display).toBe('Error')
    expect(state.isError).toBe(true)
  })

  it('演算結果がオーバーフローした場合も isError が true になる', () => {
    const huge: CalculatorState = { ...initialCalculatorState, display: '1e300' }
    const state = calculatorReducer(huge, { type: 'operator', operator: '×' })
    const next = calculatorReducer({ ...state, display: '1e300' }, { type: 'equals' })
    expect(next.display).toBe('Error')
    expect(next.isError).toBe(true)
  })

  it('Error 状態から数字を入力すると自動的にリセットされる', () => {
    const errorState = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '5' },
      { type: 'operator', operator: '÷' },
      { type: 'digit', digit: '0' },
      { type: 'equals' },
    ])
    const next = calculatorReducer(errorState, { type: 'digit', digit: '7' })
    expect(next.display).toBe('7')
    expect(next.isError).toBe(false)
  })

  it('clear (AC) は常に初期状態へ戻す', () => {
    const state = dispatchAll(initialCalculatorState, [
      { type: 'digit', digit: '1' },
      { type: 'digit', digit: '2' },
      { type: 'operator', operator: '+' },
      { type: 'clear' },
    ])
    expect(state).toEqual(initialCalculatorState)
  })
})

describe('formatResult', () => {
  it('浮動小数点誤差を丸める（0.1 + 0.2）', () => {
    expect(formatResult(0.1 + 0.2)).toBe('0.3')
  })

  it('非常に大きい数値は指数表記になる', () => {
    expect(formatResult(1e13)).toBe((1e13).toExponential(6))
  })

  it('通常の数値はそのまま文字列化される', () => {
    expect(formatResult(42)).toBe('42')
  })
})
