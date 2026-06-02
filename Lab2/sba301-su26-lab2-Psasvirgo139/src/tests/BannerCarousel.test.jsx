import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BannerCarousel from '../components/BannerCarousel'
import { BannersData } from '../shared/ListOfBanners'

describe('BannerCarousel component', () => {
  it('renders a carousel container', () => {
    const { container } = render(<BannerCarousel />)
    const carousel = container.querySelector('.carousel')
    expect(carousel).not.toBeNull()
  })

  it('renders one carousel item per banner', () => {
    const { container } = render(<BannerCarousel />)
    const items = container.querySelectorAll('.carousel-item')
    expect(items.length).toBe(BannersData.length)
  })

  it('renders an <img> for each banner with correct src', () => {
    const { container } = render(<BannerCarousel />)
    const imgs = container.querySelectorAll('.carousel-item img')
    expect(imgs.length).toBe(BannersData.length)
    BannersData.forEach((banner, idx) => {
      expect(imgs[idx].getAttribute('src')).toBe(banner.image)
    })
  })
})
