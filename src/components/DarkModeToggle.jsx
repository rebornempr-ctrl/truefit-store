import { motion } from 'framer-motion'

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: isDark ? '#8B2020' : 'rgba(0,0,0,0.15)',
        position: 'relative',
        cursor: 'none',
        border: 'none',
        padding: 0,
        transition: 'background 0.3s ease',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: isDark ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          width: 18, height: 18,
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem',
        }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  )
}
