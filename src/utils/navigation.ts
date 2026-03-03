const NAVIGATION_EVENT = 'app:navigate'

export function navigateTo(path: string, replace = false) {
  if (replace) {
    window.history.replaceState(null, '', path)
  } else {
    window.history.pushState(null, '', path)
  }

  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function onNavigate(handler: () => void): () => void {
  const onChange = () => handler()

  window.addEventListener('popstate', onChange)
  window.addEventListener(NAVIGATION_EVENT, onChange)

  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(NAVIGATION_EVENT, onChange)
  }
}
