import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OrchidCard from '../components/OrchidCard'

const sample = {
  id: '99',
  orchidName: 'Test Orchid',
  description: 'Test description',
  category: 'Cattleya',
  isSpecial: true,
  image: 'https://example.com/test.jpg',
  origin: 'Vietnam',
  color: 'White',
  rating: 5
}

describe('OrchidCard component', () => {
  it('renders the orchid name', () => {
    render(<OrchidCard orchid={sample} onShowDetail={() => {}} />)
    expect(screen.getByText('Test Orchid')).toBeInTheDocument()
  })

  it('renders the orchid category', () => {
    render(<OrchidCard orchid={sample} onShowDetail={() => {}} />)
    expect(screen.getByText(/Cattleya/i)).toBeInTheDocument()
  })

  it('renders the orchid image with correct src', () => {
    const { container } = render(
      <OrchidCard orchid={sample} onShowDetail={() => {}} />
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img.getAttribute('src')).toBe(sample.image)
  })

  it('has a Detail button', () => {
    render(<OrchidCard orchid={sample} onShowDetail={() => {}} />)
    expect(screen.getByRole('button', { name: /detail/i })).toBeInTheDocument()
  })

  it('calls onShowDetail with the orchid when Detail clicked', () => {
    const handler = vi.fn()
    render(<OrchidCard orchid={sample} onShowDetail={handler} />)
    fireEvent.click(screen.getByRole('button', { name: /detail/i }))
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(sample)
  })
})
