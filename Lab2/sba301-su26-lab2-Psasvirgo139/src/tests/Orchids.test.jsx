import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Orchids from '../components/Orchids'
import { OrchidsData } from '../shared/ListOfOrchids'

describe('Orchids component', () => {
  it('renders a card for every orchid in the data', () => {
    const { container } = render(<Orchids />)
    const cards = container.querySelectorAll('.card')
    expect(cards.length).toBe(OrchidsData.length)
  })

  it('renders the name of the first orchid', () => {
    render(<Orchids />)
    expect(screen.getByText(OrchidsData[0].orchidName)).toBeInTheDocument()
  })

  it('opens the modal showing detail when a Detail button is clicked', () => {
    render(<Orchids />)
    const buttons = screen.getAllByRole('button', { name: /detail/i })
    fireEvent.click(buttons[0])
    const matches = screen.getAllByText(OrchidsData[0].orchidName)
    expect(matches.length).toBeGreaterThan(1)
  })

  it('closes the modal when Close button is clicked', () => {
    render(<Orchids />)
    const buttons = screen.getAllByRole('button', { name: /detail/i })
    fireEvent.click(buttons[0])
    const closeBtn = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeBtn)
    expect(
      screen.queryByText(OrchidsData[0].description)
    ).not.toBeInTheDocument()
  })
})
