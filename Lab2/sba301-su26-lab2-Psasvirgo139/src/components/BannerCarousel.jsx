import React from 'react'
import { Carousel } from 'react-bootstrap'
import { BannersData } from '../shared/ListOfBanners'

export default function BannerCarousel() {
  return (
    <Carousel fade interval={2000} className="mt-4">
      {BannersData.map((banner, index) => (
        <Carousel.Item key={banner.id || index}>
          <img
            className="d-block w-100"
            src={banner.image}
            alt={banner.title}
            style={{ height: "500px", objectFit: "cover" }}
          />

          <Carousel.Caption>
            <h3>{banner.title}</h3>
            <p>{banner.caption}</p> 
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
