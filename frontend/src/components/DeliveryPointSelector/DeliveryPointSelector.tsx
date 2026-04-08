import React, { useEffect, useRef, useState } from 'react'
import './DeliveryPointSelector.css'

interface YaDeliveryWidget {
  createWidget: (config: WidgetConfig) => void
}

interface WidgetConfig {
  containerId: string
  params: WidgetParams
}

interface WidgetParams {
  size: {
    height: string
    width: string
  }
  source_platform_station?: string
  physical_dims_weight_gross?: number
  delivery_price?: string | ((price: number) => string)
  delivery_term?: string | number
  show_select_button: boolean
  filter: {
    type: Array<'pickup_point' | 'terminal'>
    is_yandex_branded?: boolean
    payment_methods: Array<'already_paid' | 'cash_on_receipt' | 'card_on_receipt'>
    payment_methods_filter?: 'or' | 'and'
  }
}

interface PointSelectedDetail {
  id: string
  address: {
    full_address: string
    country: string
    locality: string
    street: string
    house: string
    comment?: string
  }
  type?: string
  payment_methods?: string[]
}

declare global {
  interface Window {
    YaDelivery?: YaDeliveryWidget
  }
}

interface Props {
  onSelect: (point: any) => void
  selectedPoint: any
}

const DeliveryPointSelector: React.FC<Props> = ({ onSelect }) => {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)
  const scriptLoadedRef = useRef(false)
  const widgetInitializedRef = useRef(false)
  const eventListenerRef = useRef(false)

  useEffect(() => {
    if (scriptLoadedRef.current) {
      setIsWidgetLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://ndd-widget.landpro.site/widget.js'
    script.async = true

    script.onload = () => {
      console.log('✅ Виджет Яндекс.Доставки загружен')
      scriptLoadedRef.current = true
      setIsWidgetLoaded(true)
    }

    script.onerror = () => {
      console.error('❌ Ошибка загрузки виджета Яндекс.Доставки')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
    }
  }, [])

  useEffect(() => {
    if (!isWidgetLoaded || widgetInitializedRef.current) return

    const initWidget = () => {
      if (!window.YaDelivery) {
        console.error('❌ YaDelivery API не загружен')
        setTimeout(initWidget, 500)
        return
      }

      try {
        console.log('🔧 Инициализация виджета Яндекс.Доставки...')
        
        window.YaDelivery.createWidget({
          containerId: 'ya-delivery-widget-container',
          params: {
            size: {
              height: '720px',
              width: '100%'
            },
            source_platform_station: '464faa8d-46b2-492c-ace8-88488f76eaeb',
            physical_dims_weight_gross: 5000,
            delivery_price: 'Бесплатно',
            delivery_term: 1,
            show_select_button: false,
            filter: {
              type: ['pickup_point', 'terminal'],
              is_yandex_branded: false,
              payment_methods: ['already_paid', 'card_on_receipt'],
              payment_methods_filter: 'or'
            }
          }
        })

        widgetInitializedRef.current = true
        console.log('✅ Виджет Яндекс.Доставки инициализирован')
      } catch (error) {
        console.error('❌ Ошибка инициализации виджета:', error)
      }
    }

    if (window.YaDelivery) {
      initWidget()
    } else {
      const handleLoad = () => {
        initWidget()
        document.removeEventListener('YaNddWidgetLoad', handleLoad)
      }
      document.addEventListener('YaNddWidgetLoad', handleLoad)
    }
  }, [isWidgetLoaded])

  useEffect(() => {
    if (eventListenerRef.current) return

    const handlePointSelected = (event: Event) => {
      const customEvent = event as CustomEvent<PointSelectedDetail>
      const pointData = customEvent.detail

      console.log('✅ Выбран пункт выдачи:', pointData)

      onSelect({
        id: pointData.id,
        name: pointData.address.full_address,
        address: {
          fullname: pointData.address.full_address,
          city: pointData.address.locality,
          street: pointData.address.street,
          house: pointData.address.house,
          comment: pointData.address.comment
        },
        type: pointData.type,
        payment_methods: pointData.payment_methods
      })
    }

    document.addEventListener('YaNddWidgetPointSelected', handlePointSelected)
    eventListenerRef.current = true

    return () => {
      document.removeEventListener('YaNddWidgetPointSelected', handlePointSelected)
      eventListenerRef.current = false
    }
  }, [onSelect])

  return (
    <div className="yandex-delivery-widget">
      <div id="ya-delivery-widget-container" className="yandex-widget-container">
        {!isWidgetLoaded && (
          <div className="yandex-loading">
            <div className="yandex-spinner"></div>
            <p>Загрузка виджета Яндекс.Доставки...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeliveryPointSelector
