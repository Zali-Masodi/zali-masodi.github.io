import React, { useState, useRef } from 'react'
import Section from './Section'

type Language = 'EN' | 'TH'

interface Product {
    nameEN: string
    nameTH: string
    price: string
    image: string
}

interface ProductsProps {
    lang: Language
}

// Add Thai names here
const products: Product[] = [
    { nameEN: 'Rose Bouquet', nameTH: 'ช่อดอกกุหลาบ', price: '1,200 ฿', image: '/Flower_1.jpeg' },
    { nameEN: 'Peony Arrangement', nameTH: 'ช่อดอกโบตั๋น', price: '1,500 ฿', image: '/Flower_3_Red.jpeg' },
    { nameEN: 'Custom Floral Box', nameTH: 'กล่องดอกไม้สั่งทำ', price: '1,800 ฿', image: '/Flower_3_Pink.jpeg' },
    { nameEN: 'Rose Bouquet', nameTH: 'ช่อดอกกุหลาบ', price: '1,200 ฿', image: '/Flower_Big.jpeg' },
    { nameEN: 'Peony Arrangement', nameTH: 'ช่อดอกโบตั๋น', price: '1,500 ฿', image: '/Flower_6_Red.jpeg' },
    { nameEN: 'Custom Floral Box', nameTH: 'กล่องดอกไม้สั่งทำ', price: '1,800 ฿', image: '/Flower_6_Pink.jpeg' },
]

const ProductsSection: React.FC<ProductsProps> = ({ lang }) => {
    const [index, setIndex] = useState(1)
    const [transitioning, setTransitioning] = useState(true)
    const sliderRef = useRef<HTMLDivElement>(null)

    const slides = [products[products.length - 1], ...products, products[0]]

    const next = () => {
        if (!transitioning) return
        const newIndex = index + 1
        setIndex(newIndex)
        sliderRef.current!.style.transition = 'transform 0.5s ease-in-out'
        sliderRef.current!.style.transform = `translateX(-${newIndex * (100 / slides.length)}%)`
    }

    const prev = () => {
        if (!transitioning) return
        const newIndex = index - 1
        setIndex(newIndex)
        sliderRef.current!.style.transition = 'transform 0.5s ease-in-out'
        sliderRef.current!.style.transform = `translateX(-${newIndex * (100 / slides.length)}%)`
    }

    const handleTransitionEnd = () => {
        if (index === 0) {
            sliderRef.current!.style.transition = 'none'
            const realIndex = products.length
            setIndex(realIndex)
            sliderRef.current!.style.transform = `translateX(-${realIndex * (100 / slides.length)}%)`
        } else if (index === products.length + 1) {
            sliderRef.current!.style.transition = 'none'
            const realIndex = 1
            setIndex(realIndex)
            sliderRef.current!.style.transform = `translateX(-${realIndex * (100 / slides.length)}%)`
        }
    }

    const currentProduct = products[(index - 1 + products.length) % products.length]

    return (
        <Section id="products" title={lang === 'EN' ? 'Products' : 'สินค้า'} style={{minHeight: '80vw', paddingTop: '5vw'}}>
            {/* Heading */}
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
                {lang === 'EN' ? 'Our Products' : 'สินค้าของเรา'}
            </h2>

            <p style={{ maxWidth: '700px', margin: '0 auto 2rem', textAlign: 'center', color: '#555' }}>
                {lang === 'EN'
                    ? 'Explore a curated selection of our handcrafted textile flowers. If you don’t see exactly what you’re looking for, we are happy to create a custom piece tailored just for you.'
                    : 'สำรวจคอลเลกชันดอกไม้ผ้าแฮนด์เมดของเรา หากคุณไม่พบสิ่งที่ต้องการ เรายินดีรับทำออเดอร์พิเศษตามความต้องการของคุณ'}
            </p>

            {/* Card container */}
            <div
                style={{
                    position: 'relative',
                    maxWidth: '650px',
                    width: '95%',
                    margin: '0 auto',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                    backgroundColor: '#fff',
                    textAlign: 'center',
                }}
            >
                {/* Slider */}
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                    <div
                        ref={sliderRef}
                        style={{
                            display: 'flex',
                            width: `${slides.length * 100}%`,
                            transform: `translateX(-${index * (100 / slides.length)}%)`,
                            transition: transitioning ? 'transform 0.5s ease-in-out' : 'none',
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {slides.map((product, idx) => (
                            <img
                                key={idx}
                                src={product.image}
                                alt={product.nameEN}
                                style={{
                                    width: `${100 / slides.length}%`,
                                    aspectRatio: '1 / 1',
                                    objectFit: 'cover',
                                    objectPosition: '50% 80%',
                                    flexShrink: 0,
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <button
                        onClick={prev}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '0.5rem',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            color: 'var(--color-mauve)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2.5rem',
                            height: '2.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            zIndex: 10,
                        }}
                    >
                        ‹
                    </button>
                    <button
                        onClick={next}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            right: '0.5rem',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            color: 'var(--color-mauve)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '2.5rem',
                            height: '2.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            zIndex: 10,
                        }}
                    >
                        ›
                    </button>
                </div>

                {/* Product name & price */}
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <h3 style={{ color: '#A57B80', marginBottom: '0.5rem' }}>
                        {lang === 'EN' ? currentProduct.nameEN : currentProduct.nameTH}
                    </h3>
                    <p style={{ fontWeight: 500 }}>{currentProduct.price}</p>
                </div>

                {/* Thumbnails */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        marginTop: '1rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {products.map((product, idx) => (
                        <img
                            key={idx}
                            src={product.image}
                            alt={product.nameEN}
                            onClick={() => setIndex(idx + 1)}
                            style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                border:
                                    idx === ((index - 1 + products.length) % products.length)
                                        ? '2px solid var(--color-mauve)'
                                        : '2px solid transparent',
                                transition: 'border 0.2s',
                            }}
                        />
                    ))}
                </div>
            </div>
        </Section>
    )
}

export default ProductsSection
