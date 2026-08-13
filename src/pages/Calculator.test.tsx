import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Calculator from './Calculator'

function getDisplay() {
  return screen.getByTestId('calculator-display')
}

describe('Calculator ページ', () => {
  it('基本演算: 2 + 3 = で 5 が表示される', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(getDisplay()).toHaveTextContent('5')
  })

  it('連続演算: 5 + 3 + 2 = で 10 が表示される', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(getDisplay()).toHaveTextContent('10')
  })

  it('ゼロ除算で Error が表示され、その後の入力で新しい計算を開始できる', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '÷' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    expect(getDisplay()).toHaveTextContent('Error')

    await user.click(screen.getByRole('button', { name: '7' }))
    expect(getDisplay()).toHaveTextContent('7')
  })

  it('AC ボタンで表示が 0 に戻る', async () => {
    const user = userEvent.setup()
    render(<Calculator />)

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    expect(getDisplay()).toHaveTextContent('12')

    await user.click(screen.getByRole('button', { name: 'AC' }))
    expect(getDisplay()).toHaveTextContent('0')
  })
})
