import React from 'react'
import './MegaMenu.css'
import AppleMenu from './megamenu/AppleMenu'
import SmartphonesMenu from './megamenu/SmartphonesMenu'
import ComputersMenu from './megamenu/ComputersMenu'
import TvAudioMenu from './megamenu/TvAudioMenu'
import HomeMenu from './megamenu/HomeMenu'
import BeautyMenu from './megamenu/BeautyMenu'
import EntertainmentMenu from './megamenu/EntertainmentMenu'
import TravelMenu from './megamenu/TravelMenu'
import AccessoriesMenu from './megamenu/AccessoriesMenu'

interface MegaMenuProps {
  category: string
  isOpen: boolean
}

const MegaMenu: React.FC<MegaMenuProps> = ({ category, isOpen }) => {
  if (!isOpen) return null

  const renderCategoryContent = () => {
    switch (category) {
      case 'apple':
        return <AppleMenu />
      case 'smartphones':
        return <SmartphonesMenu />
      case 'computers':
        return <ComputersMenu />
      case 'tv-audio':
        return <TvAudioMenu />
      case 'home':
        return <HomeMenu />
      case 'beauty':
        return <BeautyMenu />
      case 'entertainment':
        return <EntertainmentMenu />
      case 'travel':
        return <TravelMenu />
      case 'accessories':
        return <AccessoriesMenu />
      default:
        return null
    }
  }

  return (
    <div className="mega-menu">
      <div className="mega-menu-container">
        {renderCategoryContent()}
      </div>
    </div>
  )
}

export default MegaMenu
