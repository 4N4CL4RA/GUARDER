declare global {
  interface Window {
    openLocationDetails: (reviewId: string) => void
    getDirections: (lat: number, lng: number) => void
  }
}

export {}
