import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OrchidDetailModal from '../components/OrchidDetailModal'

const sample = {
  id: '10',
  orchidName: 'Modal Orchid',
  description: 'A beautiful detail description.',
  category: 'Dendrobium',
  isSpecial: true,
  image: 'https://example.com/modal.jpg',
  origin: 'Thailand',
  color: 'Pink',
  rating: 4
}

describe('OrchidDetailModal component', () => {
  it('is hidden when show is false', () => {
    render(
      <OrchidDetailModal show={false} orchid={sample} onClose={() => {}} />
    )
    expect(screen.queryByText('Modal Orchid')).not.toBeInTheDocument()
  })

  it('shows orchid name in title when show is true', () => {
    render(<OrchidDetailModal show={true} orchid={sample} onClose={() => {}} />)
    expect(screen.getByText('Modal Orchid')).toBeInTheDocument()
  })

  it('shows orchid description in body', () => {
    render(<OrchidDetailModal show={true} orchid={sample} onClose={() => {}} />)
    expect(
      screen.getByText('A beautiful detail description.')
    ).toBeInTheDocument()
  })

  it('renders the orchid image inside the modal', () => {
    const { container } = render(
      <OrchidDetailModal show={true} orchid={sample} onClose={() => {}} />
    )
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img.getAttribute('src')).toBe(sample.image)
  })

  it('calls onClose when Close button is clicked', () => {
    const handler = vi.fn()
    render(
      <OrchidDetailModal show={true} orchid={sample} onClose={handler} />
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(handler).toHaveBeenCalled()
  })
})
