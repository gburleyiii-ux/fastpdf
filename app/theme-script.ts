// This script runs before React hydration to prevent theme flash
(function() {
  function getTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  const theme = getTheme()
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})();
